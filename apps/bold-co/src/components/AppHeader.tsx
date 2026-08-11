import { BookOpen, Home, Info, LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId } from '../model';
interface Props { currentTab: TabId; onNavigate: (tab: TabId) => void; }
const tabs: Array<{ id: TabId; label: string; icon: LucideIcon; accent: string }> = [
  { id:'home', label:'01. HOME', icon:Home, accent:'#A2FF00' }, { id:'about', label:'02. COMPANY_INFO', icon:Info, accent:'#00E5FF' }, { id:'blog', label:'03. JOURNAL', icon:BookOpen, accent:'#FF007A' }, { id:'dashboard', label:'04. DASHBOARD_CMS', icon:LayoutDashboard, accent:'#FFE600' }
];
export function AppHeader({ currentTab,onNavigate }:Props){return <header className="app-header"><div className="header-inner"><button className="brand-sticker physical-offset" onClick={()=>onNavigate('home')}>BOLD_CO <span className="live-dot" aria-hidden="true"/></button><nav className="tab-nav" aria-label="Primary">{tabs.map(tab=>{const Icon=tab.icon;const active=currentTab===tab.id;return <button key={tab.id} aria-current={active?'page':undefined} className="nav-switch physical-offset" style={{backgroundColor:active?tab.accent:'#FFFFFF'}} onClick={()=>onNavigate(tab.id)}><Icon size={16} aria-hidden="true"/>{tab.label}</button>;})}</nav></div></header>;}
