import type {
  ExecuteFieldDropdownActionCtx,
  ExecuteItemFormDropdownActionCtx,
  ExecuteItemsDropdownActionCtx,
  ExecuteUploadsDropdownActionCtx,
  FullConnectParameters,
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

describe('Dropdown Action Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });
  describe('Field dropdown actions', () => {
    it('should register a field dropdown action', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();

      expect(() => {
        plugin.addDropdownAction({
          type: 'field',
          id: 'field-action',
          label: 'Field Action',
          execute: executeFn,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate field dropdown action ID', async () => {
      const plugin = createPluginConfig({ render: mockRender });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'field',
        id: 'field-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'field',
        id: 'field-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteFieldDropdownActionCtx;
      await capturedConfig!.executeFieldDropdownAction!('field-action', mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });

    it('should throw on duplicate field dropdown action ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
      const executeFn = vi.fn();

      plugin.addDropdownAction({
        type: 'field',
        id: 'field-action',
        label: 'Field Action',
        execute: executeFn,
      });

      expect(() => {
        plugin.addDropdownAction({
          type: 'field',
          id: 'field-action',
          label: 'Field Action',
          execute: executeFn,
        });
      }).toThrow();
    });

    it('should silently replace duplicate field action with duplicateIdHandling: ignore', async () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'ignore' });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'field',
        id: 'field-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'field',
        id: 'field-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteFieldDropdownActionCtx;
      await capturedConfig!.executeFieldDropdownAction!('field-action', mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Item form dropdown actions', () => {
    it('should register an item form dropdown action', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();

      expect(() => {
        plugin.addDropdownAction({
          type: 'itemForm',
          id: 'item-form-action',
          label: 'Item Form Action',
          execute: executeFn,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate item form dropdown action ID', async () => {
      const plugin = createPluginConfig({ render: mockRender });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'itemForm',
        id: 'item-form-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'itemForm',
        id: 'item-form-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteItemFormDropdownActionCtx;
      await capturedConfig!.executeItemFormDropdownAction!('item-form-action', mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });

    it('should throw on duplicate item form dropdown action ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
      const executeFn = vi.fn();

      plugin.addDropdownAction({
        type: 'itemForm',
        id: 'item-form-action',
        label: 'Item Form Action',
        execute: executeFn,
      });

      expect(() => {
        plugin.addDropdownAction({
          type: 'itemForm',
          id: 'item-form-action',
          label: 'Item Form Action',
          execute: executeFn,
        });
      }).toThrow();
    });

    it('should silently replace duplicate item form action with duplicateIdHandling: ignore', async () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'ignore' });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'itemForm',
        id: 'item-form-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'itemForm',
        id: 'item-form-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteItemFormDropdownActionCtx;
      await capturedConfig!.executeItemFormDropdownAction!('item-form-action', mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Items dropdown actions', () => {
    it('should register an items dropdown action', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();

      expect(() => {
        plugin.addDropdownAction({
          type: 'items',
          id: 'items-action',
          label: 'Items Action',
          execute: executeFn,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate items dropdown action ID', async () => {
      const plugin = createPluginConfig({ render: mockRender });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'items',
        id: 'items-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'items',
        id: 'items-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteItemsDropdownActionCtx;
      await capturedConfig!.executeItemsDropdownAction!('items-action', [], mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });

    it('should throw on duplicate items dropdown action ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
      const executeFn = vi.fn();

      plugin.addDropdownAction({
        type: 'items',
        id: 'items-action',
        label: 'Items Action',
        execute: executeFn,
      });

      expect(() => {
        plugin.addDropdownAction({
          type: 'items',
          id: 'items-action',
          label: 'Items Action',
          execute: executeFn,
        });
      }).toThrow();
    });

    it('should silently replace duplicate items action with duplicateIdHandling: ignore', async () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'ignore' });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'items',
        id: 'items-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'items',
        id: 'items-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteItemsDropdownActionCtx;
      await capturedConfig!.executeItemsDropdownAction!('items-action', [], mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Uploads dropdown actions', () => {
    it('should register an uploads dropdown action', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();

      expect(() => {
        plugin.addDropdownAction({
          type: 'uploads',
          id: 'uploads-action',
          label: 'Uploads Action',
          execute: executeFn,
        });
      }).not.toThrow();
    });

    it('should warn by default on duplicate uploads dropdown action ID', async () => {
      const plugin = createPluginConfig({ render: mockRender });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'uploads',
        id: 'uploads-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'uploads',
        id: 'uploads-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteUploadsDropdownActionCtx;
      await capturedConfig!.executeUploadsDropdownAction!('uploads-action', [], mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });

    it('should throw on duplicate uploads dropdown action ID with duplicateIdHandling: throw', () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'throw' });
      const executeFn = vi.fn();

      plugin.addDropdownAction({
        type: 'uploads',
        id: 'uploads-action',
        label: 'Uploads Action',
        execute: executeFn,
      });

      expect(() => {
        plugin.addDropdownAction({
          type: 'uploads',
          id: 'uploads-action',
          label: 'Uploads Action',
          execute: executeFn,
        });
      }).toThrow();
    });

    it('should silently replace duplicate uploads action with duplicateIdHandling: ignore', async () => {
      const plugin = createPluginConfig({ render: mockRender, duplicateIdHandling: 'ignore' });
      const firstExecute = vi.fn();
      const secondExecute = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      plugin.addDropdownAction({
        type: 'uploads',
        id: 'uploads-action',
        label: 'First Action',
        execute: firstExecute,
      });

      plugin.addDropdownAction({
        type: 'uploads',
        id: 'uploads-action',
        label: 'Second Action',
        execute: secondExecute,
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();

      // Verify second registration replaced the first
      plugin.connect();
      const mockContext = {} as ExecuteUploadsDropdownActionCtx;
      await capturedConfig!.executeUploadsDropdownAction!('uploads-action', [], mockContext);

      expect(firstExecute).not.toHaveBeenCalled();
      expect(secondExecute).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('Multiple dropdown actions', () => {
    it('should allow same ID for different types', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();

      expect(() => {
        plugin.addDropdownAction({
          type: 'field',
          id: 'shared-id',
          label: 'Action',
          execute: executeFn,
        });
        plugin.addDropdownAction({
          type: 'itemForm',
          id: 'shared-id',
          label: 'Action',
          execute: executeFn,
        });
        plugin.addDropdownAction({
          type: 'items',
          id: 'shared-id',
          label: 'Action',
          execute: executeFn,
        });
        plugin.addDropdownAction({
          type: 'uploads',
          id: 'shared-id',
          label: 'Action',
          execute: executeFn,
        });
      }).not.toThrow();
    });

    it('should register dropdown actions with optional icon and shouldApply', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const executeFn = vi.fn();
      const shouldApplyFn = vi.fn().mockReturnValue(true);

      expect(() => {
        plugin.addDropdownAction({
          type: 'field',
          id: 'action-with-options',
          label: 'Action',
          icon: 'star',
          execute: executeFn,
          shouldApply: shouldApplyFn,
        });
      }).not.toThrow();
    });
  });
});
