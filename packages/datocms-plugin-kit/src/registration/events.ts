import type { FullConnectParameters } from 'datocms-plugin-sdk';

import type {
  OnBeforeItemsDestroyHandler,
  OnBeforeItemsPublishHandler,
  OnBeforeItemsUnpublishHandler,
  OnBeforeItemUpsertHandler,
  OnBootHandler,
} from '../types';

export function createEventHooksRegistration(config: Partial<FullConnectParameters>) {
  // Storage for multiple handlers per event type
  const onBootHandlers: OnBootHandler[] = [];
  const onBeforeItemUpsertHandlers: OnBeforeItemUpsertHandler[] = [];
  const onBeforeItemsDestroyHandlers: OnBeforeItemsDestroyHandler[] = [];
  const onBeforeItemsPublishHandlers: OnBeforeItemsPublishHandler[] = [];
  const onBeforeItemsUnpublishHandlers: OnBeforeItemsUnpublishHandler[] = [];

  function onBoot(handler: OnBootHandler) {
    onBootHandlers.push(handler);

    // Create a wrapper that calls all registered handlers in parallel
    config.onBoot = async (ctx) => {
      await Promise.all(onBootHandlers.map((h) => h(ctx)));
    };
  }

  function onBeforeItemUpsert(handler: OnBeforeItemUpsertHandler) {
    onBeforeItemUpsertHandlers.push(handler);

    // Create a wrapper that calls all registered handlers in parallel
    config.onBeforeItemUpsert = async (item, ctx) => {
      try {
        await Promise.all(
          onBeforeItemUpsertHandlers.map((h) =>
            (async () => {
              try {
                const result = await h(item, ctx);
                if (result === false) {
                  throw new Error('Handler returned false');
                }
              } catch (error) {
                // Re-throw only our rejection, swallow handler errors
                if (error instanceof Error && error.message === 'Handler returned false') {
                  throw error;
                }
                // Handler threw an error - fulfill by not throwing
              }
            })(),
          ),
        );
        return true;
      } catch {
        // One handler returned false
        return false;
      }
    };
  }

  function onBeforeItemsDestroy(handler: OnBeforeItemsDestroyHandler) {
    onBeforeItemsDestroyHandlers.push(handler);

    // Create a wrapper that calls all registered handlers in parallel
    config.onBeforeItemsDestroy = async (items, ctx) => {
      try {
        await Promise.all(
          onBeforeItemsDestroyHandlers.map((h) =>
            (async () => {
              try {
                const result = await h(items, ctx);
                if (result === false) {
                  throw new Error('Handler returned false');
                }
              } catch (error) {
                // Re-throw only our rejection, swallow handler errors
                if (error instanceof Error && error.message === 'Handler returned false') {
                  throw error;
                }
                // Handler threw an error - fulfill by not throwing
              }
            })(),
          ),
        );
        return true;
      } catch {
        // One handler returned false
        return false;
      }
    };
  }

  function onBeforeItemsPublish(handler: OnBeforeItemsPublishHandler) {
    onBeforeItemsPublishHandlers.push(handler);

    // Create a wrapper that calls all registered handlers in parallel
    config.onBeforeItemsPublish = async (items, ctx) => {
      try {
        await Promise.all(
          onBeforeItemsPublishHandlers.map((h) =>
            (async () => {
              try {
                const result = await h(items, ctx);
                if (result === false) {
                  throw new Error('Handler returned false');
                }
              } catch (error) {
                // Re-throw only our rejection, swallow handler errors
                if (error instanceof Error && error.message === 'Handler returned false') {
                  throw error;
                }
                // Handler threw an error - fulfill by not throwing
              }
            })(),
          ),
        );
        return true;
      } catch {
        // One handler returned false
        return false;
      }
    };
  }

  function onBeforeItemsUnpublish(handler: OnBeforeItemsUnpublishHandler) {
    onBeforeItemsUnpublishHandlers.push(handler);

    // Create a wrapper that calls all registered handlers in parallel
    config.onBeforeItemsUnpublish = async (items, ctx) => {
      try {
        await Promise.all(
          onBeforeItemsUnpublishHandlers.map((h) =>
            (async () => {
              try {
                const result = await h(items, ctx);
                if (result === false) {
                  throw new Error('Handler returned false');
                }
              } catch (error) {
                // Re-throw only our rejection, swallow handler errors
                if (error instanceof Error && error.message === 'Handler returned false') {
                  throw error;
                }
                // Handler threw an error - fulfill by not throwing
              }
            })(),
          ),
        );
        return true;
      } catch {
        // One handler returned false
        return false;
      }
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
