import type { FullConnectParameters, RenderConfigScreenCtx } from 'datocms-plugin-sdk';
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

describe('Config Screen Registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  it('should register a config screen', () => {
    const plugin = createPluginConfig();
    const TestConfigScreen = () => <div>Config Screen</div>;

    expect(() => {
      plugin.configureConfigScreen({
        component: TestConfigScreen,
      });
    }).not.toThrow();
  });

  it('should warn by default if config screen is registered twice', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });
    const FirstConfigScreen = () => <div>First Config Screen</div>;
    const SecondConfigScreen = () => <div>Second Config Screen</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.configureConfigScreen({ component: FirstConfigScreen });
    plugin.configureConfigScreen({ component: SecondConfigScreen });

    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    plugin.connect();
    const mockContext = {} as RenderConfigScreenCtx;
    capturedConfig!.renderConfigScreen!(mockContext);

    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondConfigScreen,
      })
    );
  });

  it('should throw if config screen is registered twice with duplicateIdHandling: throw', () => {
    const plugin = createPluginConfig({ duplicateIdHandling: 'throw' });
    const TestConfigScreen = () => <div>Config Screen</div>;

    plugin.configureConfigScreen({ component: TestConfigScreen });

    expect(() => {
      plugin.configureConfigScreen({ component: TestConfigScreen });
    }).toThrow();
  });

  it('should silently replace config screen with duplicateIdHandling: ignore', () => {
    const plugin = createPluginConfig({ duplicateIdHandling: 'ignore' });
    const FirstConfigScreen = () => <div>First Config Screen</div>;
    const SecondConfigScreen = () => <div>Second Config Screen</div>;
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    plugin.configureConfigScreen({ component: FirstConfigScreen });
    plugin.configureConfigScreen({ component: SecondConfigScreen });

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();

    // Verify second registration replaced the first
    const customRender = vi.fn();
    const mockContext = {} as RenderConfigScreenCtx;

    // Create a new plugin with custom render to test
    const testPlugin = createPluginConfig({ render: customRender, duplicateIdHandling: 'ignore' });
    testPlugin.configureConfigScreen({ component: FirstConfigScreen });
    testPlugin.configureConfigScreen({ component: SecondConfigScreen });
    testPlugin.connect();

    capturedConfig!.renderConfigScreen!(mockContext);
    expect(customRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: SecondConfigScreen,
      }),
    );
  });
});
