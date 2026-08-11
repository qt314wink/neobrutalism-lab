import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '@neobrutalism-lab/primitives';
import { EditorialHero } from './EditorialHero';

const meta = {
  title: 'Compositions/EditorialHero',
  component: EditorialHero,
  args: {
    eyebrow: 'Neobrutalism Lab',
    title: 'Mechanisms before pages',
    summary: 'Compose only after isolates prove themselves.',
    primaryAction: { label: 'Inspect system', onClick: () => undefined },
    metrics: [
      { id: 'systems', label: 'Systems', value: '08', detail: 'active modules', tone: 'info' },
      { id: 'states', label: 'States', value: '06', detail: 'governed modes', tone: 'identity' },
    ],
  },
} satisfies Meta<typeof EditorialHero>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithMediaSlot: Story = {
  args: { mediaSlot: <Surface tone="identity">Media or interactive field slot</Surface> },
};
export const CopyOnly: Story = { args: { metrics: [], primaryAction: undefined } };
