import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type { ConfigScreenConfig, PluginInternalConfig } from '../types';

export function createConfigScreenRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  let isConfigured = false;

  function configureConfigScreen(screenConfig: ConfigScreenConfig) {
    if (isConfigured) {
      const message = 'Config screen is already configured';

      switch (internalConfig.duplicateIdHandling) {
        case 'throw':
          throw new Error(message);
        case 'warn':
          console.warn(`[datocms-plugin-kit] ${message}`);
          break; // Continue to replace
        case 'ignore':
          break; // Continue to replace
      }
    }

    // Register render hook
    config.renderConfigScreen = (ctx) => {
      const Component = screenConfig.component;
      internalConfig.render(<Component ctx={ctx} />);
    };

    isConfigured = true;
  }

  return {
    configureConfigScreen,
  };
}
