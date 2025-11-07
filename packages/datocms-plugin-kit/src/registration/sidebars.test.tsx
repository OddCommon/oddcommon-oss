import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Sidebar Registration', () => {
  describe('addSidebarPanel', () => {
    it('should register a sidebar panel', () => {
      const plugin = createPluginConfig();
      const TestPanel = () => <div>Test Panel</div>;

      expect(() => {
        plugin.addSidebarPanel({
          id: 'test-panel',
          label: 'Test',
          component: TestPanel,
        });
      }).not.toThrow();
    });

    it('should throw on duplicate panel ID', () => {
      const plugin = createPluginConfig();
      const TestPanel = () => <div>Test Panel</div>;

      plugin.addSidebarPanel({
        id: 'test-panel',
        label: 'Test',
        component: TestPanel,
      });

      expect(() => {
        plugin.addSidebarPanel({
          id: 'test-panel',
          label: 'Test 2',
          component: TestPanel,
        });
      }).toThrow('Sidebar panel with id "test-panel" is already registered');
    });

    it('should register multiple panels with different IDs', () => {
      const plugin = createPluginConfig();
      const TestPanel = () => <div>Test Panel</div>;

      expect(() => {
        plugin.addSidebarPanel({ id: 'panel-1', label: 'Panel 1', component: TestPanel });
        plugin.addSidebarPanel({ id: 'panel-2', label: 'Panel 2', component: TestPanel });
      }).not.toThrow();
    });

    it('should support optional configuration', () => {
      const plugin = createPluginConfig();
      const TestPanel = () => <div>Test Panel</div>;

      expect(() => {
        plugin.addSidebarPanel({
          id: 'test-panel',
          label: 'Test',
          component: TestPanel,
          startOpen: true,
          placement: ['before', 'info'],
          rank: 10,
        });
      }).not.toThrow();
    });
  });

  describe('addSidebar', () => {
    it('should register a full sidebar', () => {
      const plugin = createPluginConfig();
      const TestSidebar = () => <div>Test Sidebar</div>;

      expect(() => {
        plugin.addSidebar({
          id: 'test-sidebar',
          label: 'Test',
          component: TestSidebar,
        });
      }).not.toThrow();
    });

    it('should throw on duplicate sidebar ID', () => {
      const plugin = createPluginConfig();
      const TestSidebar = () => <div>Test Sidebar</div>;

      plugin.addSidebar({
        id: 'test-sidebar',
        label: 'Test',
        component: TestSidebar,
      });

      expect(() => {
        plugin.addSidebar({
          id: 'test-sidebar',
          label: 'Test 2',
          component: TestSidebar,
        });
      }).toThrow('Sidebar with id "test-sidebar" is already registered');
    });

    it('should support optional configuration', () => {
      const plugin = createPluginConfig();
      const TestSidebar = () => <div>Test Sidebar</div>;

      expect(() => {
        plugin.addSidebar({
          id: 'test-sidebar',
          label: 'Test',
          component: TestSidebar,
          preferredWidth: 400,
          shouldApply: () => true,
        });
      }).not.toThrow();
    });
  });
});
