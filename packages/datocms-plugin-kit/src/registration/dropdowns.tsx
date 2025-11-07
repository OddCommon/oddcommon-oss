import type { DropdownAction, FullConnectParameters, Icon } from 'datocms-plugin-sdk';
import { validateRequired, validateUniqueId } from '../utils/validation';
import type { DropdownActionConfig, DropdownActionType } from '../types';

export function createDropdownActionRegistration(
  config: Partial<FullConnectParameters>
) {
  // Separate ID tracking for each type of dropdown action
  const fieldActionIds = new Set<string>();
  const itemFormActionIds = new Set<string>();
  const itemsActionIds = new Set<string>();
  const uploadsActionIds = new Set<string>();

  // Store action configurations by type
  const fieldActions = new Map<string, DropdownActionConfig>();
  const itemFormActions = new Map<string, DropdownActionConfig>();
  const itemsActions = new Map<string, DropdownActionConfig>();
  const uploadsActions = new Map<string, DropdownActionConfig>();

  function getTypeLabel(type: DropdownActionType): string {
    const labels: Record<DropdownActionType, string> = {
      field: 'Field',
      itemForm: 'Item form',
      items: 'Items',
      uploads: 'Uploads',
    };
    return labels[type];
  }

  function addDropdownAction(actionConfig: DropdownActionConfig) {
    validateRequired(
      actionConfig as unknown as Record<string, unknown>,
      ['type', 'id', 'label', 'execute'],
      'Dropdown action'
    );

    const { type, id, label: _label, icon: _icon, execute: _execute, shouldApply: _shouldApply } = actionConfig;
    const typeLabel = getTypeLabel(type);

    // Route to appropriate handler based on type
    switch (type) {
      case 'field':
        validateUniqueId(id, Array.from(fieldActionIds), `${typeLabel} dropdown action`);
        fieldActionIds.add(id);
        fieldActions.set(id, actionConfig);

        // Register declaration hook
        if (!config.fieldDropdownActions) {
          config.fieldDropdownActions = (field, ctx) => {
            const actions: DropdownAction[] = [];

            for (const [actionId, action] of Array.from(fieldActions)) {
              if (action.shouldApply && !action.shouldApply(field, ctx)) {
                continue;
              }
              actions.push({
                id: actionId,
                label: action.label,
                icon: action.icon as Icon | undefined,
              });
            }

            return actions;
          };
        }

        // Register execute hook
        if (!config.executeFieldDropdownAction) {
          config.executeFieldDropdownAction = async (actionId, ctx) => {
            const action = fieldActions.get(actionId);
            if (action) {
              await action.execute(ctx);
            }
          };
        }
        break;

      case 'itemForm':
        validateUniqueId(id, Array.from(itemFormActionIds), `${typeLabel} dropdown action`);
        itemFormActionIds.add(id);
        itemFormActions.set(id, actionConfig);

        // Register declaration hook
        if (!config.itemFormDropdownActions) {
          config.itemFormDropdownActions = (itemType, ctx) => {
            const actions: DropdownAction[] = [];

            for (const [actionId, action] of Array.from(itemFormActions)) {
              if (action.shouldApply && !action.shouldApply(itemType, ctx)) {
                continue;
              }
              actions.push({
                id: actionId,
                label: action.label,
                icon: action.icon as Icon | undefined,
              });
            }

            return actions;
          };
        }

        // Register execute hook
        if (!config.executeItemFormDropdownAction) {
          config.executeItemFormDropdownAction = async (actionId, ctx) => {
            const action = itemFormActions.get(actionId);
            if (action) {
              await action.execute(ctx);
            }
          };
        }
        break;

      case 'items':
        validateUniqueId(id, Array.from(itemsActionIds), `${typeLabel} dropdown action`);
        itemsActionIds.add(id);
        itemsActions.set(id, actionConfig);

        // Register declaration hook
        if (!config.itemsDropdownActions) {
          config.itemsDropdownActions = (itemType, ctx) => {
            const actions: DropdownAction[] = [];

            for (const [actionId, action] of Array.from(itemsActions)) {
              if (action.shouldApply && !action.shouldApply(itemType, ctx)) {
                continue;
              }
              actions.push({
                id: actionId,
                label: action.label,
                icon: action.icon as Icon | undefined,
              });
            }

            return actions;
          };
        }

        // Register execute hook
        if (!config.executeItemsDropdownAction) {
          config.executeItemsDropdownAction = async (actionId, _items, ctx) => {
            const action = itemsActions.get(actionId);
            if (action) {
              await action.execute(ctx);
            }
          };
        }
        break;

      case 'uploads':
        validateUniqueId(id, Array.from(uploadsActionIds), `${typeLabel} dropdown action`);
        uploadsActionIds.add(id);
        uploadsActions.set(id, actionConfig);

        // Register declaration hook
        if (!config.uploadsDropdownActions) {
          config.uploadsDropdownActions = (ctx) => {
            const actions: DropdownAction[] = [];

            for (const [actionId, action] of Array.from(uploadsActions)) {
              if (action.shouldApply && !action.shouldApply(ctx)) {
                continue;
              }
              actions.push({
                id: actionId,
                label: action.label,
                icon: action.icon as Icon | undefined,
              });
            }

            return actions;
          };
        }

        // Register execute hook
        if (!config.executeUploadsDropdownAction) {
          config.executeUploadsDropdownAction = async (actionId, _uploads, ctx) => {
            const action = uploadsActions.get(actionId);
            if (action) {
              await action.execute(ctx);
            }
          };
        }
        break;

      default:
        throw new Error(`Unknown dropdown action type: ${type}`);
    }
  }

  return {
    addDropdownAction,
  };
}
