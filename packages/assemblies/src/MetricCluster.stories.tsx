import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCluster } from './MetricCluster';

const meta = {
  title: 'Assemblies/MetricCluster',
  component: MetricCluster,
  args: {
    title: 'System evidence',
    metrics: [
      { id: 'systems', label: 'Systems', value: '08', detail: 'active modules', tone: 'info' },
      { id: 'states', label: 'States', value: '06', detail: 'governed modes', tone: 'identity' },
      { id: 'checks', label: 'Checks', value: '12', detail: 'passing gates', tone: 'action' },
    ],
  },
} satisfies Meta<typeof MetricCluster>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const SingleMetric: Story = { args: { metrics: [{ id: 'one', label: 'Evidence', value: '01', detail: 'bounded signal', tone: 'paper' }] } };
