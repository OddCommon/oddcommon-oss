import type { FieldExtensionOverride, FullConnectParameters, ManualFieldExtension, RenderFieldExtensionCtx, RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { FieldExtensionConfig, FieldExtensionOverrideConfig } from '../types';

export function createFieldExtensionRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const fieldExtensionRenderers = new Map<string, React.ComponentType<{ ctx: RenderFieldExtensionCtx }>>();
  const configScreenRenderers = new Map<string, React.ComponentType<{ ctx: RenderManualFieldExtensionConfigScreenCtx }>>();
  const configValidators = new Map<string, (params: Record<string, unknown>) => Record<string, string>>();
  const registeredExtensionIds = new Set<string>();
  const extensionConfigs: FieldExtensionConfig[] = [];
  const overrideConfigs: FieldExtensionOverrideConfig[] = [];

  function addFieldExtension(extensionConfig: FieldExtensionConfig) {
    validateRequired(
      extensionConfig as unknown as Record<string, unknown>,
      ['id', 'name', 'type', 'fieldTypes', 'component'],
      'Field extension'
    );

    const existingIds = Array.from(registeredExtensionIds);
    validateUniqueId(extensionConfig.id, existingIds, 'Field extension');

    // Track the registered ID and config
    registeredExtensionIds.add(extensionConfig.id);
    extensionConfigs.push(extensionConfig);

    // Store component for rendering
    fieldExtensionRenderers.set(extensionConfig.id, extensionConfig.component);

    // Store config screen if provided
    if (extensionConfig.configComponent) {
      configScreenRenderers.set(extensionConfig.id, extensionConfig.configComponent);
    }

    // Store validator if provided
    if (extensionConfig.validateConfig) {
      configValidators.set(extensionConfig.id, extensionConfig.validateConfig);
    }

    // Register manual field extensions hook (single function that returns all extensions)
    config.manualFieldExtensions = () => {
      return extensionConfigs.map(config => {
        const extension: ManualFieldExtension = {
          id: config.id,
          name: config.name,
          type: config.type,
          fieldTypes: config.fieldTypes,
        };

        // Add configurable flag if defined
        if (config.configurable !== undefined) {
          extension.configurable = config.configurable;
        }

        return extension;
      });
    };

    // Register render hook for field extensions
    if (!config.renderFieldExtension) {
      config.renderFieldExtension = (extensionId, ctx) => {
        const Component = fieldExtensionRenderers.get(extensionId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }

    // Register config screen render hook if configurable extensions exist
    if (configScreenRenderers.size > 0 && !config.renderManualFieldExtensionConfigScreen) {
      config.renderManualFieldExtensionConfigScreen = (extensionId, ctx) => {
        const Component = configScreenRenderers.get(extensionId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }

    // Register validator hook if validators exist
    if (configValidators.size > 0 && !config.validateManualFieldExtensionParameters) {
      config.validateManualFieldExtensionParameters = (extensionId, params) => {
        const validator = configValidators.get(extensionId);
        if (validator) {
          return validator(params);
        }
        return {};
      };
    }
  }

  function overrideFieldExtension(overrideConfig: FieldExtensionOverrideConfig) {
    validateRequired(
      overrideConfig as unknown as Record<string, unknown>,
      ['shouldApply'],
      'Field extension override'
    );

    // Store the override config
    overrideConfigs.push(overrideConfig);

    // Register overrideFieldExtensions hook (single function that processes all overrides)
    config.overrideFieldExtensions = (field, ctx) => {
      // Find the first matching override
      for (const override of overrideConfigs) {
        if (override.shouldApply(field, ctx)) {
          const result: FieldExtensionOverride = {};

          if (override.editor) {
            result.editor = override.editor;
          }

          if (override.addons && override.addons.length > 0) {
            result.addons = override.addons;
          }

          return result;
        }
      }

      // No override matched, return undefined to use default
      return undefined;
    };
  }

  return {
    addFieldExtension,
    overrideFieldExtension,
  };
}
