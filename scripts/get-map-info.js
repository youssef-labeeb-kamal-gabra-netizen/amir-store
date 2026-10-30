const https = require('https');

const targetUrl = 'https://maps.app.goo.gl/fjJacxeJPcMBw7rU8';

function getFinalUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(getFinalUrl(res.headers.location));
      } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ finalUrl: url, body: data }));
      }
    }).on('error', reject);
  });
}

getFinalUrl(targetUrl).then(({ finalUrl, body }) => {
  console.log('Final URL:', finalUrl);
  const match = body.match(/window\.APP_INITIALIZATION_STATE=\[\[\[[^,]+,([0-9.]+),([0-9.]+)/)
    || body.match(/@([0-9.]+),([0-9.]+)/)
    || body.match(/center=([0-9.]+)%2C([0-9.]+)/)
    || body.match(/ll=([0-9.]+),([0-9.]+)/);
  if (match) {
    console.log('Found coordinates:', match[1], match[2]);
  }
  const placeMatch = finalUrl.match(/place\/([^\/]+)/);
  if (placeMatch) {
    console.log('Place parameter:', decodeURIComponent(placeMatch[1]));
  }
}).catch(console.error);
