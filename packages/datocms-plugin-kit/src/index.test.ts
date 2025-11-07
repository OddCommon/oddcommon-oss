import { describe, expect, it } from 'vitest';
import { createPluginConfig } from './index';

describe('Package exports', () => {
  it('should export createPluginConfig', () => {
    expect(createPluginConfig).toBeDefined();
    expect(typeof createPluginConfig).toBe('function');
  });

  it('should create a complete plugin toolkit', () => {
    const plugin = createPluginConfig();

    // Check all Tier 1 functions exist
    expect(plugin.addFormOutlet).toBeDefined();
    expect(plugin.addPage).toBeDefined();
    expect(plugin.addMainNavigationTab).toBeDefined();
    expect(plugin.addSidebarPanel).toBeDefined();
    expect(plugin.addFieldExtension).toBeDefined();
    expect(plugin.addModal).toBeDefined();
    expect(plugin.configureConfigScreen).toBeDefined();
    expect(plugin.addDropdownAction).toBeDefined();
    expect(plugin.onBoot).toBeDefined();
    expect(plugin.onBeforeItemUpsert).toBeDefined();
    expect(plugin.connect).toBeDefined();
  });
});
