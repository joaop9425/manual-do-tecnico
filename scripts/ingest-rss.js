import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const parser = new Parser();

// Configure RSS feeds with their default categories
const FEEDS = [
  { name: 'Microsoft Windows Blog', url: 'https://blogs.windows.com/feed/', category: 'windows' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'seguranca' },
  { name: 'The Register', url: 'https://www.theregister.com/headlines.rss', category: 'hardware' }, // Generic hardware/tech
  { name: 'Phoronix', url: 'https://www.phoronix.com/rss.php', category: 'linux' },
  { name: 'Fedora Magazine', url: 'https://fedoramagazine.org/feed/', category: 'linux' },
  { name: 'Ubuntu Blog', url: 'https://ubuntu.com/blog/feed', category: 'linux' },
  { name: 'Microsoft Security Response Center', url: 'https://msrc.microsoft.com/blog/feed', category: 'seguranca' },
];

const OUTPUT_DIR = path.join(process.cwd(), 'src/content/noticias');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to determine category more intelligently if needed
function detectCategory(item, defaultCategory) {
  const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
  
  if (content.includes('cve-') || content.includes('vulnerability') || content.includes('exploit') || content.includes('security patch')) {
      return 'seguranca';
  }
  if (content.includes('update') && (content.includes('critical') || content.includes('kb'))) {
      return 'atualizacoes-criticas';
  }
  if (content.includes('linux') || content.includes('kernel')) {
      return 'linux';
  }
  if (content.includes('windows 11') || content.includes('windows 10')) {
      return 'windows';
  }

  return defaultCategory;
}

async function fetchFeed(feedConfig) {
  try {
    const feed = await parser.parseURL(feedConfig.url);
    console.log(`Fetching from: ${feedConfig.name} (${feed.items.length} items)`);

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const category = detectCategory(item, feedConfig.category);
      
      // Create a unique slug based on title
      const slug = item.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const filename = `${slug}-${item.pubDate ? new Date(item.pubDate).getTime() : Date.now()}.md`;
      const filePath = path.join(OUTPUT_DIR, filename);

      const frontmatter = `---
title: "${item.title.replace(/"/g, '\\"')}"
source: "${feedConfig.name}"
sourceUrl: "${item.link}"
pubDate: ${item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
category: "${category}"
excerpt: "${item.contentSnippet ? item.contentSnippet.substring(0, 200).replace(/"/g, '\\"').replace(/\n/g, ' ') + '...' : ''}"
---

Esta é uma agregação automática. Para ler o conteúdo completo, acesse a fonte original: [${feedConfig.name}](${item.link})
`;

      fs.writeFileSync(filePath, frontmatter);
    }
  } catch (err) {
    console.error(`Error fetching ${feedConfig.name}:`, err);
  }
}

async function main() {
  console.log('--- START RSS INGESTION (Aggregated Only) ---');
  
  // Optional: Clean existing news to avoid schema conflicts or duplicates if preferred
  // For now we just overwrite/add new ones.
  
  await Promise.all(FEEDS.map(fetchFeed));
  console.log('--- RSS INGESTION COMPLETE ---');
}

main();
