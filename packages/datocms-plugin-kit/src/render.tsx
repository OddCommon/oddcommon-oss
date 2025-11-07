import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';

export function createDefaultRender() {
  let root: Root | null = null;

  return (component: React.ReactNode): void => {
    if (root === null) {
      const container = document.getElementById('root');
      if (!container) {
        throw new Error('Root element with id "root" not found');
      }
      root = createRoot(container);
    }

    root.render(<StrictMode>{component}</StrictMode>);
  };
}
