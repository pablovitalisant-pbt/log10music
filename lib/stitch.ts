import { promises as fs } from 'fs';
import path from 'path';

function extractBody(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1].trim() : html;
}

export async function getStitchBodyHtml(): Promise<string> {
  const file = path.join(process.cwd(), 'docs', 'UI Design', 'code.html');
  const html = await fs.readFile(file, 'utf8');
  const body = extractBody(html)
    .replace(
      'class="relative min-h-screen flex items-center pt-20 overflow-hidden mesh-gradient"',
      'class="relative z-30 min-h-screen flex items-center pt-20 overflow-hidden mesh-gradient"'
    )
    .replace(
      'class="flex flex-col sm:flex-row gap-6"',
      'class="relative z-40 flex flex-col sm:flex-row gap-6"'
    )
    .replace(
      'class="bg-primary text-charcoal hover:bg-white px-12 py-6 text-2xl font-black transform -skew-x-6 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"',
      'class="relative z-30 bg-primary text-charcoal hover:bg-white px-12 py-6 text-2xl font-black transform -skew-x-6 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"'
    )
    .replace(
      'class="border-4 border-white/20 hover:border-primary text-white px-12 py-6 text-2xl font-black transform -skew-x-6 transition-all"',
      'class="relative z-30 border-4 border-primary bg-white text-primary px-12 py-6 text-2xl font-black transform -skew-x-6 transition-all"'
    )
    .replace(/HABLAR CON UN EXPERTO/g, 'SOLICITAR DIAGNÓSTICO')
    .replace(/CONTACTO DIRECTO/g, 'SOLICITAR DIAGNÓSTICO')
    .replace(/SOLICITAR DIAGNÓSTICO GRATUITO/g, 'SOLICITAR DIAGNÓSTICO');
  return body;
}
