import type { Ctx, Field, ItemType } from 'datocms-plugin-sdk';
import { describe, expect, it } from 'vitest';

import {
  contextHasAllFields,
  extractTextFromStructuredText,
  fieldBelongsToItemType,
  getAllFieldsOfType,
  getFieldExtensionId,
  getFieldItemType,
  getFieldsByItemType,
  getItemTypeByApiKey,
  getUploadUrl,
  hasCurrentUserPermissions,
  hasFieldExtension,
  hasFormMethods,
  isFieldRequired,
  isStructuredTextEmpty,
  isUniqueField,
} from './helpers';

type CtxWithItemTypes = Ctx<{
  itemTypes: Partial<Record<string, ItemType>>;
}>;

describe('Helpers - Complex functions', () => {
  // ============================================================================
  // Type Guards
  // ============================================================================

  describe('hasFormMethods', () => {
    it('should return true when context has formValues and setFieldValue', () => {
      const ctx = {
        formValues: { field1: 'value1' },
        setFieldValue: (_field: string, _value: unknown) => {},
      };

      expect(hasFormMethods(ctx)).toBe(true);
    });

    it('should return false when context is null', () => {
      expect(hasFormMethods(null)).toBe(false);
    });

    it('should return false when context is undefined', () => {
      expect(hasFormMethods(undefined)).toBe(false);
    });

    it('should return false when context is not an object', () => {
      expect(hasFormMethods('string')).toBe(false);
      expect(hasFormMethods(123)).toBe(false);
    });

    it('should return false when context is missing formValues', () => {
      const ctx = {
        setFieldValue: (_field: string, _value: unknown) => {},
      };

      expect(hasFormMethods(ctx)).toBe(false);
    });

    it('should return false when context is missing setFieldValue', () => {
      const ctx = {
        formValues: { field1: 'value1' },
      };

      expect(hasFormMethods(ctx)).toBe(false);
    });

    it('should return false when setFieldValue is not a function', () => {
      const ctx = {
        formValues: { field1: 'value1' },
        setFieldValue: 'not a function',
      };

      expect(hasFormMethods(ctx)).toBe(false);
    });
  });

  describe('hasCurrentUserPermissions', () => {
    it('should return true when context has currentUserAccessLevel', () => {
      const ctx = {
        currentUserAccessLevel: 'admin',
      };

      expect(hasCurrentUserPermissions(ctx)).toBe(true);
    });

    it('should return false when context is null', () => {
      expect(hasCurrentUserPermissions(null)).toBe(false);
    });

    it('should return false when context is undefined', () => {
      expect(hasCurrentUserPermissions(undefined)).toBe(false);
    });

    it('should return false when context is not an object', () => {
      expect(hasCurrentUserPermissions('string')).toBe(false);
    });

    it('should return false when context is missing currentUserAccessLevel', () => {
      const ctx = {
        somethingElse: 'value',
      };

      expect(hasCurrentUserPermissions(ctx)).toBe(false);
    });
  });

  // ============================================================================
  // Data Transformation
  // ============================================================================

  describe('getUploadUrl', () => {
    it('should return the base URL when no imgix params provided', () => {
      const upload = {
        attributes: {
          url: 'https://example.com/image.jpg',
        },
      };

      expect(getUploadUrl(upload)).toBe('https://example.com/image.jpg');
    });

    it('should return null when upload has no URL', () => {
      const upload = {
        attributes: {},
      };

      expect(getUploadUrl(upload)).toBe(null);
    });

    it('should return null when upload has no attributes', () => {
      const upload = {};

      expect(getUploadUrl(upload)).toBe(null);
    });

    it('should append imgix parameters to URL', () => {
      const upload = {
        attributes: {
          url: 'https://example.com/image.jpg',
        },
      };

      const result = getUploadUrl(upload, { w: 500, h: 300 });

      expect(result).toBe('https://example.com/image.jpg?w=500&h=300');
    });

    it('should handle boolean imgix parameters', () => {
      const upload = {
        attributes: {
          url: 'https://example.com/image.jpg',
        },
      };

      const result = getUploadUrl(upload, { auto: 'format', fit: 'crop', flip: true });

      expect(result).toContain('auto=format');
      expect(result).toContain('fit=crop');
      expect(result).toContain('flip=true');
    });

    it('should return base URL when imgix params is empty object', () => {
      const upload = {
        attributes: {
          url: 'https://example.com/image.jpg',
        },
      };

      expect(getUploadUrl(upload, {})).toBe('https://example.com/image.jpg');
    });
  });

  describe('extractTextFromStructuredText', () => {
    it('should return empty string when no document', () => {
      expect(extractTextFromStructuredText({})).toBe('');
    });

    it('should return JSON string of document', () => {
      const structuredText = {
        document: {
          type: 'root',
          children: [{ type: 'paragraph', children: [] }],
        },
      };

      const result = extractTextFromStructuredText(structuredText);
      expect(result).toContain('root');
      expect(result).toContain('paragraph');
    });
  });

  describe('isStructuredTextEmpty', () => {
    it('should return true when no document', () => {
      expect(isStructuredTextEmpty({})).toBe(true);
    });

    it('should return true when no children', () => {
      const structuredText = {
        document: {},
      };

      expect(isStructuredTextEmpty(structuredText)).toBe(true);
    });

    it('should return true when children array is empty', () => {
      const structuredText = {
        document: {
          children: [],
        },
      };

      expect(isStructuredTextEmpty(structuredText)).toBe(true);
    });

    it('should return false when children array has items', () => {
      const structuredText = {
        document: {
          children: [{ type: 'paragraph' }],
        },
      };

      expect(isStructuredTextEmpty(structuredText)).toBe(false);
    });
  });

  // ============================================================================
  // Complex Property Access
  // ============================================================================

  describe('isFieldRequired', () => {
    it('should return true when field has required validator', () => {
      const field = {
        attributes: {
          validators: {
            required: {},
          },
        },
      } as unknown as Field;

      expect(isFieldRequired(field)).toBe(true);
    });

    it('should return false when field has no validators', () => {
      const field = {
        attributes: {},
      } as Field;

      expect(isFieldRequired(field)).toBe(false);
    });

    it('should return false when validators exist but required is not present', () => {
      const field = {
        attributes: {
          validators: {
            unique: {},
          },
        },
      } as unknown as Field;

      expect(isFieldRequired(field)).toBe(false);
    });
  });

  describe('isUniqueField', () => {
    it('should return true when field has unique validator', () => {
      const field = {
        attributes: {
          validators: {
            unique: {},
          },
        },
      } as unknown as Field;

      expect(isUniqueField(field)).toBe(true);
    });

    it('should return false when field has no validators', () => {
      const field = {
        attributes: {},
      } as Field;

      expect(isUniqueField(field)).toBe(false);
    });

    it('should return false when validators exist but unique is not present', () => {
      const field = {
        attributes: {
          validators: {
            required: {},
          },
        },
      } as unknown as Field;

      expect(isUniqueField(field)).toBe(false);
    });
  });

  describe('hasFieldExtension', () => {
    it('should return true when field has the specified extension', () => {
      const field = {
        relationships: {
          field_extension: {
            data: {
              id: 'extension-123',
            },
          },
        },
      } as unknown as Field;

      expect(hasFieldExtension(field, 'extension-123')).toBe(true);
    });

    it('should return false when field has different extension', () => {
      const field = {
        relationships: {
          field_extension: {
            data: {
              id: 'extension-123',
            },
          },
        },
      } as unknown as Field;

      expect(hasFieldExtension(field, 'extension-456')).toBe(false);
    });

    it('should return false when field has no relationships', () => {
      const field = {} as Field;

      expect(hasFieldExtension(field, 'extension-123')).toBe(false);
    });

    it('should return false when relationships has no field_extension', () => {
      const field = {
        relationships: {},
      } as unknown as Field;

      expect(hasFieldExtension(field, 'extension-123')).toBe(false);
    });
  });

  describe('getFieldExtensionId', () => {
    it('should return extension id when present', () => {
      const field = {
        relationships: {
          field_extension: {
            data: {
              id: 'extension-123',
            },
          },
        },
      } as unknown as Field;

      expect(getFieldExtensionId(field)).toBe('extension-123');
    });

    it('should return null when field has no relationships', () => {
      const field = {} as Field;

      expect(getFieldExtensionId(field)).toBe(null);
    });

    it('should return null when relationships has no field_extension', () => {
      const field = {
        relationships: {},
      } as unknown as Field;

      expect(getFieldExtensionId(field)).toBe(null);
    });
  });

  // ============================================================================
  // Filtering/Searching
  // ============================================================================

  describe('getFieldItemType', () => {
    it('should return the ItemType that a field belongs to', () => {
      const itemType = {
        id: 'item-type-1',
        attributes: {
          api_key: 'blog_post',
        },
      } as Partial<ItemType> as ItemType;

      const field = {
        relationships: {
          item_type: {
            data: {
              id: 'item-type-1',
            },
          },
        },
      } as unknown as Field;

      const ctx = {
        itemTypes: {
          'item-type-1': itemType,
        },
      } as CtxWithItemTypes;

      expect(getFieldItemType(field, ctx)).toBe(itemType);
    });

    it('should return null when field has no item_type relationship', () => {
      const field = {
        relationships: {},
      } as unknown as Field;

      const ctx = {
        itemTypes: {},
      } as CtxWithItemTypes;

      expect(getFieldItemType(field, ctx)).toBe(null);
    });

    it('should return null when ItemType not found in context', () => {
      const field = {
        relationships: {
          item_type: {
            data: {
              id: 'item-type-1',
            },
          },
        },
      } as unknown as Field;

      const ctx = {
        itemTypes: {},
      } as CtxWithItemTypes;

      expect(getFieldItemType(field, ctx)).toBe(null);
    });
  });

  describe('getItemTypeByApiKey', () => {
    it('should return ItemType with matching api_key', () => {
      const itemType1 = {
        id: '1',
        attributes: { api_key: 'blog_post' },
      } as Partial<ItemType> as ItemType;

      const itemType2 = {
        id: '2',
        attributes: { api_key: 'author' },
      } as Partial<ItemType> as ItemType;

      const ctx = {
        itemTypes: {
          '1': itemType1,
          '2': itemType2,
        },
      } as CtxWithItemTypes;

      expect(getItemTypeByApiKey('blog_post', ctx)).toBe(itemType1);
      expect(getItemTypeByApiKey('author', ctx)).toBe(itemType2);
    });

    it('should return undefined when no matching ItemType', () => {
      const ctx = {
        itemTypes: {},
      } as CtxWithItemTypes;

      expect(getItemTypeByApiKey('non_existent', ctx)).toBeUndefined();
    });
  });

  describe('fieldBelongsToItemType', () => {
    it('should return true when field belongs to ItemType with api_key', () => {
      const itemType = {
        id: 'item-type-1',
        attributes: {
          api_key: 'blog_post',
        },
      } as Partial<ItemType> as ItemType;

      const field = {
        relationships: {
          item_type: {
            data: {
              id: 'item-type-1',
            },
          },
        },
      } as unknown as Field;

      const ctx = {
        itemTypes: {
          'item-type-1': itemType,
        },
      } as CtxWithItemTypes;

      expect(fieldBelongsToItemType(field, 'blog_post', ctx)).toBe(true);
    });

    it('should return false when field belongs to different ItemType', () => {
      const itemType = {
        id: 'item-type-1',
        attributes: {
          api_key: 'blog_post',
        },
      } as Partial<ItemType> as ItemType;

      const field = {
        relationships: {
          item_type: {
            data: {
              id: 'item-type-1',
            },
          },
        },
      } as unknown as Field;

      const ctx = {
        itemTypes: {
          'item-type-1': itemType,
        },
      } as CtxWithItemTypes;

      expect(fieldBelongsToItemType(field, 'author', ctx)).toBe(false);
    });
  });

  describe('getFieldsByItemType', () => {
    it('should return all fields belonging to ItemType', () => {
      const itemType = {
        id: 'item-type-1',
        attributes: {
          api_key: 'blog_post',
        },
      } as Partial<ItemType> as ItemType;

      const field1 = {
        id: 'field-1',
        attributes: { api_key: 'title' },
        relationships: {
          item_type: {
            data: { id: 'item-type-1' },
          },
        },
      } as unknown as Field;

      const field2 = {
        id: 'field-2',
        attributes: { api_key: 'content' },
        relationships: {
          item_type: {
            data: { id: 'item-type-1' },
          },
        },
      } as unknown as Field;

      const field3 = {
        id: 'field-3',
        attributes: { api_key: 'name' },
        relationships: {
          item_type: {
            data: { id: 'item-type-2' },
          },
        },
      } as unknown as Field;

      const ctx = {
        itemTypes: {
          'item-type-1': itemType,
        },
        fields: {
          'field-1': field1,
          'field-2': field2,
          'field-3': field3,
        },
      } as CtxWithItemTypes;

      const result = getFieldsByItemType('blog_post', ctx);

      expect(result).toHaveLength(2);
      expect(result).toContain(field1);
      expect(result).toContain(field2);
      expect(result).not.toContain(field3);
    });

    it('should return empty array when no matching fields', () => {
      const ctx = {
        itemTypes: {},
        fields: {},
      } as CtxWithItemTypes;

      expect(getFieldsByItemType('blog_post', ctx)).toEqual([]);
    });
  });

  describe('getAllFieldsOfType', () => {
    it('should return all fields of specified type', () => {
      const field1 = {
        id: 'field-1',
        attributes: { field_type: 'string' },
      } as Partial<Field> as Field;

      const field2 = {
        id: 'field-2',
        attributes: { field_type: 'string' },
      } as Partial<Field> as Field;

      const field3 = {
        id: 'field-3',
        attributes: { field_type: 'text' },
      } as Partial<Field> as Field;

      const ctx = {
        fields: {
          'field-1': field1,
          'field-2': field2,
          'field-3': field3,
        },
      } as Ctx;

      const result = getAllFieldsOfType('string', ctx);

      expect(result).toHaveLength(2);
      expect(result).toContain(field1);
      expect(result).toContain(field2);
      expect(result).not.toContain(field3);
    });

    it('should return empty array when no matching fields', () => {
      const ctx = {
        fields: {},
      } as Ctx;

      expect(getAllFieldsOfType('string', ctx)).toEqual([]);
    });
  });

  describe('contextHasAllFields', () => {
    it('should return true when context has all specified fields', () => {
      const ctx = {
        fields: {
          'field-1': { attributes: { api_key: 'title' } },
          'field-2': { attributes: { api_key: 'content' } },
          'field-3': { attributes: { api_key: 'author' } },
        },
      } as Ctx;

      expect(contextHasAllFields(ctx, ['title', 'content'])).toBe(true);
      expect(contextHasAllFields(ctx, ['title', 'content', 'author'])).toBe(true);
    });

    it('should return false when context is missing some fields', () => {
      const ctx = {
        fields: {
          'field-1': { attributes: { api_key: 'title' } },
          'field-2': { attributes: { api_key: 'content' } },
        },
      } as Ctx;

      expect(contextHasAllFields(ctx, ['title', 'author'])).toBe(false);
    });

    it('should return true when checking empty array', () => {
      const ctx = {
        fields: {},
      } as Ctx;

      expect(contextHasAllFields(ctx, [])).toBe(true);
    });
  });
});
