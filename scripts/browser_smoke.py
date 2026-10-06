import os
import sys
import time
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


def replace_value(element, value: str) -> None:
    element.click()
    element.send_keys(Keys.CONTROL, "a")
    element.send_keys(value)


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

    open_path("/herramientas/creador-de-lettering", "Creador de")
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "#main-content canvas")))
    assert_no_runtime_errors("Creator canvas hydration")

    # Repeat the most overflow-prone tools at a narrow 320px mobile viewport.
    driver.set_window_size(320, 800)
    open_path("/herramientas/conversor-texto", "Conversor de Letras")
    narrow = wait.until(EC.element_to_be_clickable((By.ID, "text-input")))
    replace_value(narrow, "M" * 500)
    time.sleep(0.2)
    assert_no_horizontal_overflow("Conversor at 320px")

    open_path("/herramientas/generador-de-nombres-para-free-fire", "Free Fire")
    assert_no_horizontal_overflow("Free Fire at 320px")

    print("Browser smoke validation passed.")
except (AssertionError, TimeoutException) as error:
    print(f"Browser smoke validation failed: {error}", file=sys.stderr)
    sys.exit(1)
finally:
    driver.quit()
