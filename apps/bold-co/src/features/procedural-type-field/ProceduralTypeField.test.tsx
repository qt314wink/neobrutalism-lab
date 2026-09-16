import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProceduralTypeField } from './ProceduralTypeField';
describe('ProceduralTypeField',()=>{
 it('keeps semantic typography when WebGL is unavailable',()=>{const {container}=render(<ProceduralTypeField/>);expect(screen.getByRole('heading',{name:/type has a pulse/i})).toBeVisible();expect(container.querySelector('canvas')).toHaveAttribute('data-webgl','fallback')});
 it('exposes observable pointer and settling modes',()=>{render(<ProceduralTypeField/>);const field=screen.getByRole('region',{name:/type has a pulse/i});fireEvent.pointerMove(field,{clientX:20,clientY:20,pointerType:'mouse'});expect(field).toHaveAttribute('data-mode','POINTER_ACTIVE');fireEvent.pointerLeave(field);expect(field.getAttribute('data-mode')).toMatch(/SETTLING|REST/)});
});
