import type { FullConnectParameters, RenderItemFormOutletCtx } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { CollectionOutletConfig, FormOutletConfig } from '../types';

export function createOutletRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const outletRenderers = new Map<string, React.ComponentType<{ ctx: RenderItemFormOutletCtx }>>();
  const registeredOutletIds = new Set<string>();
  const outletConfigs: FormOutletConfig[] = [];

  function addFormOutlet(outletConfig: FormOutletConfig) {
    validateRequired(outletConfig as unknown as Record<string, unknown>, ['id', 'component'], 'Form outlet');

    const existingIds = Array.from(registeredOutletIds);
    validateUniqueId(outletConfig.id, existingIds, 'Form outlet');

    // Track the registered ID and config
    registeredOutletIds.add(outletConfig.id);
    outletConfigs.push(outletConfig);

    // Register declaration hook (single function that returns all outlets)
    config.itemFormOutlets = (model, ctx) => {
      const outlets = outletConfigs
        .filter(config => !config.shouldApply || config.shouldApply(model, ctx))
        .map(config => ({
          id: config.id,
          initialHeight: config.initialHeight ?? 0,
        }));
      return outlets;
    };

    // Store component for rendering
    outletRenderers.set(outletConfig.id, outletConfig.component);

    // Register render hook
    if (!config.renderItemFormOutlet) {
      config.renderItemFormOutlet = (outletId, ctx) => {
        const Component = outletRenderers.get(outletId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  function addCollectionOutlet(outletConfig: CollectionOutletConfig) {
    validateRequired(outletConfig as unknown as Record<string, unknown>, ['id', 'component'], 'Collection outlet');

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
