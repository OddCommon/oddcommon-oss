import type { FullConnectParameters, RenderPageCtx } from 'datocms-plugin-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from '../factory';

// Mock to capture the config passed to connect
let capturedConfig: Partial<FullConnectParameters> | null = null;

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn((config) => {
    capturedConfig = config;
    return Promise.resolve();
  }),
}));

describe('Page and Navigation Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  describe('addPage', () => {
    it('should register a page', () => {
      const plugin = createPluginConfig();
      const TestPage = () => <div>Test Page</div>;

      expect(() => {
        plugin.addPage({
          pageId: 'test-page',
          component: TestPage,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate page ID', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender });
      const FirstPage = () => <div>First Page</div>;
      const SecondPage = () => <div>Second Page</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addPage({ pageId: 'test-page', component: FirstPage });
      plugin.addPage({ pageId: 'test-page', component: SecondPage });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderPageCtx;
      capturedConfig!.renderPage!('test-page', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondPage,
        }),
      );
    });

    it('should throw on duplicate page ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ duplicateIdHandling: 'throw' });
      const TestPage = () => <div>Test Page</div>;

      plugin.addPage({ pageId: 'test-page', component: TestPage });

      expect(() => {
        plugin.addPage({ pageId: 'test-page', component: TestPage });
      }).toThrow();
    });

    it('should silently replace duplicate page with duplicateIdHandling: ignore', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
      const FirstPage = () => <div>First Page</div>;
      const SecondPage = () => <div>Second Page</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addPage({ pageId: 'test-page', component: FirstPage });
      plugin.addPage({ pageId: 'test-page', component: SecondPage });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderPageCtx;
      capturedConfig!.renderPage!('test-page', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondPage,
        }),
      );
    });
  });

  describe('addMainNavigationTab', () => {
    it('should register a navigation tab', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.addMainNavigationTab({
          label: 'Test',
          icon: 'star',
          pointsTo: { pageId: 'test-page' },
        });
      }).not.toThrow();
    });
  });

  describe('addContentAreaSidebarItem', () => {
    it('should register a content area sidebar item', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.addContentAreaSidebarItem({
          label: 'Test',
          icon: 'star',
          pointsTo: { pageId: 'test-page' },
        });
      }).not.toThrow();
    });
  });
});
