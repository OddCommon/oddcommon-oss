export function validateUniqueId(
  id: string,
  existingIds: string[],
  type: string
): void {
  if (existingIds.includes(id)) {
    throw new Error(`${type} with id "${id}" is already registered`);
  }
}

export function validateRequired(
  obj: Record<string, unknown>,
  requiredFields: string[],
  type: string
): void {
  for (const field of requiredFields) {
    if (!(field in obj) || obj[field] === undefined) {
      throw new Error(`${type} requires field "${field}"`);
    }
  }
}
