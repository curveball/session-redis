Curveball Redis Session Middleware
==================================

This package adds support for sessions to the [Curveball][https://github.com/curveballjs/] framework. The
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
import { RedisStore } from '@curveball/session-redis';

app.use(session({
  store: new RedisStore({
    host: 'myhost.redis',
    port: 1234,
    ...
  }),
  cookieName: 'MY_SESSION',
  expiry: 7200
});
```

The list of available options can be found on the [NodeRedis/node_redis](https://github.com/NodeRedis/node_redis#options-object-properties)
repository.

