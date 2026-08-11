import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhysicalButton } from './PhysicalButton.tsx';

const meta = {
  title: 'Primitives/PhysicalButton',
  component: PhysicalButton,
  args: { children: 'Make signal', depth: 4, tone: 'action' },
  parameters: {
    docs: {
      description: {
        component: 'Native button with a coupled hard-shadow/translation model. previewState is for deterministic isolation evidence only.',
      },
    },
  },
} satisfies Meta<typeof PhysicalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rest: Story = {};
export const Hover: Story = { args: { previewState: 'hover' } };
export const Focus: Story = { args: { previewState: 'focus' } };
export const Pressed: Story = { args: { previewState: 'pressed' } };
export const Selected: Story = { args: { selected: true, tone: 'identity' } };
export const Disabled: Story = { args: { disabled: true } };
export const DeepOffset: Story = { args: { depth: 8, tone: 'attention' } };
