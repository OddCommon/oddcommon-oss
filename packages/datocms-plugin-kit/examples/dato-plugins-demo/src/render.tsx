import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!);

export const render = (component: React.ReactNode) => {
  root.render(<StrictMode>{component}</StrictMode>);
};
