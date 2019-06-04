import { SessionStore, SessionValues } from '@curveball/session/dist/types';
import crypto from 'crypto';
import redis, { ClientOpts, RedisClient } from 'redis';
import { promisify } from 'util';

type RedisOpts = {
  clientOptions: ClientOpts,
  prefix: string,
};

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

    this.client = redis.createClient(this.opts.clientOptions);
  }

  async set(id: string, values: SessionValues, expire: number): Promise<void> {

    const setSession = promisify(this.client.setex).bind(this.client);

    // expire is a unix timestamp, therefore we must compare it to now to find
    // an equivilent elapsed seconds that Redis prefers.
    const ttl = expire - Math.floor(Date.now() / 1000);

    // TODO: It may be better to use a Redis hash here instead of JSON stringify
    await setSession(`${this.opts.prefix}-${id}`, ttl, JSON.stringify(values));
  }

  async get(id: string): Promise<SessionValues | null> {

    const getSession = promisify(this.client.get).bind(this.client);

    const session: any = await getSession(`${this.opts.prefix}-${id}`);
    const values: SessionValues = <SessionValues> JSON.parse(session);

    return values;

  }

  async delete(id: string): Promise<void> {

    const deleteSession = promisify(this.client.del).bind(this.client);

    await deleteSession(`${this.opts.prefix}-${id}`);

  }

  async newSessionId(): Promise<string> {

    const randomBytes = promisify(crypto.randomBytes);
    const bytes = await randomBytes(32);

    return bytes.toString('base64');

  }
}