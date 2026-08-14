import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricSlab } from './MetricSlab';

const meta = {
  title: 'Patterns/MetricSlab',
  component: MetricSlab,
  args: { label: 'Systems', value: '08', detail: 'active modules', tone: 'info' },
} satisfies Meta<typeof MetricSlab>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Identity: Story = { args: { label: 'States', value: '06', detail: 'governed modes', tone: 'identity' } };
export const DenseValue: Story = { args: { label: 'Evidence', value: '128', detail: 'linked observations', tone: 'paper' } };
