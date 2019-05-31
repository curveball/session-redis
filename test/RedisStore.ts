import RedisStore from '../src/RedisStore';
import sinon from 'sinon';
import redis, { Callback } from 'redis';
import { expect } from 'chai';

describe('RedisStore', () => {

  it('should instantiate', () => {

    const rcc = sinon.stub(redis, <any>'createClient').returns({});
    
    new RedisStore();

    rcc.restore();

  });

  it('should save and retrieve a session', async () => {

    const rcc = sinon.stub(redis, <any>'createClient').returns({});

    const rs = new RedisStore();

    // rs.client.set = (key: string, value: string, mode: string, duration: number, cb: any = (err: any, reply: any) => 'OK') => true;
    rs.client.setex = (key: string, seconds: number, value: string, cb: any) => { cb(null, 'OK'); return true; };
    rs.client.get = (key: string, cb: Callback<string>) => { cb(null, '{"bar": "bar"}'); return true };

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);
   
    expect(await rs.get('foo')).to.deep.equal({bar: 'bar'});

    rcc.restore();
  });

  it('should not give access to expired sessions', (done) => {
    
    const rcc = sinon.stub(redis, <any>'createClient').returns({});

    const rs = new RedisStore();

    rs.client.setex = (key: string, seconds: number, value: string, cb: any) => { cb(null, 'OK'); return true; };
    rs.client.get = (key: string, cb: Callback<string>) => { cb(null, 'null'); return true };

    rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 1)
      .then(() => {

        setTimeout(async () => {

          expect(await rs.get('foo')).to.equal(null);

          done();

          rcc.restore();
      
        }, 1001);

      });

  });

  it ('should not give access to deleted sessions', async () => {

    const rcc = sinon.stub(redis, <any>'createClient').returns({});

    const rs = new RedisStore();

    rs.client.setex = (key: string, seconds: number, value: string, cb?: any) => { cb(null, 'OK'); return true; };
    rs.client.get = (key: string, cb?: any) => { cb(null, 'null'); return true };
    rs.client.del = (key: any, cb?: any) => { cb(null, 1); return true; };

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);

    await rs.delete('foo');

    expect(await rs.get('foo')).to.equal(null);

    rcc.restore();

  });

  it ('should genreate a random session Id', async () => {
 
    const rcc = sinon.stub(redis, <any>'createClient').returns({});
    const rs = new RedisStore();
    const id = await rs.newSessionId();

    expect(id).to.be.a('string');

    rcc.restore();
   
  });

});
