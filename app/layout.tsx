import type { Metadata } from 'next';
import { Archivo_Black, Inter } from 'next/font/google';
import { getSiteConfig } from '../lib/storage';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black',
});

export const metadata: Metadata = {
  title: 'Log10Music | Revolución del Audio Profesional',
  description: 'Landing de alto impacto para captación de leads de Log10Music.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteConfig = await getSiteConfig();

  return (
    <html lang="es" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {siteConfig.header_code ? (
          <script dangerouslySetInnerHTML={{ __html: siteConfig.header_code }} />
        ) : null}
      </head>
      <body className={`${inter.variable} ${archivoBlack.variable} font-sans`}>
        {children}
        {siteConfig.footer_code ? (
          <div id="footer-code" dangerouslySetInnerHTML={{ __html: siteConfig.footer_code }} />
        ) : null}
      </body>
    </html>
  );
}
