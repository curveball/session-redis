Changelog
=========

0.6.0 (2023-11-09)
------------------

Note that this package upgraded the internal Redis package from 2 to 4. The
Redis package had some BC breaks, which means that as a user of this package
you may also need to make changes to how you configured or passed the Redis
instance.

* This package now supports ESM and CommonJS modules.
* No longer supports Node 14. Please use Node 16 or higher.
* Removed the cookie dependency, it wasn't used
* Updated to NPM Redis version 4.
* Removed debug console.log output


0.5.0 (2022-09-03)
------------------

* Upgraded from `@curveball/core` to `@curveball/kernel`.


0.4.1 (2021-03-01)
------------------

* Put `redis` dependency back.


0.4.0 (2021-03-01)
------------------

* Upgraded to latest curveball core and curveball standards.
* `@curveball/session` is now a peerDependency.
* Support for `esModuleInterop: false`.


0.3.0 (2019-09-10)
------------------

* New feature: allow fully instantiated Redis client to be passed, instead of
  letting the client connect by itself.


0.2.2 (2019-06-05)
------------------

* Fixed bugs in readme.


0.2.1 (2019-06-05)
------------------

* Update readme with correct documentation.


0.2.0 (2019-06-05)
------------------

* Add prefix support.


0.1.1 (2019-05-31)
------------------

* Removed unused dependencies
* Unittests


0.1.0 (2019-05-29)
------------------

* First public version
