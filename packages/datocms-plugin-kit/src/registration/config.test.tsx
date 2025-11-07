import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Config Screen Registration', () => {
  it('should register a config screen', () => {
    const plugin = createPluginConfig();
    const TestConfigScreen = () => <div>Config Screen</div>;

    expect(() => {
      plugin.configureConfigScreen({
        component: TestConfigScreen,
      });
    }).not.toThrow();
  });

  it('should throw if config screen is registered twice', () => {
    const plugin = createPluginConfig();
    const TestConfigScreen = () => <div>Config Screen</div>;

    plugin.configureConfigScreen({ component: TestConfigScreen });

    expect(() => {
      plugin.configureConfigScreen({ component: TestConfigScreen });
    }).toThrow('Config screen is already configured');
  });
});
