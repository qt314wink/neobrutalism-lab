import '../packages/primitives/src/styles.css';
import '../packages/patterns/src/styles.css';
import '../packages/assemblies/src/styles.css';
import '../packages/compositions/src/styles.css';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
