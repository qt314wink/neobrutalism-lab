import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignalBadge } from './SignalBadge.tsx';

const meta = {
  title: 'Primitives/SignalBadge',
  component: SignalBadge,
  args: { children: 'Live system', tone: 'info' },
} satisfies Meta<typeof SignalBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Information: Story = {};
export const Action: Story = { args: { children: 'Ready', tone: 'action' } };
export const Attention: Story = { args: { children: 'Observe', tone: 'attention' } };
export const Critical: Story = { args: { children: 'Blocked', tone: 'critical' } };
