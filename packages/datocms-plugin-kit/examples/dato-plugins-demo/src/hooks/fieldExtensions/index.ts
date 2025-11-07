import { addFieldExtension, overrideFieldExtension } from '~/plugin';

import { DemoSelectField } from './DemoSelectField';

// Register the field extension
addFieldExtension({
  id: 'demo-select',
  name: 'Demo Select Field',
  type: 'editor',
  fieldTypes: ['string'],
  component: DemoSelectField,
});

// Override fields with api_key 'demo_text_field' to use our custom select
overrideFieldExtension({
  shouldApply: (field) => field.attributes.api_key === 'demo_text_field',
  editor: {
    id: 'demo-select',
  },
});
