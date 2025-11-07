import { describe, expect, it, vi } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Dropdown Action Registration', () => {
  describe('Field dropdown actions', () => {
    it('should register a field dropdown action', () => {
      const plugin = createPluginConfig();
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

    it('should throw on duplicate field dropdown action ID', () => {
      const plugin = createPluginConfig();
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
      }).toThrow('Field dropdown action with id "field-action" is already registered');
    });
  });

  describe('Item form dropdown actions', () => {
    it('should register an item form dropdown action', () => {
      const plugin = createPluginConfig();
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

    it('should throw on duplicate item form dropdown action ID', () => {
      const plugin = createPluginConfig();
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
      }).toThrow('Item form dropdown action with id "item-form-action" is already registered');
    });
  });

  describe('Items dropdown actions', () => {
    it('should register an items dropdown action', () => {
      const plugin = createPluginConfig();
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

    it('should throw on duplicate items dropdown action ID', () => {
      const plugin = createPluginConfig();
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
      }).toThrow('Items dropdown action with id "items-action" is already registered');
    });
  });

  describe('Uploads dropdown actions', () => {
    it('should register an uploads dropdown action', () => {
      const plugin = createPluginConfig();
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

    it('should throw on duplicate uploads dropdown action ID', () => {
      const plugin = createPluginConfig();
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
      }).toThrow('Uploads dropdown action with id "uploads-action" is already registered');
    });
  });

  describe('Multiple dropdown actions', () => {
    it('should allow same ID for different types', () => {
      const plugin = createPluginConfig();
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
      const plugin = createPluginConfig();
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
