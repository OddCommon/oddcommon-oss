import { describe, expect, it, vi } from 'vitest';
import { createPluginConfig } from './factory';

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn(),
}));

describe('createPluginConfig', () => {
  it('should return an object with registration functions', () => {
    const plugin = createPluginConfig();

    expect(plugin).toHaveProperty('addFormOutlet');
    expect(plugin).toHaveProperty('addPage');
    expect(plugin).toHaveProperty('addMainNavigationTab');
    expect(plugin).toHaveProperty('connect');
  });

  it('should use custom render function when provided', () => {
    const customRender = vi.fn();
    const plugin = createPluginConfig({ render: customRender });

    expect(plugin).toBeDefined();
    // Render function will be tested via registration functions
  });

  it('should call SDK connect when connect is called', async () => {
    const { connect: sdkConnect } = await import('datocms-plugin-sdk');
    const plugin = createPluginConfig();

    plugin.connect();

    expect(sdkConnect).toHaveBeenCalledOnce();
  });
});
