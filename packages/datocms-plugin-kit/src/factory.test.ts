import { describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from './factory';

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn(),
}));

// Helper mock render function for tests
const mockRender = vi.fn();

describe('createPluginConfig', () => {
  it('should call SDK connect when connect is called', async () => {
    const { connect: sdkConnect } = await import('datocms-plugin-sdk');
    const plugin = createPluginConfig({ render: mockRender });

    plugin.connect();

    expect(sdkConnect).toHaveBeenCalledOnce();
  });
});
