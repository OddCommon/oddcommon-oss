import type {
  FullConnectParameters,
  ItemFormOutletsCtx,
  ItemType,
  RenderItemFormOutletCtx,
} from 'datocms-plugin-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from './factory';

// Mock to capture the config passed to connect
let capturedConfig: Partial<FullConnectParameters> | null = null;

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn((config) => {
    capturedConfig = config;
    return Promise.resolve();
  }),
}));

describe('Integration: Form Outlet Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it('should register and configure form outlets correctly', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });

    // Register first outlet
    const TestComponent1 = ({ ctx: _ctx }: { ctx: RenderItemFormOutletCtx }) => <div>Outlet 1</div>;
    plugin.addFormOutlet({
      id: 'outlet-1',
      component: TestComponent1,
      initialHeight: 100,
    });

    // Register second outlet with conditional logic
    const TestComponent2 = ({ ctx: _ctx }: { ctx: RenderItemFormOutletCtx }) => <div>Outlet 2</div>;
    plugin.addFormOutlet({
      id: 'outlet-2',
      component: TestComponent2,
      initialHeight: 200,
      shouldApply: (model, _ctx) => {
        // Only show for specific model
        return model.attributes.api_key === 'test_model';
      },
    });

    // Call connect to capture config
    plugin.connect();
    const config = capturedConfig!;

    // Verify itemFormOutlets function exists
    expect(config.itemFormOutlets).toBeDefined();
    expect(typeof config.itemFormOutlets).toBe('function');

    // Verify renderItemFormOutlet function exists
    expect(config.renderItemFormOutlet).toBeDefined();
    expect(typeof config.renderItemFormOutlet).toBe('function');

    // Test itemFormOutlets returns correct outlets for matching model
    const mockModel = {
      attributes: { api_key: 'test_model' },
    } as Partial<ItemType> as ItemType;
    const mockCtx = {} as ItemFormOutletsCtx;

    const outlets = config.itemFormOutlets!(mockModel, mockCtx);
    expect(outlets).toHaveLength(2);
    expect(outlets[0]).toEqual({ id: 'outlet-1', initialHeight: 100 });
    expect(outlets[1]).toEqual({ id: 'outlet-2', initialHeight: 200 });

    // Test itemFormOutlets filters outlets for non-matching model
    const nonMatchingModel = {
      attributes: { api_key: 'other_model' },
    } as Partial<ItemType> as ItemType;

    const filteredOutlets = config.itemFormOutlets!(nonMatchingModel, mockCtx);
    expect(filteredOutlets).toHaveLength(1);
    expect(filteredOutlets[0]).toEqual({ id: 'outlet-1', initialHeight: 100 });

    // Test renderItemFormOutlet calls custom render with correct component
    const mockRenderCtx = {} as RenderItemFormOutletCtx;
    config.renderItemFormOutlet!('outlet-1', mockRenderCtx);

    expect(customRender).toHaveBeenCalledTimes(1);
    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: TestComponent1,
      }),
    );
  });

  it('should handle multiple registrations and maintain state', () => {
    const plugin = createPluginConfig();

    const Component = () => <div>Test</div>;

    // Register multiple outlets
    plugin.addFormOutlet({ id: 'a', component: Component });
    plugin.addFormOutlet({ id: 'b', component: Component });
    plugin.addFormOutlet({ id: 'c', component: Component });

    plugin.connect();
    const config = capturedConfig!;

    // Verify all outlets are registered
    const mockModel = { attributes: {} } as Partial<ItemType> as ItemType;
    const mockCtx = {} as ItemFormOutletsCtx;
    const outlets = config.itemFormOutlets!(mockModel, mockCtx);

    expect(outlets).toHaveLength(3);
    expect(outlets.map((o) => o.id)).toEqual(['a', 'b', 'c']);
  });

  it('should prevent duplicate outlet IDs across registrations', () => {
    const plugin = createPluginConfig({ duplicateIdHandling: 'throw' });
    const Component = () => <div>Test</div>;

    plugin.addFormOutlet({ id: 'unique-id', component: Component });

    expect(() => {
      plugin.addFormOutlet({ id: 'unique-id', component: Component });
    }).toThrow('Form outlet with id "unique-id" is already registered');
  });

  it('should use default initialHeight of 0 when not specified', () => {
    const plugin = createPluginConfig();
    const Component = () => <div>Test</div>;

    plugin.addFormOutlet({
      id: 'test-outlet',
      component: Component,
    });

    plugin.connect();
    const config = capturedConfig!;
    const mockModel = { attributes: {} } as Partial<ItemType> as ItemType;
    const mockCtx = {} as ItemFormOutletsCtx;

    const outlets = config.itemFormOutlets!(mockModel, mockCtx);
    expect(outlets[0].initialHeight).toBe(0);
  });
});
