import type {
  FullConnectParameters,
  ItemFormOutletsCtx,
  ItemType,
  RenderItemFormOutletCtx,
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

describe('Form Outlet Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it('should register a form outlet with combined approach', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
        initialHeight: 100,
        shouldApply: () => true,
      });
    }).not.toThrow();
  });

  it('should warn by default on duplicate form outlet ID', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });
    const FirstOutlet = () => <div>First Outlet</div>;
    const SecondOutlet = () => <div>Second Outlet</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.addFormOutlet({ id: 'test-outlet', component: FirstOutlet, initialHeight: 100 });
    plugin.addFormOutlet({ id: 'test-outlet', component: SecondOutlet, initialHeight: 200 });

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    plugin.connect();
    const mockModel = { attributes: {} } as Partial<ItemType> as ItemType;
    const mockContext = {} as ItemFormOutletsCtx;
    const outlets = capturedConfig!.itemFormOutlets!(mockModel, mockContext);

    expect(outlets).toHaveLength(1);
    expect(outlets[0].initialHeight).toBe(200);

    // Verify render uses second component
    const mockRenderContext = {} as RenderItemFormOutletCtx;
    capturedConfig!.renderItemFormOutlet!('test-outlet', mockRenderContext);
    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondOutlet,
      }),
    );
  });

  it('should throw on duplicate form outlet ID with duplicateIdHandling: throw', () => {
    const plugin = createPluginConfig({ duplicateIdHandling: 'throw' });
    const TestComponent = () => <div>Test</div>;

    plugin.addFormOutlet({
      id: 'test-outlet',
      component: TestComponent,
    });

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
      });
    }).toThrow();
  });

  it('should silently replace duplicate outlet with duplicateIdHandling: ignore', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
    const FirstOutlet = () => <div>First Outlet</div>;
    const SecondOutlet = () => <div>Second Outlet</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.addFormOutlet({ id: 'test-outlet', component: FirstOutlet, initialHeight: 100 });
    plugin.addFormOutlet({ id: 'test-outlet', component: SecondOutlet, initialHeight: 200 });

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    plugin.connect();
    const mockModel = { attributes: {} } as Partial<ItemType> as ItemType;
    const mockContext = {} as ItemFormOutletsCtx;
    const outlets = capturedConfig!.itemFormOutlets!(mockModel, mockContext);

    expect(outlets).toHaveLength(1);
    expect(outlets[0].initialHeight).toBe(200);

    // Verify render uses second component
    const mockRenderContext = {} as RenderItemFormOutletCtx;
    capturedConfig!.renderItemFormOutlet!('test-outlet', mockRenderContext);
    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondOutlet,
      }),
    );
  });

  it('should register multiple form outlets with different IDs', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({ id: 'outlet-1', component: TestComponent });
      plugin.addFormOutlet({ id: 'outlet-2', component: TestComponent });
    }).not.toThrow();
  });
});
