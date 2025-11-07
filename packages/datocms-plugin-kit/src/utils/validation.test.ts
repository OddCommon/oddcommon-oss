import { describe, expect, it } from 'vitest';
import { validateRequired, validateUniqueId } from './validation';

describe('Validation utilities', () => {
  describe('validateUniqueId', () => {
    it('should not throw for unique ID', () => {
      expect(() => {
        validateUniqueId('new-id', ['existing-1', 'existing-2'], 'outlet');
      }).not.toThrow();
    });

    it('should throw for duplicate ID', () => {
      expect(() => {
        validateUniqueId('existing-1', ['existing-1', 'existing-2'], 'outlet');
      }).toThrow('outlet with id "existing-1" is already registered');
    });
  });

  describe('validateRequired', () => {
    it('should not throw when all required fields present', () => {
      expect(() => {
        validateRequired({ id: 'test', name: 'Test' }, ['id', 'name'], 'config');
      }).not.toThrow();
    });

    it('should throw when required field missing', () => {
      expect(() => {
        validateRequired({ id: 'test' }, ['id', 'name'], 'config');
      }).toThrow('config requires field "name"');
    });
  });
});
