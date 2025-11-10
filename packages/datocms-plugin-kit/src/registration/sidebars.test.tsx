import type {
  FullConnectParameters,
  RenderItemFormSidebarCtx,
  RenderItemFormSidebarPanelCtx,
} from 'datocms-plugin-sdk';
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

// Helper mock render function for tests
const mockRender = vi.fn();

describe('Sidebar Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });
  describe('addSidebarPanel', () => {
    it('should register a sidebar panel', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const TestPanel = () => <div>Test Panel</div>;

      expect(() => {
        plugin.addSidebarPanel({
          id: 'test-panel',
          label: 'Test',
          component: TestPanel,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate panel ID', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender });
      const FirstPanel = () => <div>First Panel</div>;
      const SecondPanel = () => <div>Second Panel</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addSidebarPanel({ id: 'test-panel', label: 'Test', component: FirstPanel });
      plugin.addSidebarPanel({ id: 'test-panel', label: 'Test 2', component: SecondPanel });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderItemFormSidebarPanelCtx;
      capturedConfig!.renderItemFormSidebarPanel!('test-panel', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondPanel,
        }),
      );
    });

    it('should throw on duplicate panel ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
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
      }).toThrow();
    });

    it('should silently replace duplicate panel with duplicateIdHandling: ignore', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
      const FirstPanel = () => <div>First Panel</div>;
      const SecondPanel = () => <div>Second Panel</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addSidebarPanel({ id: 'test-panel', label: 'Test', component: FirstPanel });
      plugin.addSidebarPanel({ id: 'test-panel', label: 'Test 2', component: SecondPanel });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderItemFormSidebarPanelCtx;
      capturedConfig!.renderItemFormSidebarPanel!('test-panel', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondPanel,
        }),
      );
    });

    it('should register multiple panels with different IDs', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const TestPanel = () => <div>Test Panel</div>;

      expect(() => {
        plugin.addSidebarPanel({ id: 'panel-1', label: 'Panel 1', component: TestPanel });
        plugin.addSidebarPanel({ id: 'panel-2', label: 'Panel 2', component: TestPanel });
      }).not.toThrow();
    });

    it('should support optional configuration', () => {
      const plugin = createPluginConfig({ render: mockRender });
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
      const plugin = createPluginConfig({ render: mockRender });
      const TestSidebar = () => <div>Test Sidebar</div>;

      expect(() => {
        plugin.addSidebar({
          id: 'test-sidebar',
          label: 'Test',
          component: TestSidebar,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate sidebar ID', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender });
      const FirstSidebar = () => <div>First Sidebar</div>;
      const SecondSidebar = () => <div>Second Sidebar</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addSidebar({
        id: 'test-sidebar',
        label: 'Test',
        component: FirstSidebar,
      });

      plugin.addSidebar({
        id: 'test-sidebar',
        label: 'Test 2',
        component: SecondSidebar,
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderItemFormSidebarCtx;
      capturedConfig!.renderItemFormSidebar!('test-sidebar', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondSidebar,
        }),
      );
    });

    it('should throw on duplicate sidebar ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
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
      }).toThrow();
    });

    it('should silently replace duplicate sidebar with duplicateIdHandling: ignore', () => {
      const customRender = vi.fn();
      const plugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
      const FirstSidebar = () => <div>First Sidebar</div>;
      const SecondSidebar = () => <div>Second Sidebar</div>;
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addSidebar({ id: 'test-sidebar', label: 'Test', component: FirstSidebar });
      plugin.addSidebar({ id: 'test-sidebar', label: 'Test 2', component: SecondSidebar });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as RenderItemFormSidebarCtx;
      capturedConfig!.renderItemFormSidebar!('test-sidebar', mockContext);

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          type: SecondSidebar,
        }),
      );
    });

    it('should support optional configuration', () => {
      const plugin = createPluginConfig({ render: mockRender });
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
