import type {
  FieldExtensionOverride,
  FullConnectParameters,
  ManualFieldExtension,
  RenderFieldExtensionCtx,
} from 'datocms-plugin-sdk';

import type {
  FieldExtensionConfig,
  FieldExtensionOverrideConfig,
  HiddenFieldPredicate,
  PluginInternalConfig,
} from '../types';
import { validateUniqueId } from '../utils/validation';

const HIDDEN_FIELD_EXTENSION_ID = '@oddcommon/datocms-plugin-kit/hidden-field';

/**
 * Helper function to render a hidden field
 */
function renderHiddenField(ctx: RenderFieldExtensionCtx) {
  ctx.toggleField(ctx.fieldPath, false);
  // Return null - we don't render anything for hidden fields
  return null;
}

export function createFieldExtensionRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  const extensions = new Map<string, FieldExtensionConfig>();
  const overrides: FieldExtensionOverrideConfig[] = [];
  const hiddenFieldPredicates: HiddenFieldPredicate[] = [];

  function addFieldExtension(extensionConfig: FieldExtensionConfig) {
    const existingIds = Array.from(extensions.keys());
    validateUniqueId(
      extensionConfig.id,
      existingIds,
      'Field extension',
      internalConfig.duplicateIdHandling,
    );

    // Store the config (Map.set naturally replaces if duplicate)
    extensions.set(extensionConfig.id, extensionConfig);

    // Register manual field extensions hook (single function that returns all extensions)
    config.manualFieldExtensions = () => {
      return Array.from(extensions.values()).map((ext) => {
        const extension: ManualFieldExtension = {
          id: ext.id,
          name: ext.name,
          type: ext.type,
          fieldTypes: ext.fieldTypes,
        };

        // Add configurable flag if defined
        if (ext.configurable !== undefined) {
          extension.configurable = ext.configurable;
        }

        return extension;
      });
    };

    // Register render hook for field extensions
    if (!config.renderFieldExtension) {
      config.renderFieldExtension = (extensionId, ctx) => {
        // Handle built-in hidden field extension
        if (extensionId === HIDDEN_FIELD_EXTENSION_ID) {
          return internalConfig.render(renderHiddenField(ctx));
        }

        // Handle user-defined extensions
        const extension = extensions.get(extensionId);
        if (extension) {
          const Component = extension.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }

    // Register config screen render hook if configurable extensions exist
    if (!config.renderManualFieldExtensionConfigScreen) {
      config.renderManualFieldExtensionConfigScreen = (extensionId, ctx) => {
        const extension = extensions.get(extensionId);
        if (extension?.configComponent) {
          const Component = extension.configComponent;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }

    // Register validator hook
    if (!config.validateManualFieldExtensionParameters) {
      config.validateManualFieldExtensionParameters = (extensionId, params) => {
        const extension = extensions.get(extensionId);
        if (extension?.validateConfig) {
          return extension.validateConfig(params);
        }
        return {};
      };
    }
  }

  function addHiddenField(predicate: HiddenFieldPredicate) {
    // Store the predicate
    hiddenFieldPredicates.push(predicate);

    // Update overrideFieldExtensions to check hidden fields
    updateOverrideFieldExtensions();
  }

  function overrideFieldExtension(overrideConfig: FieldExtensionOverrideConfig) {
    // Store the override config
    overrides.push(overrideConfig);

    // Update overrideFieldExtensions
    updateOverrideFieldExtensions();
  }

  function updateOverrideFieldExtensions() {
    // Register overrideFieldExtensions hook (processes hidden fields and user overrides)
    config.overrideFieldExtensions = (field, ctx) => {
      // Check hidden field predicates first
      for (const predicate of hiddenFieldPredicates) {
        if (predicate(field, ctx)) {
          return {
            editor: { id: HIDDEN_FIELD_EXTENSION_ID },
          };
        }
      }

      // Check user-defined overrides
      for (const override of overrides) {
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
    addHiddenField,
  };
}
