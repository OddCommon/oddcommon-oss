import { describe, expect, it } from 'vitest';
import { createPluginConfig } from '../factory';

describe('Field Extension Registration', () => {
  describe('addFieldExtension', () => {
    it('should register a manual field extension', () => {
      const plugin = createPluginConfig();
      const TestExtension = () => <div>Test Extension</div>;

      expect(() => {
        plugin.addFieldExtension({
          id: 'test-extension',
          name: 'Test Extension',
          type: 'editor',
          fieldTypes: ['string', 'text'],
          component: TestExtension,
        });
      }).not.toThrow();
    });

    it('should throw on duplicate field extension ID', () => {
      const plugin = createPluginConfig();
      const TestExtension = () => <div>Test Extension</div>;

      plugin.addFieldExtension({
        id: 'test-extension',
        name: 'Test Extension',
        type: 'editor',
        fieldTypes: ['string'],
        component: TestExtension,
      });

      expect(() => {
        plugin.addFieldExtension({
          id: 'test-extension',
          name: 'Test Extension 2',
          type: 'editor',
          fieldTypes: ['string'],
          component: TestExtension,
        });
      }).toThrow('Field extension with id "test-extension" is already registered');
    });

    it('should register multiple extensions with different IDs', () => {
      const plugin = createPluginConfig();
      const TestExtension = () => <div>Test Extension</div>;

      expect(() => {
        plugin.addFieldExtension({
          id: 'extension-1',
          name: 'Extension 1',
          type: 'editor',
          fieldTypes: ['string'],
          component: TestExtension,
        });
        plugin.addFieldExtension({
          id: 'extension-2',
          name: 'Extension 2',
          type: 'addon',
          fieldTypes: ['text'],
          component: TestExtension,
        });
      }).not.toThrow();
    });

    it('should support configurable extensions', () => {
      const plugin = createPluginConfig();
      const TestExtension = () => <div>Test Extension</div>;
      const ConfigScreen = () => <div>Config Screen</div>;
      const validateConfig = (params: Record<string, unknown>) => {
        const errors: Record<string, string> = {};
        if (!params.apiKey) {
          errors.apiKey = 'API key is required';
        }
        return errors;
      };

      expect(() => {
        plugin.addFieldExtension({
          id: 'configurable-extension',
          name: 'Configurable Extension',
          type: 'editor',
          fieldTypes: ['string'],
          component: TestExtension,
          configurable: true,
          configComponent: ConfigScreen,
          validateConfig,
        });
      }).not.toThrow();
    });

    it('should support non-configurable extensions', () => {
      const plugin = createPluginConfig();
      const TestExtension = () => <div>Test Extension</div>;

      expect(() => {
        plugin.addFieldExtension({
          id: 'simple-extension',
          name: 'Simple Extension',
          type: 'addon',
          fieldTypes: ['string', 'text', 'json'],
          component: TestExtension,
          configurable: false,
        });
      }).not.toThrow();
    });
  });

  describe('overrideFieldExtension', () => {
    it('should register a field extension override', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.overrideFieldExtension({
          shouldApply: (field, _ctx) => field.attributes.api_key === 'custom_field',
          editor: { id: 'custom-editor' },
        });
      }).not.toThrow();
    });

    it('should support addons in overrides', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.overrideFieldExtension({
          shouldApply: (field) => field.attributes.field_type === 'string',
          addons: [
            { id: 'char-counter' },
            { id: 'validation-hint', parameters: { message: 'Custom hint' } },
          ],
        });
      }).not.toThrow();
    });

    it('should support both editor and addons in overrides', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.overrideFieldExtension({
          shouldApply: (field) => field.attributes.api_key === 'rich_text',
          editor: { id: 'markdown-editor', parameters: { toolbar: 'full' } },
          addons: [{ id: 'preview-addon' }],
        });
      }).not.toThrow();
    });

    it('should allow multiple overrides with different conditions', () => {
      const plugin = createPluginConfig();

      expect(() => {
        plugin.overrideFieldExtension({
          shouldApply: (field) => field.attributes.api_key === 'field1',
          editor: { id: 'editor1' },
        });
        plugin.overrideFieldExtension({
          shouldApply: (field) => field.attributes.api_key === 'field2',
          editor: { id: 'editor2' },
        });
      }).not.toThrow();
    });
  });
});
