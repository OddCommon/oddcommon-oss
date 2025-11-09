import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type {
  CustomBlockStylesForStructuredTextFieldHandler,
  CustomMarksForStructuredTextFieldHandler,
  PluginInternalConfig,
} from '../types';

export function createStructuredTextCustomizationRegistration(
  config: Partial<FullConnectParameters>,
  _internalConfig: PluginInternalConfig,
) {
  function customBlockStylesForStructuredTextField(
    handler: CustomBlockStylesForStructuredTextFieldHandler,
  ) {
    if (config.customBlockStylesForStructuredTextField) {
      console.warn(
        '[datocms-plugin-kit] customBlockStylesForStructuredTextField is already registered. Replacing existing handler.',
      );
    }

    config.customBlockStylesForStructuredTextField = handler;
  }

  function customMarksForStructuredTextField(handler: CustomMarksForStructuredTextFieldHandler) {
    if (config.customMarksForStructuredTextField) {
      console.warn(
        '[datocms-plugin-kit] customMarksForStructuredTextField is already registered. Replacing existing handler.',
      );
    }

    config.customMarksForStructuredTextField = handler;
  }

  return {
    customBlockStylesForStructuredTextField,
    customMarksForStructuredTextField,
  };
}
