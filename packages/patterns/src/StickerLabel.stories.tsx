import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickerLabel } from './StickerLabel';

const meta = {
  title: 'Patterns/StickerLabel',
  component: StickerLabel,
  args: { children: 'New rule', tone: 'attention', rotation: -1 },
} satisfies Meta<typeof StickerLabel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Information: Story = { args: { tone: 'info', rotation: 1 } };
export const Identity: Story = { args: { tone: 'identity', rotation: 0 } };
