/** WCAG 2.x relative-luminance contrast calculation for opaque sRGB colours. */
export function contrastRatio(foreground: string, background: string): number {
  const luminance = (hex: string): number => {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
      throw new Error('Expected an opaque six-digit HEX colour');
    }

    const channels = [1, 3, 5].map((index) => {
      const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });

    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };

  const front = luminance(foreground);
  const back = luminance(background);
  return (Math.max(front, back) + 0.05) / (Math.min(front, back) + 0.05);
}

/** WCAG AA normal text >= 4.5:1; large text and UI graphical elements >= 3:1. */
export function contrastResults(ratio: number) {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
  };
}
