import Parser from 'rss-parser';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
});

const FEEDS = [
  { name: 'Windows Blog', url: 'https://blogs.windows.com/feed/' },
  { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'The Register', url: 'https://www.theregister.com/headlines.rss' },
  { name: 'Exploit-DB', url: 'https://www.exploit-db.com/rss.xml' },
  { name: 'MSRC', url: 'https://api.msrc.microsoft.com/update-guide/rss' }
];

async function inspect() {
  for (const f of FEEDS) {
    try {
      const feed = await parser.parseURL(f.url);
      const item = feed.items[0];
      console.log(`FEED: ${f.name}`);
      console.log(`KEYS: ${Object.keys(item).join(', ')}`);
      console.log(`CONTENT_SNIPPET: ${item.contentSnippet?.substring(0, 50)}...`);
      console.log('---');
    } catch (e) {
      console.log(`ERROR ${f.name}: ${e.message}`);
    }
  }
}
inspect();
