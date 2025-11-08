export function validateUniqueId(
  id: string,
  existingIds: string[],
  type: string,
  mode: 'throw' | 'warn' | 'ignore' = 'warn',
): boolean {
  if (existingIds.includes(id)) {
    const message = `${type} with id "${id}" is already registered`;

    switch (mode) {
      case 'throw':
        throw new Error(message);
      case 'warn':
        console.warn(`[datocms-plugin-kit] ${message}`);
        return false;
      case 'ignore':
        return false;
    }
  }

  return true;
}
