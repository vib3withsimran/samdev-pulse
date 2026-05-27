import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { renderGracefulError, sendGracefulErrorSvg } from '../error.renderer.js';
import { setTheme } from '../svg.renderer.js';

describe('error.renderer.js', () => {
  beforeEach(() => {
    setTheme('dark');
  });

  describe('renderGracefulError', () => {
    test('renders error SVG with valid structure', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND' });
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('samdev-pulse');
    });

    test('renders NOT_FOUND error with correct message', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND' });
      expect(svg).toContain('User Not Found');
      expect(svg).toContain('This GitHub username does not exist or is not accessible');
    });

    test('renders RATE_LIMIT error with correct message', () => {
      const svg = renderGracefulError({ code: 'RATE_LIMIT' });
      expect(svg).toContain('Rate Limit Reached');
      expect(svg).toContain('GitHub API rate limit exceeded');
    });

    test('renders API_DOWN error with correct message', () => {
      const svg = renderGracefulError({ code: 'API_DOWN' });
      expect(svg).toContain('GitHub API Unavailable');
      expect(svg).toContain('GitHub is temporarily unreachable');
    });

    test('renders NETWORK error with correct message', () => {
      const svg = renderGracefulError({ code: 'NETWORK' });
      expect(svg).toContain('Connection Error');
      expect(svg).toContain('Could not reach GitHub');
    });

    test('renders API_ERROR as default when code is invalid', () => {
      const svg = renderGracefulError({ code: 'UNKNOWN_ERROR' });
      expect(svg).toContain('Unable to Load Profile');
    });

    test('renders INVALID_USERNAME error with correct message', () => {
      const svg = renderGracefulError({ code: 'INVALID_USERNAME' });
      expect(svg).toContain('Invalid GitHub Username');
      expect(svg).toContain('Usernames must be 1–39 characters');
    });

    test('includes username when provided', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND', username: 'testuser' });
      expect(svg).toContain('@testuser');
    });

    test('excludes username when not provided', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND' });
      expect(svg).not.toContain('@');
    });

    test('includes detail line when provided', () => {
      const svg = renderGracefulError({ code: 'API_ERROR', detail: 'Connection timeout' });
      expect(svg).toContain('Connection timeout');
    });

    test('escapes special characters in username', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND', username: "test<user'" });
      expect(svg).toContain('&lt;');
      expect(svg).toContain('&apos;');
      expect(svg).not.toContain("<user'");
    });

    test('escapes special characters in detail', () => {
      const svg = renderGracefulError({ code: 'API_ERROR', detail: 'Error: "Bad & request"' });
      expect(svg).toContain('&quot;');
      expect(svg).toContain('&amp;');
      expect(svg).not.toContain('"Bad & request"');
    });

    test('includes error icon (exclamation mark)', () => {
      const svg = renderGracefulError({ code: 'API_ERROR' });
      expect(svg).toContain('>!</text>');
    });

    test('includes dashboard label', () => {
      const svg = renderGracefulError({ code: 'NOT_FOUND' });
      expect(svg).toContain('dashboard');
    });

    test('renders with different themes', () => {
      setTheme('light');
      const svg = renderGracefulError({ code: 'NOT_FOUND' });
      expect(svg).toContain('User Not Found');
      expect(svg).toContain('<svg');
    });
  });

  describe('sendGracefulErrorSvg', () => {
    test('sets correct Content-Type header', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendGracefulErrorSvg(mockRes, { code: 'NOT_FOUND' });

      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'image/svg+xml');
    });

    test('sets cache headers', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendGracefulErrorSvg(mockRes, { code: 'NOT_FOUND' });

      expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'public, max-age=300');
    });

    test('returns 200 status code', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendGracefulErrorSvg(mockRes, { code: 'NOT_FOUND' });

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('sends SVG content', () => {
      const mockRes = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      sendGracefulErrorSvg(mockRes, { code: 'NOT_FOUND' });

      const sentContent = mockRes.send.mock.calls[0][0];
      expect(sentContent).toContain('<svg');
      expect(sentContent).toContain('</svg>');
    });
  });
});
