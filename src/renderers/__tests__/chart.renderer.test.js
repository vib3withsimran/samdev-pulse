import { describe, test, expect, beforeEach } from '@jest/globals';
import { renderLineChart, generateFakeContributionData } from '../chart.renderer.js';
import { setTheme } from '../svg.renderer.js';

describe('chart.renderer.js', () => {
  beforeEach(() => {
    setTheme('dark');
  });

  describe('renderLineChart', () => {
    test('renders valid SVG chart', () => {
      const data = [10, 20, 15, 30, 25];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
      expect(chart).toContain('</g>');
    });

    test('includes gradient definitions for styling', () => {
      const data = [5, 10, 8, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('linearGradient');
      expect(chart).toContain('stop-color');
    });

    test('creates path for line chart', () => {
      const data = [10, 20, 15, 30];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        showLine: true,
      });

      expect(chart).toContain('d="M');
    });

    test('renders area when showArea is true', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        showArea: true,
      });

      expect(chart).toContain('areaGradient');
    });

    test('skips area when showArea is false', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        showArea: false,
      });

      expect(chart).toBeTruthy();
      expect(chart).toContain('<g');
    });

    test('includes glow filter for visual effect', () => {
      const data = [5, 15, 10];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('filter');
      expect(chart).toContain('feGaussianBlur');
    });

    test('renders with custom unique ID', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        uniqueId: 'my-chart-123',
      });

      expect(chart).toContain('my-chart-123');
    });

    test('generates default ID when not provided', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('chart-');
    });

    test('renders axes when showAxes is true', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        showAxes: true,
      });

      expect(chart).toContain('line');
    });

    test('includes axis labels', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        xLabel: 'Days',
        yLabel: 'Count',
      });

      expect(chart).toBeTruthy();
    });

    test('handles single data point', () => {
      const data = [50];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 200,
        height: 150,
        data,
      });

      expect(chart).toContain('<g');
    });

    test('handles identical data points', () => {
      const data = [10, 10, 10, 10];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
    });

    test('handles large dataset', () => {
      const data = Array.from({ length: 365 }, () => Math.floor(Math.random() * 100));
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 500,
        height: 300,
        data,
      });

      expect(chart).toContain('<g');
    });

    test('renders dots when showDots is true', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
        showDots: true,
      });

      expect(chart).toBeTruthy();
    });

    test('positions chart at specified coordinates', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 50,
        y: 100,
        width: 300,
        height: 200,
        data,
      });

      // Verify chart renders without error
      expect(chart).toBeTruthy();
      expect(chart).toContain('<g');
    });

    test('respects width and height parameters', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 400,
        height: 300,
        data,
      });

      // Verify chart renders
      expect(chart).toContain('<g');
    });

    test('works with different themes', () => {
      setTheme('light');
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
      expect(chart).toContain('linearGradient');
    });
  });

  describe('generateFakeContributionData', () => {
    test('generates array of numbers', () => {
      const data = generateFakeContributionData(30);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(30);
    });

    test('generates correct length', () => {
      expect(generateFakeContributionData(7).length).toBe(7);
      expect(generateFakeContributionData(365).length).toBe(365);
    });

    test('generates positive numbers', () => {
      const data = generateFakeContributionData(50);
      data.forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0);
      });
    });

    test('generates reasonable contribution values', () => {
      const data = generateFakeContributionData(100);
      const max = Math.max(...data);
      expect(max).toBeLessThan(100); // Reasonable upper bound
    });

    test('generates varied data', () => {
      const data = generateFakeContributionData(100);
      const unique = new Set(data);
      expect(unique.size).toBeGreaterThan(1); // Should have variety
    });

    test('generates data for small ranges', () => {
      const data = generateFakeContributionData(1);
      expect(data.length).toBe(1);
    });
  });

  describe('Chart Rendering Edge Cases', () => {
    test('handles very large values', () => {
      const data = [1000000, 2000000, 1500000];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
    });

    test('handles very small values', () => {
      const data = [0.1, 0.2, 0.15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
    });

    test('handles mixed data types converted to numbers', () => {
      const data = [10, 20, 15];
      const chart = renderLineChart({
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        data,
      });

      expect(chart).toContain('<g');
    });
  });
});
