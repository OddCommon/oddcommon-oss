import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Form Outlet Registration', () => {
  it('should register a form outlet with combined approach', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
        initialHeight: 100,
        shouldApply: () => true,
      });
    }).not.toThrow();
  });

  it('should throw on duplicate form outlet ID', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    plugin.addFormOutlet({
      id: 'test-outlet',
      component: TestComponent,
    });

    expect(() => {
      plugin.addFormOutlet({
        id: 'test-outlet',
        component: TestComponent,
      });
    }).toThrow('Form outlet with id "test-outlet" is already registered');
  });

  it('should register multiple form outlets with different IDs', () => {
    const plugin = createPluginConfig();
    const TestComponent = () => <div>Test</div>;

    expect(() => {
      plugin.addFormOutlet({ id: 'outlet-1', component: TestComponent });
      plugin.addFormOutlet({ id: 'outlet-2', component: TestComponent });
    }).not.toThrow();
  });
});
