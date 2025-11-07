import type { FullConnectParameters } from 'datocms-plugin-sdk';
import { validateRequired } from '../utils/validation';
import type { ConfigScreenConfig } from '../types';

export function createConfigScreenRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  let isConfigured = false;

  function configureConfigScreen(screenConfig: ConfigScreenConfig) {
    validateRequired(screenConfig as unknown as Record<string, unknown>, ['component'], 'Config screen');

    if (isConfigured) {
      throw new Error('Config screen is already configured');
    }

    isConfigured = true;

    // Register render hook
    config.renderConfigScreen = (ctx) => {
      const Component = screenConfig.component;
      render(<Component ctx={ctx} />);
    };
  }

  return {
    configureConfigScreen,
  };
}
