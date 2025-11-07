import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Page and Navigation Registration', () => {
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

    it('should throw on duplicate page ID', () => {
      const plugin = createPluginConfig();
      const TestPage = () => <div>Test Page</div>;

      plugin.addPage({ pageId: 'test-page', component: TestPage });

      expect(() => {
        plugin.addPage({ pageId: 'test-page', component: TestPage });
      }).toThrow('Page with id "test-page" is already registered');
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
