import type {
  CustomBlockStylesForStructuredTextFieldCtx,
  CustomMarksForStructuredTextFieldCtx,
  Field,
  FullConnectParameters,
  StructuredTextCustomBlockStyle,
  StructuredTextCustomMark,
} from 'datocms-plugin-sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPluginConfig } from '../factory';

// Mock to capture the config passed to connect
let capturedConfig: Partial<FullConnectParameters> | null = null;

vi.mock('datocms-plugin-sdk', () => ({
  connect: vi.fn((config) => {
    capturedConfig = config;
    return Promise.resolve();
  }),
}));

// Helper mock render function for tests
const mockRender = vi.fn();

describe('Structured Text Customizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedConfig = null;
  });

  describe('customBlockStylesForStructuredTextField', () => {
    it('should register a custom block styles handler', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const mockField = { attributes: { api_key: 'content' } } as Field;
      const mockCtx = {} as CustomBlockStylesForStructuredTextFieldCtx;

      const blockStyles: StructuredTextCustomBlockStyle[] = [
        {
          id: 'emphasized',
          node: 'paragraph',
          label: 'Emphasized',
          appliedStyle: {
            fontFamily: 'Georgia',
            fontStyle: 'italic',
            fontSize: '1.4em',
            lineHeight: '1.2',
          },
        },
      ];

      plugin.customBlockStylesForStructuredTextField((field, _ctx) => {
        if (field.attributes.api_key === 'content') {
          return blockStyles;
        }
        return [];
      });

      plugin.connect();

      const result = capturedConfig!.customBlockStylesForStructuredTextField!(mockField, mockCtx);
      expect(result).toEqual(blockStyles);
    });

    it('should warn when handler is registered twice', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const handler1 = () => [];
      const handler2 = () => [];

      plugin.customBlockStylesForStructuredTextField(handler1);
      plugin.customBlockStylesForStructuredTextField(handler2);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[datocms-plugin-kit] customBlockStylesForStructuredTextField is already registered. Replacing existing handler.',
      );

      consoleWarnSpy.mockRestore();
    });

    it('should replace the first handler with the second', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const mockField = { attributes: { api_key: 'content' } } as Field;
      const mockCtx = {} as CustomBlockStylesForStructuredTextFieldCtx;

      const firstStyles: StructuredTextCustomBlockStyle[] = [
        {
          id: 'first',
          node: 'paragraph',
          label: 'First',
          appliedStyle: {},
        },
      ];

      const secondStyles: StructuredTextCustomBlockStyle[] = [
        {
          id: 'second',
          node: 'heading',
          label: 'Second',
          appliedStyle: {},
        },
      ];

      plugin.customBlockStylesForStructuredTextField(() => firstStyles);
      plugin.customBlockStylesForStructuredTextField(() => secondStyles);

      plugin.connect();

      const result = capturedConfig!.customBlockStylesForStructuredTextField!(mockField, mockCtx);
      expect(result).toEqual(secondStyles);
    });
  });

  describe('customMarksForStructuredTextField', () => {
    it('should register a custom marks handler', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const mockField = { attributes: { api_key: 'content' } } as Field;
      const mockCtx = {} as CustomMarksForStructuredTextFieldCtx;

      const customMarks: StructuredTextCustomMark[] = [
        {
          id: 'spoiler',
          label: 'Spoiler',
          icon: 'bomb',
          keyboardShortcut: 'mod+shift+l',
          appliedStyle: {
            backgroundColor: 'rgba(255, 0, 0, 0.3)',
          },
        },
      ];

      plugin.customMarksForStructuredTextField((field, _ctx) => {
        if (field.attributes.api_key === 'content') {
          return customMarks;
        }
        return [];
      });

      plugin.connect();

      const result = capturedConfig!.customMarksForStructuredTextField!(mockField, mockCtx);
      expect(result).toEqual(customMarks);
    });

    it('should warn when handler is registered twice', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const handler1 = () => [];
      const handler2 = () => [];

      plugin.customMarksForStructuredTextField(handler1);
      plugin.customMarksForStructuredTextField(handler2);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[datocms-plugin-kit] customMarksForStructuredTextField is already registered. Replacing existing handler.',
      );

      consoleWarnSpy.mockRestore();
    });

    it('should replace the first handler with the second', () => {
      const plugin = createPluginConfig({ render: mockRender });
      const mockField = { attributes: { api_key: 'content' } } as Field;
      const mockCtx = {} as CustomMarksForStructuredTextFieldCtx;

      const firstMarks: StructuredTextCustomMark[] = [
        {
          id: 'first',
          label: 'First',
          icon: 'star',
          appliedStyle: {},
        },
      ];

      const secondMarks: StructuredTextCustomMark[] = [
        {
          id: 'second',
          label: 'Second',
          icon: 'heart',
          appliedStyle: {},
        },
      ];

      plugin.customMarksForStructuredTextField(() => firstMarks);
      plugin.customMarksForStructuredTextField(() => secondMarks);

      plugin.connect();

      const result = capturedConfig!.customMarksForStructuredTextField!(mockField, mockCtx);
      expect(result).toEqual(secondMarks);
    });
  });
});
