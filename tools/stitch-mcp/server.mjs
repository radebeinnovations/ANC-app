import { StitchProxy } from '@google/stitch-sdk';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

if (!process.env.STITCH_API_KEY) {
  throw new Error('STITCH_API_KEY is not available to the Stitch connector.');
}

const proxy = new StitchProxy({ apiKey: process.env.STITCH_API_KEY });
await proxy.start(new StdioServerTransport());
