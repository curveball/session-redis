Curveball Redis Session Middleware
==================================

[![Greenkeeper badge](https://badges.greenkeeper.io/curveballjs/session-redis.svg)](https://greenkeeper.io/)

This package adds support for sessions to the [Curveball](https://github.com/curveballjs/) framework. The
session store is backed by Redis, therefore having an accessable Redis server
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
      host: 'myhost.redis',
      port: 1234,
      ...
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
import { RedisClient } from 'redis';

const redis = new RedisClient({
  host: 'myhost.redis',
  port: 1234,
});

app.use(session({
  store: new RedisStore({
    prefix: 'mysess',
    client: redis
  })
  cookieName: 'MY_SESSION',
  expiry: 7200
});
```

[1]: https://github.com/NodeRedis/node_redis#options-object-properties
