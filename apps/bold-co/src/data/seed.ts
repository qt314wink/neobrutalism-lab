import type { BlogPost, GalleryImage, Review } from '../model';

export const INITIAL_BLOGS: BlogPost[] = [
  { id: 1, title: 'WHY SMOOTH INTERFACES ARE DYING & BRUTALISM IS BACK', category: 'Design', color: '#A2FF00', date: 'MAY 22, 2026', readTime: '4 MIN READ', author: 'Zix Shredder', summary: 'Standardized templates have sucked the soul out of the internet. Here is how flat solid shadows and high-contrast grids are returning tactile agency to digital spaces.', content: 'We are living in an era of design fatigue. Every startup landing page looks like a variation of the same pastel gradient, soft rounded corner, and generic vector illustration. Enter Neo-Brutalist design: a deliberate rebellion. By using thick black borders, stark monospace typography, and unfiltered saturated colors, we give websites a physical weight. It reminds us of vintage computer magazines, retro zines, and street poster art.' },
  { id: 2, title: 'BUILDING A 0.1s LOAD TIME STATIC SITE WITH NO FRAMEWORKS', category: 'Tech', color: '#00E5FF', date: 'APR 18, 2026', readTime: '7 MIN READ', author: 'Elena Flux', summary: 'How we stripped out 3MB of unused node modules to build a lightning fast cyber-grid landing page that loads before you even release your mouse click.', content: 'Performance is an aesthetic. If your beautiful page takes 5 seconds to load on a 3G subway connection, your design is fundamentally broken. By returning to semantic structural elements, optimizing SVG path counts, and rejecting heavy tracking bundles, we managed to score a perfect 100 on Lighthouse while maintaining a highly expressive, heavily interactive aesthetic.' },
  { id: 3, title: 'HOW SOUND DESIGN ELEVATES NEO-BRUTALIST MICRO-INTERACTIONS', category: 'Aesthetics', color: '#FF007A', date: 'MAR 09, 2026', readTime: '5 MIN READ', author: 'Kaelen Noise', summary: 'Adding tactical pops, organic clicks, and mechanical hums to your CSS active state transformations to create sensory-rich web structures.', content: 'When users click a button styled with a solid black offset shadow, they expect a physical response. Translating the button by the shadow offset on active replicates the feeling of a tactile mechanical switch. Coupling this with snappy, low-latency feedback delivers an addictive desktop experience.' }
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 1, name: 'Marcus Thorne', role: 'Creative Lead, VapourCorp', stars: 5, comment: "Absolutely savage work. Our conversion rates spiked by 42% after discarding our generic corporate layout for BOLD_CO's neo-grid approach." },
  { id: 2, name: 'Aria Sterling', role: 'Founder, Zenith Logistics', stars: 5, comment: 'Highly opinionated design that filtered out casual lookers and attracted true brand zealots. A bold move that paid off enormously.' },
  { id: 3, name: 'Koji Takahashi', role: 'VP of Product, SYNAPSE', stars: 4, comment: 'Extremely fast execution, unapologetic style, and phenomenal technical discipline underneath the wild aesthetic.' }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, title: 'THE ENGINE ROOM', subtitle: 'Where visual concepts are broken and rebuilt.', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=900', badge: 'WORKPLACE' },
  { id: 2, title: 'PROTOTYPING RACKS', subtitle: 'Physical computing rigs and CRT visual feedback.', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=900', badge: 'LAB' },
  { id: 3, title: 'CREATIVE STRATEGY', subtitle: 'High contrast layout sketching on raw kraft board.', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=900', badge: 'PLANNING' },
  { id: 4, title: 'THE SOUND SYNTH', subtitle: 'Analogue oscillators generating micro-interaction feedback.', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=900', badge: 'GEAR' }
];

export const TICKER_ITEMS = ['NO SOFT GRADIENTS ALLOWED','SHARP BORDERS ONLY','FAST AS LIGHTNING','MADE IN THE LABS OF BOLD_CO','TACTILE SOLID SHADOWS ON DEMAND','DESIGN REVOLUTION STARTS HERE'];
