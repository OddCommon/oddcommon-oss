import { connect as sdkConnect } from 'datocms-plugin-sdk';
import type { FullConnectParameters } from 'datocms-plugin-sdk';
import { createDefaultRender } from './render';
import { createOutletRegistration } from './registration/outlets';
import { createPageRegistration } from './registration/pages';
import { createSidebarRegistration } from './registration/sidebars';
import { createFieldExtensionRegistration } from './registration/fields';
import { createModalRegistration } from './registration/modals';
import { createConfigScreenRegistration } from './registration/config';
import { createDropdownActionRegistration } from './registration/dropdowns';
import { createEventHooksRegistration } from './registration/events';
import type { PluginOptions } from './types';

export function createPluginConfig(options?: PluginOptions) {
  const config: Partial<FullConnectParameters> = {};
  const render = options?.render ?? createDefaultRender();

  const { addFormOutlet, addCollectionOutlet } = createOutletRegistration(config, render);
  const { addPage, addMainNavigationTab, addContentAreaSidebarItem, addSettingsAreaSidebarItem } = createPageRegistration(config, render);
  const { addSidebarPanel, addSidebar } = createSidebarRegistration(config, render);
  const { addFieldExtension, overrideFieldExtension } = createFieldExtensionRegistration(config, render);
  const { addModal } = createModalRegistration(config, render);
  const { configureConfigScreen } = createConfigScreenRegistration(config, render);
  const { addDropdownAction } = createDropdownActionRegistration(config);
  const { onBoot, onBeforeItemUpsert, onBeforeItemsDestroy, onBeforeItemsPublish, onBeforeItemsUnpublish } = createEventHooksRegistration(config);

  const connect = () => {
    return sdkConnect(config);
  };

  return {
    addFormOutlet,
    addCollectionOutlet,
    addPage,
    addMainNavigationTab,
    addContentAreaSidebarItem,
    addSettingsAreaSidebarItem,
    addSidebarPanel,
    addSidebar,
    addFieldExtension,
    overrideFieldExtension,
    addModal,
    configureConfigScreen,
    addDropdownAction,
    onBoot,
    onBeforeItemUpsert,
    onBeforeItemsDestroy,
    onBeforeItemsPublish,
    onBeforeItemsUnpublish,
    connect,
  };
}
