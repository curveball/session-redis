import { SessionStore } from '@curveball/session';
import * as crypto from 'node:crypto';
import { RedisClientOptions, createClient } from 'redis';
import { promisify } from 'node:util';

type SessionValues = Record<string, any>;

type RedisClient = ReturnType<typeof createClient>;

type RedisOpts = {
  clientOptions: RedisClientOptions;
  prefix: string;
} | {
  client: RedisClient;
  prefix: string;
};


const randomBytes = promisify(crypto.randomBytes);

/**
 * The Redis session store keeps sessions in a Redis key-value cache store. The
 * store only uses basic Redis types.
 *
 * Any options that you would pass into the NodeRedis/node_redis package is
 * accepted as options for this store.
 */
export default class RedisStore implements SessionStore {

  client: RedisClient;
  opts: RedisOpts;

  constructor(opts?: RedisOpts) {
    this.opts = Object.assign({}, {
      clientOptions: {},
      prefix: 'session',
    }, opts);

    if ('client' in this.opts) {
      this.client = this.opts.client;
    } else {
      this.client = createClient(this.opts.clientOptions);
      this.client.connect();
    }
  }

  async set(id: string, values: SessionValues, expire: number): Promise<void> {

    // expire is a unix timestamp, therefore we must compare it to now to find
    // an equivilent elapsed seconds that Redis prefers.
    const ttl = expire - Math.floor(Date.now() / 1000);

    // TODO: It may be better to use a Redis hash here instead of JSON stringify
    await this.client.setEx(`${this.opts.prefix}-${id}`, ttl, JSON.stringify(values));
  }

  async get(id: string): Promise<SessionValues | null> {

    const session: any = await this.client.get(`${this.opts.prefix}-${id}`);
    const values: SessionValues = JSON.parse(session) as SessionValues;

    return values;

  }

  async delete(id: string): Promise<void> {

    await this.client.del(`${this.opts.prefix}-${id}`);

  }

  async newSessionId(): Promise<string> {

    const bytes = await randomBytes(32);
    return bytes.toString('base64');

  }
}
