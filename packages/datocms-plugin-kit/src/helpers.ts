import type { Ctx, Field, ItemType } from 'datocms-plugin-sdk';

type CtxWithItemTypes = Ctx<{
  itemTypes: Partial<Record<string, ItemType>>;
}>;

// ============================================================================
// ItemType/Model Helpers
// ============================================================================

/**
 * Gets the ItemType (model) that a field belongs to
 */
export const getFieldItemType = (field: Field, ctx: CtxWithItemTypes): ItemType | null => {
  const parentId = field.relationships?.item_type?.data?.id;
  return parentId ? (ctx.itemTypes[parentId] ?? null) : null;
};

/**
 * Gets an ItemType by its API key
 */
export const getItemTypeByApiKey = (
  apiKey: string,
  ctx: CtxWithItemTypes,
): ItemType | undefined => {
  return Object.values(ctx.itemTypes).find((type) => type?.attributes.api_key === apiKey);
};

/**
 * Checks if an ItemType is a singleton model
 */
export const isSingletonModel = (itemType: ItemType): boolean => {
  return itemType.attributes.singleton === true;
};

/**
 * Checks if an ItemType is a collection model
 */
export const isCollectionModel = (itemType: ItemType): boolean => {
  return !isSingletonModel(itemType);
};

// ============================================================================
// Field Relationship Helpers
// ============================================================================

/**
 * Checks if a field belongs to an ItemType with the given API key
 */
export const fieldBelongsToItemType = (
  field: Field,
  itemTypeApiKey: string,
  ctx: CtxWithItemTypes,
): boolean => {
  const itemType = getFieldItemType(field, ctx);
  const apiKey: string | undefined | null = itemType?.attributes.api_key;
  return typeof apiKey === 'string' && apiKey === itemTypeApiKey;
};

/**
 * Gets all fields that belong to an ItemType with the given API key
 */
export const getFieldsByItemType = (itemTypeApiKey: string, ctx: CtxWithItemTypes): Field[] => {
  return Object.values(ctx.fields).filter(
    (field): field is Field =>
      field !== null && field !== undefined && fieldBelongsToItemType(field, itemTypeApiKey, ctx),
  );
};

/**
 * Gets all fields of a specific field type
 */
export const getAllFieldsOfType = (fieldType: string, ctx: Ctx): Field[] => {
  return Object.values(ctx.fields).filter(
    (field): field is Field =>
      field !== null && field !== undefined && field.attributes.field_type === fieldType,
  );
};

// ============================================================================
// Context Helpers
// ============================================================================

/**
 * Checks if the context has all the specified fields by API key
 */
export const contextHasAllFields = (ctx: Ctx, fieldsApiKeys: string[]): boolean => {
  const allFields: string[] = Object.entries(ctx.fields)
    .map(([_, shell]) => shell?.attributes?.api_key)
    .filter((apiKey): apiKey is string => typeof apiKey === 'string');
  return fieldsApiKeys.every((apiKey) => allFields.includes(apiKey));
};

// ============================================================================
// Field Type Checks
// ============================================================================

/**
 * Checks if a field is of a specific field type
 */
export const isFieldType = (field: Field, fieldType: string): boolean => {
  return field.attributes.field_type === fieldType;
};

/**
 * Checks if a field is a string field
 */
export const isStringField = (field: Field): boolean => {
  return isFieldType(field, 'string');
};

/**
 * Checks if a field is a text field
 */
export const isTextField = (field: Field): boolean => {
  return isFieldType(field, 'text');
};

/**
 * Checks if a field is a JSON field
 */
export const isJsonField = (field: Field): boolean => {
  return isFieldType(field, 'json');
};

/**
 * Checks if a field is a structured text field
 */
export const isStructuredTextField = (field: Field): boolean => {
  return isFieldType(field, 'structured_text');
};

/**
 * Checks if a field is a link field (single or multiple)
 */
export const isLinkField = (field: Field): boolean => {
  return ['link', 'links'].includes(field.attributes.field_type);
};

/**
 * Checks if a field is a file field (single or gallery)
 */
export const isFileField = (field: Field): boolean => {
  return ['file', 'gallery'].includes(field.attributes.field_type);
};

/**
 * Checks if a field is a boolean field
 */
export const isBooleanField = (field: Field): boolean => {
  return isFieldType(field, 'boolean');
};

/**
 * Checks if a field is a date field
 */
export const isDateField = (field: Field): boolean => {
  return isFieldType(field, 'date');
};

/**
 * Checks if a field is a datetime field
 */
export const isDateTimeField = (field: Field): boolean => {
  return isFieldType(field, 'date_time');
};

/**
 * Checks if a field is an integer field
 */
export const isIntegerField = (field: Field): boolean => {
  return isFieldType(field, 'integer');
};

/**
 * Checks if a field is a float field
 */
export const isFloatField = (field: Field): boolean => {
  return isFieldType(field, 'float');
};

/**
 * Checks if a field is a color field
 */
export const isColorField = (field: Field): boolean => {
  return isFieldType(field, 'color');
};

/**
 * Checks if a field is a lat/lon field
 */
export const isLatLonField = (field: Field): boolean => {
  return isFieldType(field, 'lat_lon');
};

/**
 * Checks if a field is a SEO field
 */
export const isSeoField = (field: Field): boolean => {
  return isFieldType(field, 'seo');
};

/**
 * Checks if a field is a slug field
 */
export const isSlugField = (field: Field): boolean => {
  return isFieldType(field, 'slug');
};

/**
 * Checks if a field is a video field
 */
export const isVideoField = (field: Field): boolean => {
  return isFieldType(field, 'video');
};

// ============================================================================
// Field Property Checks
// ============================================================================

/**
 * Checks if a field is required
 */
export const isFieldRequired = (field: Field): boolean => {
  const validators = field.attributes.validators as Record<string, unknown> | undefined;
  return validators !== undefined && 'required' in validators && validators.required !== undefined;
};

/**
 * Checks if a field is localized
 */
export const isLocalizedField = (field: Field): boolean => {
  return field.attributes.localized === true;
};

/**
 * Checks if a field has a unique validator
 */
export const isUniqueField = (field: Field): boolean => {
  const validators = field.attributes.validators as Record<string, unknown> | undefined;
  return validators !== undefined && 'unique' in validators && validators.unique !== undefined;
};

/**
 * Gets all validators for a field
 */
export const getFieldValidators = (field: Field): Record<string, unknown> => {
  return (field.attributes.validators as Record<string, unknown>) || {};
};

// ============================================================================
// Field Extension Helpers
// ============================================================================

/**
 * Checks if a field has a specific field extension
 */
export const hasFieldExtension = (field: Field, extensionId: string): boolean => {
  const relationships = field.relationships as Record<string, unknown> | undefined;
  if (!relationships || !('field_extension' in relationships)) return false;
  const fieldExtension = relationships.field_extension as { data?: { id?: string } } | undefined;
  return fieldExtension?.data?.id === extensionId;
};

/**
 * Gets the field extension ID for a field
 */
export const getFieldExtensionId = (field: Field): string | null => {
  const relationships = field.relationships as Record<string, unknown> | undefined;
  if (!relationships || !('field_extension' in relationships)) return null;
  const fieldExtension = relationships.field_extension as { data?: { id?: string } } | undefined;
  return fieldExtension?.data?.id || null;
};

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validates if a string is a valid DatoCMS API key
 */
export const isValidApiKey = (apiKey: string): boolean => {
  return /^[a-z][a-z0-9_]*$/.test(apiKey);
};

// ============================================================================
// Context Type Guards
// ============================================================================

/**
 * Type guard to check if context has form methods
 */
export const hasFormMethods = (
  ctx: unknown,
): ctx is Ctx & { formValues: unknown; setFieldValue: (field: string, value: unknown) => void } => {
  return (
    typeof ctx === 'object' &&
    ctx !== null &&
    'formValues' in ctx &&
    'setFieldValue' in ctx &&
    typeof (ctx as Record<string, unknown>).setFieldValue === 'function'
  );
};

/**
 * Type guard to check if context has current user permissions
 */
export const hasCurrentUserPermissions = (
  ctx: unknown,
): ctx is Ctx & { currentUserAccessLevel: string } => {
  return typeof ctx === 'object' && ctx !== null && 'currentUserAccessLevel' in ctx;
};

// ============================================================================
// Structured Text Helpers
// ============================================================================

interface StructuredTextDocument {
  document?: {
    children?: unknown[];
  };
}

/**
 * Extracts plain text from structured text (simple implementation)
 */
export const extractTextFromStructuredText = (structuredText: StructuredTextDocument): string => {
  if (!structuredText?.document) return '';
  return JSON.stringify(structuredText.document);
};

/**
 * Checks if structured text is empty
 */
export const isStructuredTextEmpty = (structuredText: StructuredTextDocument): boolean => {
  if (!structuredText?.document?.children) return true;
  return structuredText.document.children.length === 0;
};

// ============================================================================
// Asset/Upload Helpers
// ============================================================================

interface Upload {
  attributes?: {
    url?: string;
  };
}

/**
 * Gets the URL for an upload with optional imgix parameters
 */
export const getUploadUrl = (
  upload: Upload,
  imgixParams?: Record<string, string | number | boolean>,
): string | null => {
  const baseUrl = upload?.attributes?.url;
  if (!baseUrl) return null;

  if (imgixParams && Object.keys(imgixParams).length > 0) {
    const params = new URLSearchParams(
      Object.entries(imgixParams).map(([key, value]) => [key, String(value)]),
    );
    return `${baseUrl}?${params.toString()}`;
  }

  return baseUrl;
};

// ============================================================================
// Conditional Helper Builders
// ============================================================================

/**
 * Creates a shouldApply function that matches specific ItemType API keys
 */
export const shouldApplyToItemTypes =
  (...apiKeys: string[]) =>
  (itemType: ItemType): boolean => {
    return apiKeys.includes(itemType.attributes.api_key);
  };

/**
 * Creates a shouldApply function that matches specific field types
 */
export const shouldApplyToFieldTypes =
  (...fieldTypes: string[]) =>
  (field: Field): boolean => {
    return fieldTypes.includes(field.attributes.field_type);
  };
