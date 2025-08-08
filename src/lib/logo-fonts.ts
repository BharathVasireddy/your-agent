import { Montserrat, Playfair_Display, Cinzel, Lora } from 'next/font/google';

// Bold weights for logo impact; limited subset for performance
const montserrat = Montserrat({ subsets: ['latin'], weight: ['700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['700'] });
const lora = Lora({ subsets: ['latin'], weight: ['700'] });

export const logoFontClassNameByKey: Record<string, string> = {
  // Tailwind defaults
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  // Next/font powered
  montserrat: montserrat.className,
  playfair: playfair.className,
  cinzel: cinzel.className,
  lora: lora.className,
};

export const logoFontOptions: Array<{ value: string; label: string; className: string }> = [
  { value: 'sans', label: 'Sans', className: logoFontClassNameByKey.sans },
  { value: 'serif', label: 'Serif', className: logoFontClassNameByKey.serif },
  { value: 'mono', label: 'Mono', className: logoFontClassNameByKey.mono },
  { value: 'montserrat', label: 'Montserrat', className: logoFontClassNameByKey.montserrat },
  { value: 'playfair', label: 'Playfair Display', className: logoFontClassNameByKey.playfair },
  { value: 'cinzel', label: 'Cinzel', className: logoFontClassNameByKey.cinzel },
  { value: 'lora', label: 'Lora', className: logoFontClassNameByKey.lora },
];


