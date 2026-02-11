
async function test() {
    try {
        const response = await fetch('https://api.msrc.microsoft.com/update-guide/rss');
        const text = await response.text();
        const fs = await import('fs');
        fs.writeFileSync('scripts/feed-sample.xml', text);
        console.log('Saved to scripts/feed-sample.xml');
    } catch (e) {
        console.error(e);
    }
}
test();
