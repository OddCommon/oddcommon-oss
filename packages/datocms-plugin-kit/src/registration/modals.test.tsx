import type { FullConnectParameters, RenderModalCtx } from 'datocms-plugin-sdk';
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

describe('Modal Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it('should register a modal', () => {
    const plugin = createPluginConfig();
    const TestModal = () => <div>Test Modal</div>;

    expect(() => {
      plugin.addModal({
        id: 'test-modal',
        component: TestModal,
      });
    }).not.toThrow();
  });

  it('should warn by default on duplicate modal ID', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });
    const FirstModal = () => <div>First Modal</div>;
    const SecondModal = () => <div>Second Modal</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.addModal({ id: 'test-modal', component: FirstModal });
    plugin.addModal({ id: 'test-modal', component: SecondModal });

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    plugin.connect();
    const mockContext = {} as RenderModalCtx;
    capturedConfig!.renderModal!('test-modal', mockContext);

    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondModal,
      }),
    );
  });

  it('should throw on duplicate modal ID with duplicateIdHandling: throw', () => {
    const plugin = createPluginConfig({ duplicateIdHandling: 'throw' });
    const TestModal = () => <div>Test Modal</div>;

    plugin.addModal({
      id: 'test-modal',
      component: TestModal,
    });

    expect(() => {
      plugin.addModal({
        id: 'test-modal',
        component: TestModal,
      });
    }).toThrow();
  });

  it('should silently replace duplicate modal with duplicateIdHandling: ignore', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
    const FirstModal = () => <div>First Modal</div>;
    const SecondModal = () => <div>Second Modal</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.addModal({ id: 'test-modal', component: FirstModal });
    plugin.addModal({ id: 'test-modal', component: SecondModal });

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    plugin.connect();
    const mockContext = {} as RenderModalCtx;
    capturedConfig!.renderModal!('test-modal', mockContext);

    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondModal,
      }),
    );
  });

  it('should register multiple modals with different IDs', () => {
    const plugin = createPluginConfig();
    const TestModal1 = () => <div>Test Modal 1</div>;
    const TestModal2 = () => <div>Test Modal 2</div>;

    expect(() => {
      plugin.addModal({ id: 'modal-1', component: TestModal1 });
      plugin.addModal({ id: 'modal-2', component: TestModal2 });
    }).not.toThrow();
  });
});
