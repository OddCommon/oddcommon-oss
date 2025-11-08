import { describe, expect, it, vi } from 'vitest';

import { validateUniqueId } from './validation';

describe('Validation utilities', () => {
  describe('validateUniqueId', () => {
    it('should not throw for unique ID', () => {
      expect(() => {
        validateUniqueId('new-id', ['existing-1', 'existing-2'], 'outlet');
      }).not.toThrow();
    });

    it('should throw for duplicate ID when mode is throw', () => {
      expect(() => {
        validateUniqueId('existing-1', ['existing-1', 'existing-2'], 'outlet', 'throw');
      }).toThrow();
    });

    it('should warn by default for duplicate ID', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      validateUniqueId('existing-1', ['existing-1', 'existing-2'], 'outlet');

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should ignore duplicate ID when mode is ignore', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      validateUniqueId('existing-1', ['existing-1', 'existing-2'], 'outlet', 'ignore');

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});
