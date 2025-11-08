import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type { ModalConfig, PluginInternalConfig } from '../types';
import { validateUniqueId } from '../utils/validation';

export function createModalRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  const modals = new Map<string, ModalConfig>();

  function addModal(modalConfig: ModalConfig) {
    const existingIds = Array.from(modals.keys());
    validateUniqueId(modalConfig.id, existingIds, 'Modal', internalConfig.duplicateIdHandling);

    // In warn/ignore mode, the Map.set() below will naturally replace the old entry
    // In throw mode, validateUniqueId already threw an error

    // Store the config
    modals.set(modalConfig.id, modalConfig);

    // Register render hook
    if (!config.renderModal) {
      config.renderModal = (modalId, ctx) => {
        const modal = modals.get(modalId);
        if (modal) {
          const Component = modal.component;
          internalConfig.render(<Component ctx={ctx} />);
        }
      };
    }
  }

  return {
    addModal,
  };
}
