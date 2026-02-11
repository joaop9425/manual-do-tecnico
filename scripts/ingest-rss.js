import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  customFields: {
    item: [['Revision', 'revision']],
  }
});

// Configure RSS feeds with their default categories
const FEEDS = [
  { name: 'Microsoft Windows Blog', url: 'https://blogs.windows.com/feed/', category: 'windows' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', category: 'seguranca' },
  { name: 'The Register', url: 'https://www.theregister.com/headlines.rss', category: 'hardware' }, // Generic hardware/tech
  { name: 'Phoronix', url: 'https://www.phoronix.com/rss.php', category: 'linux' },
  { name: 'Fedora Magazine', url: 'https://fedoramagazine.org/feed/', category: 'linux' },
  { name: 'Ubuntu Blog', url: 'https://ubuntu.com/blog/feed', category: 'linux' },
  { name: 'Microsoft Security Response Center', url: 'https://api.msrc.microsoft.com/update-guide/rss', category: 'seguranca' },
  { name: 'Exploit-DB', url: 'https://www.exploit-db.com/rss.xml', category: 'seguranca' },
];

const OUTPUT_DIR = path.join(process.cwd(), 'src/content/noticias');

// Global set to store existing URLs and build it once
const existingUrls = new Set();

function loadExistingUrls(dir = OUTPUT_DIR) {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      loadExistingUrls(fullPath);
    } else if (item.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const urlMatch = content.match(/sourceUrl: "(.*?)"/);
      if (urlMatch && urlMatch[1]) {
        existingUrls.add(urlMatch[1]);
      }
    }
  }
}

// Function to ensure a directory path exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Ensure base output directory exists
ensureDir(OUTPUT_DIR);

// Function to determine category more intelligently
function detectCategory(item, defaultCategory) {
  const title = item.title || '';
  const content = (title + ' ' + (item.contentSnippet || '')).toLowerCase();
  
  // Extract category from bracketed prefix if present (e.g., "[webapps] title")
  const bracketMatch = title.match(/^\[(.*?)\]/);
  if (bracketMatch) {
    const bracketCat = bracketMatch[1].toLowerCase();
    if (['webapps', 'remote', 'local', 'hardware', 'dos'].includes(bracketCat)) {
      if (bracketCat === 'dos' || bracketCat === 'remote' || bracketCat === 'local') return 'seguranca';
      if (bracketCat === 'hardware') return 'hardware';
    }
  }

  if (content.includes('cve-') || content.includes('vulnerability') || content.includes('exploit') || content.includes('security patch')) {
      return 'seguranca';
  }
  if (content.includes('update') && (content.includes('critical') || content.includes('kb'))) {
      return 'atualizacoes-criticas';
  }
  if (content.includes('linux') || content.includes('kernel') || content.includes('ubuntu') || content.includes('fedora')) {
      return 'linux';
  }
  if (content.includes('windows 11') || content.includes('windows 10') || content.includes('microsoft windows')) {
      return 'windows';
  }

  return defaultCategory;
}

// Helper to clean HTML entities and extra spaces
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchFeed(feedConfig) {
  try {
    const feed = await parser.parseURL(feedConfig.url);
    console.log(`Fetching from: ${feedConfig.name} (${feed.items.length} items)`);

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      // Duplicate detection based on URL
      if (existingUrls.has(item.link)) continue;

      const category = detectCategory(item, feedConfig.category);
      const displayTitle = item.title.trim();
      
      // Calculate date-based directory structure
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
      const year = pubDate.getFullYear().toString();
      const month = (pubDate.getMonth() + 1).toString().padStart(2, '0');
      const day = pubDate.getDate().toString().padStart(2, '0');
      
      const targetSubDir = path.join(OUTPUT_DIR, year, month, day, category);
      ensureDir(targetSubDir);
      
      // Create a unique slug based on title
      const slug = displayTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Create filename
      const timestamp = item.pubDate ? `-${new Date(item.pubDate).getTime()}` : '';
      const revisionSuffix = item.revision ? `-v${parseFloat(item.revision)}` : '';
      const filename = `${slug.substring(0, 50)}${timestamp}${revisionSuffix}.md`;
      const filePath = path.join(targetSubDir, filename);

      if (fs.existsSync(filePath)) continue;

      // Extract tags
      const tags = (item.categories || [])
        .map(c => typeof c === 'string' ? c : (c._ || c.name))
        .filter(Boolean)
        .slice(0, 5);

      const revision = item.revision || '1.0';
      const excerpt = cleanText(item.contentSnippet || item.content || '')
        .substring(0, 250)
        .replace(/"/g, '\\"')
        .trim() + '...';

      const frontmatter = `---
title: "${displayTitle.replace(/"/g, '\\"')}"
source: "${feedConfig.name}"
sourceUrl: "${item.link}"
pubDate: ${pubDate.toISOString().split('T')[0]}
category: "${category}"
revision: "${revision}"
tags: ${JSON.stringify(tags)}
excerpt: "${excerpt}"
---

Esta é uma agregação automática. Para ler o conteúdo completo, acesse a fonte original: [${feedConfig.name}](${item.link})
`;

      fs.writeFileSync(filePath, frontmatter);
      existingUrls.add(item.link);
    }
  } catch (err) {
    console.error(`Error fetching ${feedConfig.name}:`, err);
  }
}

async function main() {
  console.log('--- START RSS INGESTION ---');
  loadExistingUrls();
  console.log(`Found ${existingUrls.size} existing news in registry.`);
  await Promise.all(FEEDS.map(fetchFeed));
  console.log('--- RSS INGESTION COMPLETE ---');
}

main();
