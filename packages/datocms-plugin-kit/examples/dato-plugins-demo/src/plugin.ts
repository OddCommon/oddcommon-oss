import { createPluginConfig } from '@oddcommon/datocms-plugin-kit';

import { render } from './render';

export const {
  addFormOutlet,
  addPage,
  addMainNavigationTab,
  addSidebarPanel,
  addFieldExtension,
  overrideFieldExtension,
  customBlockStylesForStructuredTextField,
  customMarksForStructuredTextField,
  connect,
} = createPluginConfig({
  render,
});
