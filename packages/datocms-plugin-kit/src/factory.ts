import { connect as sdkConnect } from 'datocms-plugin-sdk';
import type { FullConnectParameters } from 'datocms-plugin-sdk';

import { createConfigScreenRegistration } from './registration/config';
import { createDropdownActionRegistration } from './registration/dropdowns';
import { createEventHooksRegistration } from './registration/events';
import { createFieldExtensionRegistration } from './registration/fields';
import { createModalRegistration } from './registration/modals';
import { createOutletRegistration } from './registration/outlets';
import { createPageRegistration } from './registration/pages';
import { createSidebarRegistration } from './registration/sidebars';
import { createDefaultRender } from './render';
import type { PluginInternalConfig, PluginOptions } from './types';

export function createPluginConfig(options?: PluginOptions) {
  const config: Partial<FullConnectParameters> = {};

  // Create shared internal configuration
  const internalConfig: PluginInternalConfig = {
    render: options?.render ?? createDefaultRender(),
    duplicateIdHandling: options?.duplicateIdHandling ?? 'warn',
  };

  const { addFormOutlet, addCollectionOutlet } = createOutletRegistration(config, internalConfig);
  const { addPage, addMainNavigationTab, addContentAreaSidebarItem, addSettingsAreaSidebarItem } =
    createPageRegistration(config, internalConfig);
  const { addSidebarPanel, addSidebar } = createSidebarRegistration(config, internalConfig);
  const { addFieldExtension, overrideFieldExtension } = createFieldExtensionRegistration(
    config,
    internalConfig,
  );
  const { addModal } = createModalRegistration(config, internalConfig);
  const { configureConfigScreen } = createConfigScreenRegistration(config, internalConfig);
  const { addDropdownAction } = createDropdownActionRegistration(config, internalConfig);
  const {
    onBoot,
    onBeforeItemUpsert,
    onBeforeItemsDestroy,
    onBeforeItemsPublish,
    onBeforeItemsUnpublish,
  } = createEventHooksRegistration(config);

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
