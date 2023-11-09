import RedisStore from '../src/redis-store.js';
import { expect } from 'chai';

describe('RedisStore', () => {

  it('should instantiate', () => {

    new RedisStore();

  });

  it('should save and retrieve a session', async () => {

    const rs = new RedisStore();
    rs.client.setEx = async ():Promise<any> => {};
    rs.client.get = async():Promise<any> => { return '{"bar": "bar"}';};

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);
    expect(await rs.get('foo')).to.deep.equal({bar: 'bar'});

  });

  it('should not give access to expired sessions', (done) => {

    const rs = new RedisStore();

    rs.client.setEx = async ():Promise<any> => {};
    rs.client.get = async():Promise<any> => { return 'null';};

    rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 1)
      .then(() => {

        setTimeout(async () => {

          expect(await rs.get('foo')).to.equal(null);

          done();

        }, 1001);

      });

  });

  it ('should not give access to deleted sessions', async () => {

    const rs = new RedisStore();

    rs.client.setEx = async():Promise<any> => {};
    rs.client.get = async():Promise<any> => { return 'null';};
    rs.client.del = async():Promise<any> => { return '1'; };

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);

    await rs.delete('foo');

    expect(await rs.get('foo')).to.equal(null);

  });

  it ('should genreate a random session Id', async () => {

    const rs = new RedisStore();
    const id = await rs.newSessionId();

    expect(id).to.be.a('string');

  });

  it('should save and retrieve a session with a custom client', async () => {

    const client = {
      setEx: async(): Promise<any> => {},
      get: async(): Promise<any> => '{"bar": "bar"}'
    };

    const rs = new RedisStore({
      prefix: 'prefix',
      client: client as any
    });

    // rs.client.set = (key: string, value: string, mode: string, duration: number, cb: any = (err: any, reply: any) => 'OK') => true;


    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);

    expect(await rs.get('foo')).to.deep.equal({bar: 'bar'});

  });

});
