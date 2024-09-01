import { Hono } from 'hono'
import { logger } from 'hono/logger';
import { verifySignature } from './lib/signature';
import { parser } from './lib/rss-parser';
import { env, isDev } from './lib/env';
import { sendMessageToChannel } from './lib/send-message-to-channel';

export const app = new Hono()

app.use(logger())

app.get('/callback-from-youtube', async (c) => {
  // const hubTopic = c.req.query('hub.topic')
  const hubChallenge = c.req.query('hub.challenge')
  // const hubMode = c.req.query('hub.mode')
  // const hubLeaseSeconds = c.req.query('hub.lease_seconds')

  return new Response(hubChallenge, { status: 200 })
})

app.post('/callback-from-youtube', async (c) => {
    const body = await c.req.text();

    if (!isDev) {
        const userAgent = c.req.header('User-Agent');
        const signature = c.req.header('X-Hub-Signature');

        // Check User-Agent
        if (!userAgent || !userAgent.includes('Google')) {
            console.log('Invalid User-Agent:', userAgent);
            return new Response('Forbidden', { status: 403 });
        }

        // Verify Signature
        if (!signature || !verifySignature(body, signature)) {
            console.log('Invalid Signature:', signature);
            return new Response('Forbidden', { status: 403 });
        }
    } else {
        console.log('Skipping verification in development mode');
    }

    console.log('Callback from YouTube:', c.req.url);

    if (c.req.header('Content-Type') === 'application/atom+xml') {
        const parsedData = await parser.parseString(body);
        console.log('Parsed data:', parsedData);

        const { items } = parsedData;

        const item = items[0];

        if (!item) {
            console.log('no item was found', body)
            return new Response(null, { status: 204 });
        }

        if (item['yt:channelId'] !== env.YT_CHANNEL_ID) {
            console.log('channel id does not match', body)
            return new Response(null, { status: 204 });
        }

        await sendMessageToChannel({
            id: item['yt:videoId'],
            title: item.title!,
        });
    } else {
        console.log('no data was parsed', body)
    }

    return new Response(null, { status: 204 });
});
