import { addFormOutlet } from '~/plugin';

import { TestFormOutlet } from './TestOutlet';

addFormOutlet({
  id: 'test-outlet',
  component: TestFormOutlet,
  initialHeight: 0,
  shouldApply: (_model, ctx) => {
    const fields = Object.values(ctx.fields).map((f) => f?.attributes.api_key);
    console.log('shouldApply', fields);
    return fields.includes('title');
  },
});
