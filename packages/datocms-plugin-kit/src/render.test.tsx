import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultRender } from './render';
import { StrictMode } from 'react';

// Mock react-dom/client
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

describe('createDefaultRender', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it('should create a render function', () => {
    const render = createDefaultRender();
    expect(render).toBeTypeOf('function');
  });

  it('should lazily create root on first render', async () => {
    const { createRoot } = await import('react-dom/client');
    const render = createDefaultRender();

    render(<div>Test</div>);

    expect(createRoot).toHaveBeenCalledOnce();
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));
  });

  it('should reuse root on subsequent renders', async () => {
    const { createRoot } = await import('react-dom/client');
    const render = createDefaultRender();

    render(<div>Test 1</div>);
    render(<div>Test 2</div>);

    expect(createRoot).toHaveBeenCalledOnce();
  });

  it('should wrap component in StrictMode', async () => {
    const mockRender = vi.fn();
    const { createRoot } = await import('react-dom/client');
    vi.mocked(createRoot).mockReturnValue({ render: mockRender, unmount: vi.fn() });

    const render = createDefaultRender();
    const testComponent = <div>Test</div>;

    render(testComponent);

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StrictMode,
      })
    );
  });

  it('should throw error if root element not found', () => {
    document.body.innerHTML = '';
    const render = createDefaultRender();

    expect(() => render(<div>Test</div>)).toThrow('Root element with id "root" not found');
  });
});
