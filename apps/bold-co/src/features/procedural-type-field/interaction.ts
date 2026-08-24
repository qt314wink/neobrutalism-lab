export type InteractionMode = 'REST' | 'POINTER_ACTIVE' | 'SCROLL_ACTIVE' | 'TOUCH_ACTIVE' | 'SETTLING' | 'REDUCED_MOTION';
export type Point = { x: number; y: number };
export interface InteractionState { mode: InteractionMode; pointer: Point; velocity: Point; scrollProgress: number; scrollVelocity: number; energy: number; influenceRadius: number; aspect: number; quality: 'low'|'high'; reducedMotion: boolean; source: 'none'|'pointer'|'scroll'|'touch'; time: number }
export type InteractionEvent = {type:'POINTER';point:Point;velocity:Point}|{type:'TOUCH';point:Point;velocity:Point}|{type:'SCROLL';progress:number;velocity:number}|{type:'RELEASE'}|{type:'TICK';delta:number;time:number}|{type:'RESIZE';aspect:number}|{type:'REDUCED_MOTION';enabled:boolean};
export const clamp=(value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));
export function normalizePointer(clientX:number,clientY:number,bounds:Pick<DOMRect,'left'|'top'|'width'|'height'>):Point{return{x:clamp((clientX-bounds.left)/Math.max(1,bounds.width)),y:clamp(1-(clientY-bounds.top)/Math.max(1,bounds.height))}}
export function normalizeScroll(heroTop:number,heroHeight:number,viewportHeight:number){return clamp((viewportHeight-heroTop)/Math.max(1,heroHeight+viewportHeight))}
export function calculateVelocity(current:Point,previous:Point,deltaMs:number):Point{const scale=16.667/Math.max(1,deltaMs);return{x:clamp((current.x-previous.x)*scale,-1,1),y:clamp((current.y-previous.y)*scale,-1,1)}}
export function calculateInfluence(point:Point,target:Point,radius:number){const distance=Math.hypot(point.x-target.x,point.y-target.y),t=clamp(1-distance/Math.max(.01,radius));return t*t*(3-2*t)}
export const initialInteractionState=(reducedMotion=false):InteractionState=>({mode:reducedMotion?'REDUCED_MOTION':'REST',pointer:{x:.5,y:.5},velocity:{x:0,y:0},scrollProgress:0,scrollVelocity:0,energy:0,influenceRadius:.38,aspect:1,quality:'high',reducedMotion,source:'none',time:0});
export function reduceInteractionState(state:InteractionState,event:InteractionEvent):InteractionState{
 if(event.type==='REDUCED_MOTION')return{...state,reducedMotion:event.enabled,mode:event.enabled?'REDUCED_MOTION':'REST',energy:0,source:'none'};
 if(event.type==='RESIZE')return{...state,aspect:clamp(event.aspect,.4,3)};
 if(state.reducedMotion)return event.type==='TICK'?{...state,time:event.time}:state;
 if(event.type==='POINTER'||event.type==='TOUCH'){const speed=Math.hypot(event.velocity.x,event.velocity.y);return{...state,mode:event.type==='TOUCH'?'TOUCH_ACTIVE':'POINTER_ACTIVE',source:event.type==='TOUCH'?'touch':'pointer',pointer:event.point,velocity:event.velocity,energy:clamp(.25+speed*1.5)}}
 if(event.type==='SCROLL')return{...state,mode:'SCROLL_ACTIVE',source:'scroll',scrollProgress:clamp(event.progress),scrollVelocity:clamp(event.velocity,-1,1),energy:clamp(Math.sin(clamp(event.progress)*Math.PI)*.7+Math.abs(event.velocity))};
 if(event.type==='RELEASE')return{...state,mode:state.energy>.01?'SETTLING':'REST',source:'none'};
 const decay=Math.exp(-Math.max(0,event.delta)*.006),energy=state.mode==='SETTLING'?state.energy*decay:state.energy;
 return{...state,time:event.time,energy:energy<.01?0:energy,velocity:{x:state.velocity.x*decay,y:state.velocity.y*decay},mode:state.mode==='SETTLING'&&energy<.01?'REST':state.mode};
}
export function mapStateToTypography(state:InteractionState){const energy=state.reducedMotion?0:clamp(state.energy);return{translateX:(state.pointer.x-.5)*energy*22,translateY:(state.pointer.y-.5)*energy*-14,scaleX:1+energy*.035,scaleY:1-energy*.02,skew:state.velocity.x*energy*2.5,tracking:energy*.025}}
export function mapStateToUniforms(state:InteractionState){return{position:state.pointer,velocity:state.velocity,energy:state.reducedMotion?0:clamp(state.energy),phase:clamp(state.scrollProgress),radius:clamp(state.influenceRadius,.05,1),aspect:state.aspect,time:state.reducedMotion?0:Math.max(0,state.time)}}
