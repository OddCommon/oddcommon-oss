import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Modal Registration', () => {
  it('should register a modal', () => {
    const plugin = createPluginConfig();
    const TestModal = () => <div>Test Modal</div>;

    expect(() => {
      plugin.addModal({
        id: 'test-modal',
        component: TestModal,
      });
    }).not.toThrow();
  });

  it('should throw on duplicate modal ID', () => {
    const plugin = createPluginConfig();
    const TestModal = () => <div>Test Modal</div>;

    plugin.addModal({
      id: 'test-modal',
      component: TestModal,
    });

    expect(() => {
      plugin.addModal({
        id: 'test-modal',
        component: TestModal,
      });
    }).toThrow('Modal with id "test-modal" is already registered');
  });

  it('should register multiple modals with different IDs', () => {
    const plugin = createPluginConfig();
    const TestModal1 = () => <div>Test Modal 1</div>;
    const TestModal2 = () => <div>Test Modal 2</div>;

    expect(() => {
      plugin.addModal({ id: 'modal-1', component: TestModal1 });
      plugin.addModal({ id: 'modal-2', component: TestModal2 });
    }).not.toThrow();
  });
});
