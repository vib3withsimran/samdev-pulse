function hexToRgb(hex) {
  const normalized = hex.replace('#', '');

  const bigint = parseInt(normalized, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function luminance(r, g, b) {
  const values = [r, g, b].map((v) => {
    v /= 255;

    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * values[0] +
    0.7152 * values[1] +
    0.0722 * values[2]
  );
}

export function contrastRatio(color1, color2) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const l1 = luminance(c1.r, c1.g, c1.b);
  const l2 = luminance(c2.r, c2.g, c2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function validateThemeAccessibility(theme) {
  const bg =
    theme.colors.background ||
    '#000000';

  const primary =
    theme.colors.primaryText ||
    '#ffffff';

  const secondary =
    theme.colors.secondaryText ||
    '#cccccc';

  return {
    primaryPass:
      contrastRatio(primary, bg) >= 4.5,

    secondaryPass:
      contrastRatio(secondary, bg) >= 3,

    primaryContrast:
      contrastRatio(primary, bg),

    secondaryContrast:
      contrastRatio(secondary, bg),
  };
}
