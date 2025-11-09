import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const render = (component: React.ReactNode) => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(<StrictMode>{component}</StrictMode>);
};
