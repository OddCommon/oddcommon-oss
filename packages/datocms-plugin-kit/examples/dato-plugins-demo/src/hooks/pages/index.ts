import { addMainNavigationTab, addPage } from '~/plugin';

import { TestPage } from './TestPage';

const pageId = 'test-page';

addMainNavigationTab({
  label: 'Test Page',
  icon: 'chart-line',
  pointsTo: { pageId },
});

addPage({
  pageId,
  component: TestPage,
});
