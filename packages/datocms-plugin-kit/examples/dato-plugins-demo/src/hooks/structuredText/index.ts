import {
  customBlockStylesForStructuredTextField,
  customMarksForStructuredTextField,
} from '~/plugin';

// Register custom block styles for structured text fields
customBlockStylesForStructuredTextField((_field, _ctx) => {
  // Apply to all structured text fields, but you can filter by field API key
  // Example: if (field.attributes.api_key !== 'article_content') return [];

  return [
    {
      id: 'emphasized',
      node: 'paragraph',
      label: 'Emphasized',
      appliedStyle: {
        fontFamily: 'Georgia',
        fontStyle: 'italic',
        fontSize: '1.4em',
        lineHeight: '1.2',
        color: '#2c3e50',
      },
    },
    {
      id: 'callout',
      node: 'paragraph',
      label: 'Callout',
      appliedStyle: {
        backgroundColor: '#f0f7ff',
        borderLeft: '4px solid #0066cc',
        padding: '1em',
        margin: '1em 0',
      },
    },
    {
      id: 'warning',
      node: 'paragraph',
      label: 'Warning',
      appliedStyle: {
        backgroundColor: '#fff3cd',
        borderLeft: '4px solid #ffc107',
        padding: '1em',
        margin: '1em 0',
      },
    },
    {
      id: 'special-heading',
      node: 'heading',
      label: 'Special Heading',
      appliedStyle: {
        backgroundColor: '#f5f5f5',
        padding: '0.5em 1em',
        borderRadius: '4px',
        color: '#333',
      },
    },
  ];
});

// Register custom marks for structured text fields
customMarksForStructuredTextField((_field, _ctx) => {
  return [
    {
      id: 'spoiler',
      label: 'Spoiler',
      icon: 'bomb',
      keyboardShortcut: 'mod+shift+s',
      appliedStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'rgba(0, 0, 0, 0.8)',
        cursor: 'help',
      },
    },
    {
      id: 'keyboard',
      label: 'Keyboard',
      icon: 'keyboard',
      keyboardShortcut: 'mod+shift+k',
      appliedStyle: {
        fontFamily: 'monospace',
        backgroundColor: '#f4f4f4',
        padding: '0.2em 0.4em',
        borderRadius: '3px',
        border: '1px solid #ccc',
        fontSize: '0.9em',
      },
    },
    {
      id: 'highlight-yellow',
      label: 'Highlight (Yellow)',
      icon: 'marker',
      keyboardShortcut: 'mod+shift+h',
      appliedStyle: {
        backgroundColor: '#ffeb3b',
        padding: '0.1em 0.2em',
      },
    },
    {
      id: 'small-caps',
      label: 'Small Caps',
      icon: 'text-height',
      appliedStyle: {
        fontVariant: 'small-caps',
        letterSpacing: '0.05em',
      },
    },
  ];
});
