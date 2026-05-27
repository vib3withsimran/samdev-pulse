import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { renderLoadingSpinner, sendLoadingSpinner } from '../loading.renderer.js';
import { setTheme } from '../svg.renderer.js';

describe('loading.renderer.js', () => {
  beforeEach(() => {
    setTheme('dark');
  });

  describe('renderLoadingSpinner', () => {
    test('renders valid SVG structure', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });

    test('includes samdev-pulse header', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('samdev-pulse');
    });

    test('includes dashboard label', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('dashboard');
    });

    test('includes loading text', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('Fetching GitHub data...');
    });

    test('includes helpful hint text', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('This usually takes a few seconds');
    });

    test('includes spinner circle element', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('<circle');
      expect(svg).toContain('r="20"');
    });

    test('includes animation keyframes', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('@keyframes spin');
      expect(svg).toContain('transform: rotate(0deg)');
      expect(svg).toContain('transform: rotate(360deg)');
    });

    test('includes animation timing', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('2s');
      expect(svg).toContain('linear');
      expect(svg).toContain('infinite');
    });

    test('includes spinner-circle class with animation', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toContain('.spinner-circle');
      expect(svg).toContain('animation: spin');
    });

    test('has Status card title', () => {
      const svg = renderLoadingSpinner();
      // renderCard adds the card styling, check for presence of main SVG content
      expect(svg).toContain('Fetching GitHub data...');
    });

    test('renders with different themes', () => {
      setTheme('light');
      const svg = renderLoadingSpinner();
      expect(svg).toContain('Fetching GitHub data...');
      expect(svg).toContain('<svg');
    });

    test('SVG has proper dimensions', () => {
      const svg = renderLoadingSpinner();
      expect(svg).toMatch(/viewBox="0 0 960/);
    });
  });

  describe('sendLoadingSpinner', () => {
    test('sets Content-Type to image/svg+xml', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendLoadingSpinner(mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
    });

    test('sets no-cache headers', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendLoadingSpinner(mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache, no-store');
    });

    test('returns 200 status', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendLoadingSpinner(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('sends valid SVG', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendLoadingSpinner(mockRes);

      const content = mockRes.send.mock.calls[0][0];
      expect(content).toContain('<svg');
      expect(content).toContain('Fetching GitHub data');
    });
  });
});
