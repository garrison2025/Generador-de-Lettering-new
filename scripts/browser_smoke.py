import os
import sys
import time
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.environ.get("SMOKE_BASE_URL", "http://127.0.0.1:4173").rstrip("/")

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=390,844")
options.add_argument("--force-device-scale-factor=1")
options.page_load_strategy = "eager"
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

driver = webdriver.Chrome(options=options)
driver.execute_cdp_cmd(
    "Page.addScriptToEvaluateOnNewDocument",
    {
        "source": """
          window.__smokeCLS = 0;
          try {
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) window.__smokeCLS += entry.value;
              }
            }).observe({ type: 'layout-shift', buffered: true });
          } catch (_) {
            window.__smokeCLS = 0;
          }
        """
    },
)
wait = WebDriverWait(driver, 12)


def fail(message: str) -> None:
    raise AssertionError(message)


def open_path(path: str, h1: str | None = None) -> None:
    driver.get(f"{BASE_URL}{path}")
    wait.until(EC.presence_of_element_located((By.ID, "main-content")))
    if h1:
        heading = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#main-content h1")))
        if h1.lower() not in heading.text.lower():
            fail(f"{path}: expected H1 containing {h1!r}, got {heading.text!r}")
    assert_no_horizontal_overflow(path)
    assert_no_runtime_errors(path)
    assert_layout_stability(path)


def assert_no_horizontal_overflow(label: str) -> None:
    overflow = driver.execute_script(
        """
        const doc = document.documentElement;
        const body = document.body;
        return Math.max(doc.scrollWidth, body ? body.scrollWidth : 0) - doc.clientWidth;
        """
    )
    if overflow > 2:
        offenders = driver.execute_script(
            """
            const width = document.documentElement.clientWidth;
            return [...document.querySelectorAll('body *')]
              .map((el) => {
                const rect = el.getBoundingClientRect();
                return {
                  tag: el.tagName,
                  cls: typeof el.className === 'string' ? el.className : '',
                  text: (el.textContent || '').trim().slice(0, 80),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  excess: Math.round(Math.max(0, rect.right - width, -rect.left)),
                };
              })
              .filter((item) => item.excess > 2)
              .sort((a, b) => b.excess - a.excess)
              .slice(0, 8);
            """
        )
        fail(f"{label}: horizontal overflow is {overflow}px; offenders={offenders}")


def assert_no_runtime_errors(label: str) -> None:
    bad_markers = (
        "Hydration failed",
        "Minified React error",
        "Uncaught TypeError",
        "Uncaught ReferenceError",
        "Cannot read properties of",
    )
    failures = []
    for entry in driver.get_log("browser"):
        message = entry.get("message", "")
        if any(marker in message for marker in bad_markers):
            failures.append(message)
    if failures:
        fail(f"{label}: browser runtime errors: {' | '.join(failures)}")


def assert_layout_stability(label: str, threshold: float = 0.10) -> None:
    # Give hydration, lazy chunks and the local font response a short window to settle.
    time.sleep(0.2)
    cls = driver.execute_script("return Number(window.__smokeCLS || 0)")
    if cls > threshold:
        fail(f"{label}: hydration/layout CLS is {cls:.4f}, above {threshold:.2f}")


def replace_value(element, value: str) -> None:
    element.click()
    element.send_keys(Keys.CONTROL, "a")
    element.send_keys(value)


def sitemap_paths() -> list[str]:
    root = ET.parse("public/sitemap.xml").getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    paths: list[str] = []
    for loc in root.findall("sm:url/sm:loc", namespace):
        if not loc.text:
            continue
        parsed = urlparse(loc.text.strip())
        path = parsed.path or "/"
        paths.append(path)
    return paths


def assert_document_basics(path: str) -> None:
    title = driver.title.strip()
    if not title:
        fail(f"{path}: document title is empty")

    h1s = driver.find_elements(By.CSS_SELECTOR, "#main-content h1")
    if len(h1s) != 1:
        fail(f"{path}: expected exactly one H1, found {len(h1s)}")

    canonical = driver.execute_script(
        """
        const node = document.querySelector('link[rel="canonical"]');
        return node ? node.getAttribute('href') : null;
        """
    )
    expected = "https://generadordelettering.org/" if path == "/" else f"https://generadordelettering.org{path}"
    if canonical != expected:
        fail(f"{path}: canonical mismatch, expected {expected!r}, got {canonical!r}")


try:
    # First visit: consent must be usable on a phone and must not shift the page horizontally.
    driver.get(BASE_URL + "/")
    dialog = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, '[role="dialog"]')))
    assert_no_horizontal_overflow("cookie consent")
    decline = dialog.find_element(By.XPATH, ".//button[contains(., 'Rechazar')]")
    decline.click()
    wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, '[role="dialog"]')))
    consent = driver.execute_script("return localStorage.getItem('cookie_consent')")
    if consent != "declined":
        fail(f"cookie consent was not persisted as declined: {consent!r}")

    # Mobile navigation opens, closes with Escape, and does not create page overflow.
    menu_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[aria-label="Abrir menú"]')))
    menu_button.click()
    wait.until(EC.visibility_of_element_located((By.ID, "mobile-main-navigation")))
    assert_no_horizontal_overflow("mobile navigation")
    driver.switch_to.active_element.send_keys(Keys.ESCAPE)
    wait.until(EC.invisibility_of_element_located((By.ID, "mobile-main-navigation")))

    # Broad Unicode converter: long no-space input must stay inside the mobile viewport.
    open_path("/herramientas/conversor-texto", "Conversor de Letras")
    conversor = wait.until(EC.element_to_be_clickable((By.ID, "text-input")))
    replace_value(conversor, "W" * 620)
    wait.until(lambda d: len(d.find_element(By.ID, "text-input").get_attribute("value")) == 500)
    assert_no_horizontal_overflow("conversor 500-char Unicode output")

    # Clearing the input must not turn instructional text into copyable output.
    driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Borrar texto"]').click()
    copy_cursive = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Copiar estilo Cursiva Mágica"]')
    wait.until(lambda d: not copy_cursive.is_enabled())
    wait.until(lambda d: copy_cursive.find_element(By.XPATH, '../div[2]/p').text == '—')
    assert conversor.get_attribute("value") == "", "Clear action must empty the input"
    replace_value(conversor, "Hola")
    wait.until(lambda d: copy_cursive.is_enabled())
    wait.until(lambda d: copy_cursive.find_element(By.XPATH, '../div[2]/p').text == 'ℋℴ𝓁𝒶')

    # Feedback must describe the current output, and a repeat copy gets its own timeout.
    copy_cursive.click()
    wait.until(lambda d: 'Copiado' in copy_cursive.text)
    time.sleep(1.1)
    copy_cursive.click()
    time.sleep(1.1)
    assert 'Copiado' in copy_cursive.text, 'The first copy timeout cleared the second confirmation'
    replace_value(conversor, 'Adios')
    wait.until(lambda d: 'Copiado' not in copy_cursive.text)

    # Aesthetic cards and comparison must agree on empty input and copied feedback.
    open_path('/herramientas/conversor-letras-bonitas')
    aesthetic = wait.until(EC.element_to_be_clickable((By.ID, 'text-input')))
    copy_aesthetic = driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Copiar estilo Cursiva Mágica"]')
    compare_copy = driver.find_element(By.XPATH, '//button[contains(., "Copiar el estilo comparado")]')
    replace_value(aesthetic, 'Hola')
    wait.until(lambda d: copy_aesthetic.is_enabled())
    copy_aesthetic.click()
    wait.until(lambda d: '¡Copiado!' in copy_aesthetic.text)
    replace_value(aesthetic, 'Adios')
    wait.until(lambda d: '¡Copiado!' not in copy_aesthetic.text)
    wait.until(lambda d: compare_copy.is_enabled())
    compare_copy.click()
    wait.until(lambda d: 'Texto comparado copiado' in compare_copy.text)
    driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Borrar texto"]').click()
    wait.until(lambda d: not copy_aesthetic.is_enabled() and not compare_copy.is_enabled())
    wait.until(lambda d: 'Texto comparado copiado' not in compare_copy.text)
    wait.until(EC.presence_of_element_located((By.XPATH, '//p[@title=""][normalize-space(.)="—"]')))
    assert not driver.find_elements(By.XPATH, '//p[@title="Letras Bonitas"]'), 'Empty input generated default copyable text'
    assert_no_horizontal_overflow('aesthetic empty input')

    # Free Fire copy controls must be visible without hovering on a narrow phone.
    driver.set_window_size(320, 800)
    open_path('/herramientas/letras-free-fire')
    copy_names = driver.find_elements(By.CSS_SELECTOR, 'button[aria-label^="Copiar nombre "]')
    assert copy_names, 'Free Fire copy controls are missing'
    for button in copy_names:
        assert button.value_of_css_property('opacity') == '1', 'Free Fire copy control is transparent on mobile'
    assert_no_horizontal_overflow('Free Fire visible mobile copy controls')
    driver.set_window_size(390, 844)

    # TikTok: 500-codepoint boundary and persisted favorite hydration.
    open_path("/herramientas/letras-tiktok", "TikTok")
    tiktok = wait.until(EC.element_to_be_clickable((By.ID, "tiktok-input")))
    replace_value(tiktok, "A" * 620)
    wait.until(lambda d: len(d.find_element(By.ID, "tiktok-input").get_attribute("value")) == 500)
    assert_no_horizontal_overflow("TikTok 500-char output")
    favorite = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[title="Guardar en favoritos"]')))
    favorite.click()
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(., 'Mis Letras Favoritas Guardadas')]")))
    driver.refresh()
    wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(., 'Mis Letras Favoritas Guardadas')]")))
    assert_no_runtime_errors("TikTok persisted favorites hydration")

    # Instagram: long generated styles wrap instead of stretching the viewport.
    open_path("/herramientas/generador-de-nombres-para-instagram", "Instagram")
    instagram = wait.until(EC.element_to_be_clickable((By.ID, "insta-input")))
    replace_value(instagram, "LongAestheticName" * 8)
    time.sleep(0.25)
    assert_no_horizontal_overflow("Instagram long Unicode output")

    # Advanced Free Fire: the base nick remains capped at the documented 12-codepoint guide.
    open_path("/herramientas/generador-de-nombres-para-free-fire", "Free Fire")
    free_fire = wait.until(EC.element_to_be_clickable((By.ID, "ff-nick-input")))
    replace_value(free_fire, "ABCDEFGHIJKLMNOPQRST")
    wait.until(lambda d: len(d.find_element(By.ID, "ff-nick-input").get_attribute("value")) == 12)
    assert_no_horizontal_overflow("Free Fire nickname output")

    # Editor and creator must hydrate the client-only Konva canvas without React hydration errors.
    open_path("/editor", "Editor de Lettering")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#main-content canvas")))
    assert_no_runtime_errors("Editor canvas hydration")

    # Changing fonts must never blank/remount the Konva canvas while the web font resolves.
    font_picker = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[aria-haspopup="listbox"]')))
    font_picker.click()
    font_option = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, '//*[@role="listbox"]//*[@role="option"][contains(., "Script Moderno")]')
        )
    )
    font_option.click()
    continuity_deadline = time.time() + 0.45
    while time.time() < continuity_deadline:
        if not driver.find_elements(By.CSS_SELECTOR, "#main-content canvas"):
            fail("Editor canvas disappeared while changing fonts")
        time.sleep(0.025)
    assert_no_runtime_errors("Editor font-change continuity")

    open_path("/herramientas/creador-de-lettering", "Creador de")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#main-content canvas")))
    assert_no_runtime_errors("Creator canvas hydration")

    # Specialized landing pages must do more than repeat the generic editor:
    # their original example controls must populate the real canvas editor.
    for route, expected_text in [
        ("/generador-de-letras-goticas", "REINO\\nANTIGUO"),
        ("/letras-para-instagram", "Un día\\na la vez"),
    ]:
        open_path(route)
        buttons = wait.until(EC.presence_of_all_elements_located((
            By.XPATH, '//button[contains(normalize-space(.), "Probar este ejemplo en el editor")]'
        )))
        if len(buttons) != 3:
            fail(f"{route}: expected 3 editable design examples, got {len(buttons)}")
        buttons[0].click()
        editor_text = wait.until(EC.presence_of_element_located((
            By.CSS_SELECTOR, "#seo-embedded-editor textarea"
        )))
        expected_value = expected_text.replace(chr(92) + "n", chr(10))
        try:
            wait.until(lambda d: editor_text.get_attribute("value") == expected_value)
        except TimeoutException:
            fail(
                f"{route}: first example did not populate editor text. "
                f"Expected {expected_value!r}, got {editor_text.get_attribute('value')!r}"
            )
        try:
            wait.until(EC.presence_of_element_located((
                By.CSS_SELECTOR, "#seo-embedded-editor canvas"
            )))
        except TimeoutException:
            fail(f"{route}: canvas missing after applying an example")
        assert_no_horizontal_overflow("editable specialized example " + route)
        assert_no_runtime_errors("editable specialized example " + route)

    # SPA navigation from a deeply scrolled page should open the next route at the top.
    open_path("/blog", "Guías de Lettering")
    driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight)")
    wait.until(lambda d: d.execute_script("return window.scrollY") > 300)
    route_link = driver.find_elements(By.CSS_SELECTOR, 'footer a[href="/herramientas/creador-de-lettering"]')
    if not route_link:
        fail("Could not find footer route link for SPA scroll-reset test")
    driver.execute_script("arguments[0].click()", route_link[-1])
    wait.until(lambda d: urlparse(d.current_url).path == "/herramientas/creador-de-lettering")
    wait.until(lambda d: d.execute_script("return window.scrollY") <= 2)
    wait.until(lambda d: d.execute_script("return document.activeElement && document.activeElement.id") == "main-content")
    assert_no_runtime_errors("SPA route scroll reset")

    # Repeat the most overflow-prone tools at a narrow 320px mobile viewport.
    driver.set_window_size(320, 800)
    open_path("/herramientas/conversor-texto", "Conversor de Letras")
    narrow = wait.until(EC.element_to_be_clickable((By.ID, "text-input")))
    replace_value(narrow, "M" * 500)
    time.sleep(0.2)
    assert_no_horizontal_overflow("Conversor at 320px")

    open_path("/herramientas/generador-de-nombres-para-free-fire", "Free Fire")
    assert_no_horizontal_overflow("Free Fire at 320px")

    # Editorial value audit: the original Unicode learning activity must work
    # and show the difference between Unicode code points and UTF-16 units.
    open_path("/blog/como-comprobar-letras-unicode-copiar-pegar", "Cómo comprobar letras Unicode")
    assert driver.find_elements(By.CSS_SELECTOR, "meta[name='google-adsense-account']"), "Missing AdSense verification meta"
    inspector = wait.until(EC.visibility_of_element_located((By.ID, "unicode-inspector-input")))
    section_selector = 'section[aria-labelledby="unicode-inspector-title"]'
    basic_button = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        '//button[normalize-space(.)="Texto básico"]'
    )))
    basic_button.click()
    wait.until(lambda d: [
        node.text for node in d.find_elements(By.CSS_SELECTOR, section_selector + " dl dd")
    ] == ["4", "4"])
    bold_button = wait.until(EC.element_to_be_clickable((
        By.XPATH,
        '//button[normalize-space(.)="Negrita Unicode"]'
    )))
    bold_button.click()
    wait.until(lambda d: [
        node.text for node in d.find_elements(By.CSS_SELECTOR, section_selector + " dl dd")
    ] == ["4", "8"])
    assert_no_horizontal_overflow("Unicode inspector learning activity")
    assert_no_runtime_errors("Unicode inspector learning activity")

    # The invisible-character guide must provide the promised experiment.
    open_path('/blog/letras-invisibles-espacios-guia-redes-sociales')
    filler = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[normalize-space(.)="Solo relleno U+3164"]')))
    filler.click()
    inspector_input = driver.find_element(By.ID, 'unicode-inspector-input')
    wait.until(lambda d: inspector_input.get_attribute('value') == '\u3164')
    wait.until(lambda d: [node.text for node in d.find_elements(By.CSS_SELECTOR, section_selector + ' dl dd')] == ['1', '1'])
    assert 'Relleno Hangul' in driver.find_element(By.CSS_SELECTOR, section_selector + ' ol').text
    inspector_copy = driver.find_element(By.XPATH, '//button[normalize-space(.)="Copiar el texto examinado"]')
    inspector_copy.click()
    wait.until(EC.visibility_of_element_located((By.XPATH, '//p[normalize-space(.)="Texto examinado copiado."]')))
    replace_value(inspector_input, '')
    wait.until(lambda d: not inspector_copy.is_enabled())
    wait.until(lambda d: [node.text for node in d.find_elements(By.CSS_SELECTOR, section_selector + ' dl dd')] == ['0', '0'])
    assert_no_horizontal_overflow('invisible-character guide experiment')
    assert_no_runtime_errors('invisible-character guide experiment')

    # Original added-value tool: WCAG contrast calculator must react to choices.
    open_path("/herramientas/paletas-de-color", "Paletas de Color")
    ratio_selector = 'section[aria-labelledby="contrast-title"] p[aria-live="polite"]'
    initial_ratio = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ratio_selector)))
    assert initial_ratio.text.endswith(':1'), 'Palette contrast calculation did not render'
    white_black = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[contains(., "Ver ejemplo de máximo contraste")]'
    )))
    white_black.click()
    wait.until(lambda d: d.find_element(By.CSS_SELECTOR, ratio_selector).text.strip() == '21.00:1')
    assert 'Cumple' in driver.find_element(By.CSS_SELECTOR, 'ul[aria-label="Resultados de contraste"]').text
    palette_test = wait.until(EC.element_to_be_clickable((
        By.XPATH, '(//button[contains(., "Comprobar contraste entre extremos")])[1]'
    )))
    palette_test.click()
    wait.until(lambda d: d.find_element(By.CSS_SELECTOR, ratio_selector).text.strip() != '21.00:1')
    assert_no_horizontal_overflow("palette contrast checker on mobile")
    assert_no_runtime_errors("palette contrast checker")

    # Original font-pairing laboratory: independently editable title/subtitle + CSS.
    open_path("/herramientas/combinador-de-fuentes", "Combinador de Fuentes")
    secondary_input = wait.until(EC.element_to_be_clickable((
        By.CSS_SELECTOR, 'input[aria-label="Subtítulo para combinar fuentes"]'
    )))
    replace_value(secondary_input, "Lectura clara de prueba")
    first_pair = wait.until(EC.presence_of_element_located((
        By.CSS_SELECTOR, '#main-content details'
    )))
    try:
        wait.until(
            lambda d: "LECTURA CLARA DE PRUEBA" in first_pair.find_element(By.XPATH, "../..").text.upper(),
            message="Live subtitle edit did not update the first font pairing card"
        )
    except TimeoutException:
        fail("Font pairing subtitle did not update: " + first_pair.find_element(By.XPATH, "../..").text[:220])
    first_pair.find_element(By.CSS_SELECTOR, 'summary').click()
    code_text = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR, '#main-content details[open] pre code'
        )),
        message="CSS example did not open in the font pairing card"
    )
    assert ".lettering-title {" in code_text.text, "Missing title CSS selector"
    assert ".lettering-subtitle {" in code_text.text, "Missing subtitle CSS selector"
    assert "Playfair Display" in code_text.text, "Missing pairing font in CSS"
    assert "font-size: 16px;" in code_text.text, "Missing subtitle size in CSS"
    assert "\\n" not in code_text.text, "CSS snippet must contain real line breaks, not literal escape codes"
    assert_no_horizontal_overflow("font pairing CSS snippet at 320px")
    assert_no_runtime_errors("font pairing CSS snippet")

    # AdSense original-value improvement: the aesthetic converter is a curated
    # Unicode selection lab, distinct from the generic 70+ style copy list.
    open_path("/herramientas/conversor-letras-bonitas", "Conversor de Letras Bonitas")
    aesthetic_search = wait.until(EC.element_to_be_clickable((
        By.ID, "aesthetic-style-search"
    )))
    replace_value(aesthetic_search, "gotica")
    assert driver.find_elements(By.CSS_SELECTOR, 'button[aria-label="Guardar estilo Gótica Clásica"]'), (
        "Accent-insensitive aesthetic style search did not retain Gótica Clásica"
    )
    save_gothic = wait.until(EC.element_to_be_clickable((
        By.CSS_SELECTOR, 'button[aria-label="Guardar estilo Gótica Clásica"]'
    )))
    save_gothic.click()
    wait.until(lambda d: d.find_elements(
        By.CSS_SELECTOR, 'button[aria-label="Quitar estilo Gótica Clásica de guardados"]'
    ))
    wait.until(lambda d: d.find_elements(
        By.XPATH, '//button[normalize-space(.)="Guardados (1)"]'
    ))

    # Favorites must survive browser reload without hydration errors.
    driver.refresh()
    wait.until(lambda d: d.find_elements(
        By.XPATH, '//button[normalize-space(.)="Guardados (1)"]'
    ))
    saved_category = wait.until(EC.element_to_be_clickable((
        By.XPATH, '//button[normalize-space(.)="Guardados (1)"]'
    )))
    # A sticky header covers controls if the browser's default scroll places
    # their top edge at viewport y=0. Center them before interaction.
    driver.execute_script("arguments[0].scrollIntoView({block: 'center', behavior: 'instant'})", saved_category)
    saved_category.click()
    assert driver.find_elements(By.CSS_SELECTOR, 'button[aria-label="Quitar estilo Gótica Clásica de guardados"]')
    assert driver.find_elements(By.CSS_SELECTOR, 'button[aria-label="Comparar estilo Gótica Clásica"]')
    wait.until(lambda d: "Se muestran 1 de 72" in d.find_element(
        By.CSS_SELECTOR, 'section[aria-labelledby="aesthetic-collection-title"]'
    ).text)
    compare_gothic = wait.until(EC.element_to_be_clickable((
        By.CSS_SELECTOR, 'button[aria-label="Comparar estilo Gótica Clásica"]'
    )))
    compare_gothic.click()
    wait.until(lambda d: d.find_element(By.ID, "aesthetic-compare-style").get_attribute("value") == "gotica")
    assert driver.find_elements(By.CSS_SELECTOR, 'section[aria-labelledby="aesthetic-compare-title"]')
    assert_no_horizontal_overflow("aesthetic selection and Unicode comparison at 320px")
    assert_no_runtime_errors("aesthetic favorites after browser reload")

    # Full mobile route audit: every sitemap URL must hydrate without runtime errors,
    # retain one H1/canonical/title, and fit inside a 390px viewport.
    driver.set_window_size(390, 844)
    audited = 0
    for path in sitemap_paths():
        open_path(path)
        assert_document_basics(path)
        assert_no_horizontal_overflow(f"full route audit {path}")
        assert_no_runtime_errors(f"full route audit {path}")
        audited += 1

    if audited < 20:
        fail(f"Full route audit discovered too few sitemap routes: {audited}")

    print(f"Browser smoke validation passed across {audited} sitemap routes.")
except (AssertionError, TimeoutException) as error:
    print(f"Browser smoke validation failed: {error}", file=sys.stderr)
    sys.exit(1)
finally:
    driver.quit()
