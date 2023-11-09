Curveball Redis Session Middleware
==================================

This package adds support for sessions to the [Curveball](https://curveballjs.org/) framework.
The session store is backed by Redis, therefore having an accessable Redis server
is a prerequisite.

Installation
------------

    npm install @curveball/session-redis


Getting started
---------------

### Adding the middleware

```typescript
import session from '@curveball/session';
import { RedisStore } from '@curveball/session-redis';

app.use(session({
  store: new RedisStore(),
});
```

This will add the redis session store to curveball. Using the redis store
without any options will attempt to connect to a local Redis server using
default connection details.

Here is another example with more options:

```typescript
import session from '@curveball/session';
import RedisStore from '@curveball/session-redis';

app.use(session({
  store: new RedisStore({
    prefix: 'mysess',
    clientOptions: {
      url: 'redis://username:password@host:port/',
    },
  }),
  cookieName: 'MY_SESSION',
  expiry: 7200
});
```

`clientOptions` is the set of options for the Redis client. The list of
available `clientOptions` can be found on the [NodeRedis/node_redis][1]
repository.

Instead of passing `clientOptions`, it's also possible to pass a fully setup
isntance of RedisClient. This can be useful if the same connection should be
re-used by a different part of your application:

```typescript
import session from '@curveball/session';
import RedisStore from '@curveball/session-redis';
import { createClient } from 'redis';

const redis = createClient('redis://localhost');

app.use(session({
  store: new RedisStore({
    prefix: 'mysess',
    client: redis
  })
  cookieName: 'MY_SESSION',
  expiry: 7200
});
```

[1]: https://github.com/redis/node-redis/blob/master/docs/client-configuration.md
