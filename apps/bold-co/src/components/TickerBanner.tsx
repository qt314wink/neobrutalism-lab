import { Sparkles } from 'lucide-react';
import { TICKER_ITEMS } from '../data/seed';
export function TickerBanner() { return <div className="ticker-shell" aria-label="BOLD_CO status ticker"><div className="ticker-track">{Array.from({ length: 4 }, () => TICKER_ITEMS).flat().map((item,index)=><span key={`${item}-${index}`} className="ticker-item"><Sparkles aria-hidden="true" size={16}/>{item}</span>)}</div></div>; }
