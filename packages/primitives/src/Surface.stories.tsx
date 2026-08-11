import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface.tsx';

const meta = {
  title: 'Primitives/Surface',
  component: Surface,
  args: { children: 'Independent content surface', tone: 'paper', depth: 4 },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paper: Story = {};
export const Information: Story = { args: { tone: 'info' } };
export const StrongDepth: Story = { args: { tone: 'identity', depth: 8 } };
export const Flat: Story = { args: { outlined: false } };
