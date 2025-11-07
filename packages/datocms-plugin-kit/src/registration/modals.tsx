import type { FullConnectParameters, RenderModalCtx } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { ModalConfig } from '../types';

export function createModalRegistration(
  config: Partial<FullConnectParameters>,
  render: (component: React.ReactNode) => void
) {
  const modalRenderers = new Map<string, React.ComponentType<{ ctx: RenderModalCtx }>>();

  function addModal(modalConfig: ModalConfig) {
    validateRequired(modalConfig as unknown as Record<string, unknown>, ['id', 'component'], 'Modal');

    const existingIds = Array.from(modalRenderers.keys());
    validateUniqueId(modalConfig.id, existingIds, 'Modal');

    // Store component for rendering
    modalRenderers.set(modalConfig.id, modalConfig.component);

    // Register render hook
    if (!config.renderModal) {
      config.renderModal = (modalId, ctx) => {
        const Component = modalRenderers.get(modalId);
        if (Component) {
          render(<Component ctx={ctx} />);
        }
      };
    }
  }

  return {
    addModal,
  };
}
