import type { HTMLAttributes } from 'react';
import type { SemanticColorRole } from '@neobrutalism-lab/tokens';

export interface StickerLabelProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: SemanticColorRole;
  rotation?: -2 | -1 | 0 | 1 | 2;
}

export function StickerLabel({
  tone = 'attention',
  rotation = -1,
  className = '',
  ...props
}: StickerLabelProps) {
  return (
    <span
      {...props}
      data-nb-pattern="sticker-label"
      data-nb-tone={tone}
      data-nb-rotation={rotation}
      className={`nb-sticker-label ${className}`.trim()}
    />
  );
}
