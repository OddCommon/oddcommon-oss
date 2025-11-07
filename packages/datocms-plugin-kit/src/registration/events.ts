import type { FullConnectParameters } from 'datocms-plugin-sdk';
import type {
  OnBeforeItemsDestroyHandler,
  OnBeforeItemsPublishHandler,
  OnBeforeItemsUnpublishHandler,
  OnBeforeItemUpsertHandler,
  OnBootHandler,
} from '../types';

export function createEventHooksRegistration(
  config: Partial<FullConnectParameters>
) {
  // Storage for multiple handlers per event type
  const onBeforeItemUpsertHandlers: OnBeforeItemUpsertHandler[] = [];
  const onBeforeItemsDestroyHandlers: OnBeforeItemsDestroyHandler[] = [];
  const onBeforeItemsPublishHandlers: OnBeforeItemsPublishHandler[] = [];
  const onBeforeItemsUnpublishHandlers: OnBeforeItemsUnpublishHandler[] = [];

  function onBoot(handler: OnBootHandler) {
    // onBoot is set directly as it's called once
    config.onBoot = handler;
  }

  function onBeforeItemUpsert(handler: OnBeforeItemUpsertHandler) {
    onBeforeItemUpsertHandlers.push(handler);

    // Create a wrapper that calls all registered handlers
    config.onBeforeItemUpsert = async (item, ctx) => {
      for (const h of onBeforeItemUpsertHandlers) {
        const result = await h(item, ctx);
        // If any handler returns false, stop and return false
        if (result === false) {
          return false;
        }
      }
      return true;
    };
  }

  function onBeforeItemsDestroy(handler: OnBeforeItemsDestroyHandler) {
    onBeforeItemsDestroyHandlers.push(handler);

    // Create a wrapper that calls all registered handlers
    config.onBeforeItemsDestroy = async (items, ctx) => {
      for (const h of onBeforeItemsDestroyHandlers) {
        const result = await h(items, ctx);
        // If any handler returns false, stop and return false
        if (result === false) {
          return false;
        }
      }
      return true;
    };
  }

  function onBeforeItemsPublish(handler: OnBeforeItemsPublishHandler) {
    onBeforeItemsPublishHandlers.push(handler);

    // Create a wrapper that calls all registered handlers
    config.onBeforeItemsPublish = async (items, ctx) => {
      for (const h of onBeforeItemsPublishHandlers) {
        const result = await h(items, ctx);
        // If any handler returns false, stop and return false
        if (result === false) {
          return false;
        }
      }
      return true;
    };
  }

  function onBeforeItemsUnpublish(handler: OnBeforeItemsUnpublishHandler) {
    onBeforeItemsUnpublishHandlers.push(handler);

    // Create a wrapper that calls all registered handlers
    config.onBeforeItemsUnpublish = async (items, ctx) => {
      for (const h of onBeforeItemsUnpublishHandlers) {
        const result = await h(items, ctx);
        // If any handler returns false, stop and return false
        if (result === false) {
          return false;
        }
      }
      return true;
    };
  }

  return {
    onBoot,
    onBeforeItemUpsert,
    onBeforeItemsDestroy,
    onBeforeItemsPublish,
    onBeforeItemsUnpublish,
  };
}
