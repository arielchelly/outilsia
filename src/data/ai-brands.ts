/**
 * Curated list of well-known AI brands for the homepage constellation.
 * Each entry has a unique brand identity (no duplicates of the same logo).
 * Logos are loaded via Google Favicons API which is highly reliable.
 */

export interface AIBrand {
  name: string;
  domain: string;
}

export const AI_BRANDS: AIBrand[] = [
  // Foundation models / chatbots
  { name: 'ChatGPT', domain: 'openai.com' },
  { name: 'Claude', domain: 'anthropic.com' },
  { name: 'Gemini', domain: 'gemini.google.com' },
  { name: 'Mistral', domain: 'mistral.ai' },
  { name: 'Llama', domain: 'llama.com' },
  { name: 'Grok', domain: 'x.ai' },
  { name: 'Cohere', domain: 'cohere.com' },
  { name: 'Perplexity', domain: 'perplexity.ai' },
  { name: 'You.com', domain: 'you.com' },
  { name: 'Phind', domain: 'phind.com' },
  { name: 'Hugging Face', domain: 'huggingface.co' },
  { name: 'DeepSeek', domain: 'deepseek.com' },
  { name: 'Qwen', domain: 'qwenlm.ai' },
  { name: 'Pi', domain: 'pi.ai' },
  { name: 'Copilot', domain: 'copilot.microsoft.com' },
  { name: 'Character.ai', domain: 'character.ai' },

  // Image generation
  { name: 'Midjourney', domain: 'midjourney.com' },
  { name: 'Stable Diffusion', domain: 'stability.ai' },
  { name: 'Adobe Firefly', domain: 'adobe.com' },
  { name: 'Ideogram', domain: 'ideogram.ai' },
  { name: 'Leonardo.ai', domain: 'leonardo.ai' },
  { name: 'Flux', domain: 'blackforestlabs.ai' },
  { name: 'Canva', domain: 'canva.com' },
  { name: 'Krea', domain: 'krea.ai' },
  { name: 'Recraft', domain: 'recraft.ai' },
  { name: 'NightCafe', domain: 'nightcafe.studio' },
  { name: 'Imagine', domain: 'imagine.art' },
  { name: 'Civitai', domain: 'civitai.com' },
  { name: 'Magnific', domain: 'magnific.ai' },

  // Video
  { name: 'Sora', domain: 'sora.com' },
  { name: 'Runway', domain: 'runwayml.com' },
  { name: 'Pika', domain: 'pika.art' },
  { name: 'Kling', domain: 'klingai.com' },
  { name: 'HeyGen', domain: 'heygen.com' },
  { name: 'Synthesia', domain: 'synthesia.io' },
  { name: 'D-ID', domain: 'd-id.com' },
  { name: 'Luma', domain: 'lumalabs.ai' },
  { name: 'InVideo', domain: 'invideo.io' },
  { name: 'Veed', domain: 'veed.io' },
  { name: 'Genmo', domain: 'genmo.ai' },
  { name: 'Hailuo', domain: 'hailuoai.com' },

  // Audio / Voice / Music
  { name: 'ElevenLabs', domain: 'elevenlabs.io' },
  { name: 'Suno', domain: 'suno.com' },
  { name: 'Udio', domain: 'udio.com' },
  { name: 'Murf', domain: 'murf.ai' },
  { name: 'PlayHT', domain: 'play.ht' },
  { name: 'Resemble', domain: 'resemble.ai' },

  // Code
  { name: 'GitHub Copilot', domain: 'github.com' },
  { name: 'Cursor', domain: 'cursor.com' },
  { name: 'Codeium', domain: 'codeium.com' },
  { name: 'Tabnine', domain: 'tabnine.com' },
  { name: 'Bolt', domain: 'bolt.new' },
  { name: 'v0', domain: 'v0.dev' },
  { name: 'Lovable', domain: 'lovable.dev' },
  { name: 'Replit', domain: 'replit.com' },
  { name: 'Aider', domain: 'aider.chat' },
  { name: 'Continue', domain: 'continue.dev' },
  { name: 'Sourcegraph Cody', domain: 'sourcegraph.com' },
  { name: 'Devin', domain: 'cognition.ai' },
  { name: 'Windsurf', domain: 'windsurf.com' },

  // Productivity
  { name: 'Notion', domain: 'notion.so' },
  { name: 'Mem', domain: 'mem.ai' },
  { name: 'Reflect', domain: 'reflect.app' },
  { name: 'Otter', domain: 'otter.ai' },
  { name: 'Fireflies', domain: 'fireflies.ai' },
  { name: 'Granola', domain: 'granola.ai' },

  // SEO / Marketing / Copy
  { name: 'Semrush', domain: 'semrush.com' },
  { name: 'Ahrefs', domain: 'ahrefs.com' },
  { name: 'Surfer SEO', domain: 'surferseo.com' },
  { name: 'Frase', domain: 'frase.io' },
  { name: 'NeuronWriter', domain: 'neuronwriter.com' },
  { name: 'Jasper', domain: 'jasper.ai' },
  { name: 'Copy.ai', domain: 'copy.ai' },
  { name: 'Writesonic', domain: 'writesonic.com' },
  { name: 'Rytr', domain: 'rytr.me' },

  // Translation
  { name: 'DeepL', domain: 'deepl.com' },
  { name: 'Reverso', domain: 'reverso.net' },
  { name: 'Lara', domain: 'laratranslate.com' },

  // Automation
  { name: 'Make', domain: 'make.com' },
  { name: 'Zapier', domain: 'zapier.com' },
  { name: 'n8n', domain: 'n8n.io' },
  { name: 'Bardeen', domain: 'bardeen.ai' },
  { name: 'Relay', domain: 'relay.app' },
];

/**
 * Returns a stable favicon URL for a domain.
 * Google Favicons API is very reliable and supports any registered domain.
 */
export function logoUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Fallback URL if Google Favicons fails.
 */
export function fallbackLogoUrl(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}
