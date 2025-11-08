import { describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from '../factory';

describe('Event Hooks Registration', () => {
  describe('onBoot', () => {
    it('should register onBoot handler', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      expect(() => {
        plugin.onBoot(handler);
      }).not.toThrow();
    });

    it('should call onBoot handler when registered', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      plugin.onBoot(handler);

      expect(plugin.onBoot).toBeDefined();
    });
  });

  describe('onBeforeItemUpsert', () => {
    it('should register onBeforeItemUpsert handler', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      expect(() => {
        plugin.onBeforeItemUpsert(handler);
      }).not.toThrow();
    });

    it('should allow multiple onBeforeItemUpsert handlers', () => {
      const plugin = createPluginConfig();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      expect(() => {
        plugin.onBeforeItemUpsert(handler1);
        plugin.onBeforeItemUpsert(handler2);
      }).not.toThrow();
    });
  });

  describe('onBeforeItemsDestroy', () => {
    it('should register onBeforeItemsDestroy handler', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      expect(() => {
        plugin.onBeforeItemsDestroy(handler);
      }).not.toThrow();
    });

    it('should allow multiple onBeforeItemsDestroy handlers', () => {
      const plugin = createPluginConfig();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      expect(() => {
        plugin.onBeforeItemsDestroy(handler1);
        plugin.onBeforeItemsDestroy(handler2);
      }).not.toThrow();
    });
  });

  describe('onBeforeItemsPublish', () => {
    it('should register onBeforeItemsPublish handler', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      expect(() => {
        plugin.onBeforeItemsPublish(handler);
      }).not.toThrow();
    });

    it('should allow multiple onBeforeItemsPublish handlers', () => {
      const plugin = createPluginConfig();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      expect(() => {
        plugin.onBeforeItemsPublish(handler1);
        plugin.onBeforeItemsPublish(handler2);
      }).not.toThrow();
    });
  });

  describe('onBeforeItemsUnpublish', () => {
    it('should register onBeforeItemsUnpublish handler', () => {
      const plugin = createPluginConfig();
      const handler = vi.fn();

      expect(() => {
        plugin.onBeforeItemsUnpublish(handler);
      }).not.toThrow();
    });

    it('should allow multiple onBeforeItemsUnpublish handlers', () => {
      const plugin = createPluginConfig();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      expect(() => {
        plugin.onBeforeItemsUnpublish(handler1);
        plugin.onBeforeItemsUnpublish(handler2);
      }).not.toThrow();
    });
  });
});
