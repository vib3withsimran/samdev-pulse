import { renderBackground, wrapSvg, renderCard, LAYOUT, getTheme } from './svg.renderer.js';

/**
 * Renders an animated loading spinner inside the samdev-pulse frame.
 */
export function renderLoadingSpinner() {
  const { colors } = getTheme();
  const width = LAYOUT.width;
  const height = 240;
  const padding = LAYOUT.padding;
  const cardWidth = width - padding * 2;
  const cardHeight = 168;
  const cardX = padding;
  const cardY = 52;
  const centerX = width / 2;
  const centerY = cardY + 70;

  const spinnerRadius = 20;

  // Create animated spinner using CSS keyframes
  const spinnerSvg = `
    <defs>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-circle {
          animation: spin 2s linear infinite;
          transform-origin: ${centerX}px ${centerY}px;
        }
      </style>
    </defs>
    <g class="spinner-circle">
      <circle cx="${centerX}" cy="${centerY}" r="${spinnerRadius}" fill="none" stroke="${colors.accent}" stroke-width="3" stroke-dasharray="50" opacity="0.8"/>
    </g>
  `;

  const content = [
    renderBackground(width, height),
    `<text x="${padding}" y="36" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="17" font-weight="700" fill="${colors.primaryText}">samdev-pulse</text>`,
    `<text x="${width - padding}" y="36" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="${colors.mutedText}" text-anchor="end">dashboard</text>`,
    renderCard({ x: cardX, y: cardY, width: cardWidth, height: cardHeight, title: 'Status' }),
    spinnerSvg,
    `<text x="${centerX}" y="${centerY + 50}" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="14" fill="${colors.secondaryText}" text-anchor="middle">Fetching GitHub data...</text>`,
    `<text x="${centerX}" y="${centerY + 68}" font-family="'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="11" fill="${colors.mutedText}" text-anchor="middle">This usually takes a few seconds</text>`,
  ].filter(Boolean).join('\n');

  return wrapSvg(content, width, height);
}

/** Sends loading spinner SVG (HTTP 200). */
export function sendLoadingSpinner(res) {
  const svg = renderLoadingSpinner();
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, no-store');
  return res.status(200).send(svg);
}
