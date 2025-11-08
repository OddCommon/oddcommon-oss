import type { DropdownAction, FullConnectParameters, Icon } from 'datocms-plugin-sdk';

import type {
  DropdownActionConfig,
  FieldDropdownActionConfig,
  ItemFormDropdownActionConfig,
  ItemsDropdownActionConfig,
  PluginInternalConfig,
  UploadsDropdownActionConfig,
} from '../types';
import { validateUniqueId } from '../utils/validation';

export function createDropdownActionRegistration(
  config: Partial<FullConnectParameters>,
  internalConfig: PluginInternalConfig,
) {
  // Store action configurations by type with specific types
  const fieldActions = new Map<string, FieldDropdownActionConfig>();
  const itemFormActions = new Map<string, ItemFormDropdownActionConfig>();
  const itemsActions = new Map<string, ItemsDropdownActionConfig>();
  const uploadsActions = new Map<string, UploadsDropdownActionConfig>();

  function addDropdownAction(actionConfig: DropdownActionConfig) {
    const {
      type,
      id,
      label: _label,
      icon: _icon,
      execute: _execute,
      shouldApply: _shouldApply,
    } = actionConfig;

    // Route to appropriate handler based on type
    switch (type) {
      case 'field': {
        validateUniqueId(
          id,
          Array.from(fieldActions.keys()),
          `${type} dropdown action`,
          internalConfig.duplicateIdHandling,
        );
        // In warn/ignore mode, Map.set() below will naturally replace the old entry
        // In throw mode, validateUniqueId already threw an error
        fieldActions.set(id, actionConfig as FieldDropdownActionConfig);

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
      }

      case 'itemForm': {
        validateUniqueId(
          id,
          Array.from(itemFormActions.keys()),
          `${type} dropdown action`,
          internalConfig.duplicateIdHandling,
        );
        // In warn/ignore mode, Map.set() below will naturally replace the old entry
        // In throw mode, validateUniqueId already threw an error
        itemFormActions.set(id, actionConfig as ItemFormDropdownActionConfig);

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
      }

      case 'items': {
        validateUniqueId(
          id,
          Array.from(itemsActions.keys()),
          `${type} dropdown action`,
          internalConfig.duplicateIdHandling,
        );
        // In warn/ignore mode, Map.set() below will naturally replace the old entry
        // In throw mode, validateUniqueId already threw an error
        itemsActions.set(id, actionConfig as ItemsDropdownActionConfig);

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
      }

      case 'uploads': {
        validateUniqueId(
          id,
          Array.from(uploadsActions.keys()),
          `${type} dropdown action`,
          internalConfig.duplicateIdHandling,
        );
        // In warn/ignore mode, Map.set() below will naturally replace the old entry
        // In throw mode, validateUniqueId already threw an error
        uploadsActions.set(id, actionConfig as UploadsDropdownActionConfig);

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
      }

      default:
        throw new Error(`Unknown dropdown action type: ${type}`);
    }
  }

  return {
    addDropdownAction,
  };
}
