import RedisStore from '../src/RedisStore';
import { expect } from 'chai';

describe('RedisStore', () => {

  it('should instantiate', () => {

    new RedisStore();

  });

  it('should save and retrieve a session', async () => {

    const rs = new RedisStore();

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);

    expect(await rs.get('foo')).to.deep.equal({bar: 'bar'});

  });

  it('should not give access to expired sessions', (done) => {
    
    const rs = new RedisStore();

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

    await rs.set('foo', {bar: 'bar'}, Math.floor(Date.now() / 1000) + 10);

    await rs.delete('foo');

    expect(await rs.get('foo')).to.equal(null);

  });

  it ('should genreate a random session Id', async () => {
 
    const rs = new RedisStore();

    const id = await rs.newSessionId();

    expect(id).to.be.a('string');
   
  });


});
