import { describe, expectTypeOf, it } from 'vitest';
import type { FormOutletConfig, PageConfig, PluginOptions } from './types';

describe('Types', () => {
  it('should define PluginOptions with optional render', () => {
    expectTypeOf<PluginOptions>().toMatchTypeOf<{
      render?: (component: React.ReactNode) => void;
    }>();
  });

  it('should define FormOutletConfig with required fields', () => {
    expectTypeOf<FormOutletConfig>().toHaveProperty('id');
    expectTypeOf<FormOutletConfig>().toHaveProperty('component');
  });

  it('should define PageConfig with pageId and component', () => {
    expectTypeOf<PageConfig>().toHaveProperty('pageId');
    expectTypeOf<PageConfig>().toHaveProperty('component');
  });
});
