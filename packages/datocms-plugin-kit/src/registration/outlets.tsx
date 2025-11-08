import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type { CollectionOutletConfig, FormOutletConfig, PluginInternalConfig } from '../types';
import { validateUniqueId } from '../utils/validation';

export function createOutletRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  const outlets = new Map<string, FormOutletConfig>();

  function addFormOutlet(outletConfig: FormOutletConfig) {
    const existingIds = Array.from(outlets.keys());
    validateUniqueId(
      outletConfig.id,
      existingIds,
      'Form outlet',
      internalConfig.duplicateIdHandling,
    );

    // Store the config (Map.set naturally replaces if duplicate)
    outlets.set(outletConfig.id, outletConfig);

    // Register declaration hook (single function that returns all outlets)
    config.itemFormOutlets = (model, ctx) => {
      return Array.from(outlets.values())
        .filter((outlet) => !outlet.shouldApply || outlet.shouldApply(model, ctx))
        .map((outlet) => ({
          id: outlet.id,
          initialHeight: outlet.initialHeight ?? 0,
        }));
    };

    // Register render hook
    if (!config.renderItemFormOutlet) {
      config.renderItemFormOutlet = (outletId, ctx) => {
        const outlet = outlets.get(outletId);
        if (outlet) {
          const Component = outlet.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addCollectionOutlet(_outletConfig: CollectionOutletConfig) {
    // For collection outlets, we'll use a similar approach when implemented
    // For now, just throw the not implemented error

    // Similar implementation to addFormOutlet
    // TODO: Implement in a future task
    throw new Error('Collection outlets not yet implemented');
  }

  return {
    addFormOutlet,
    addCollectionOutlet,
  };
}
