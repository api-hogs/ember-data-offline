# Ember-data-offline
[![Build Status](https://travis-ci.org/api-hogs/ember-data-offline.svg?branch=master)](https://travis-ci.org/api-hogs/ember-data-offline)

Ember-data-offline is addon that provides some mixin that allows to achieve to main goals - to backup data, received from backend API to local storage to allow app to work in offline mode and to use this storage as a cache. 

## Installation

```
ember install ember-data-offline
```

## Setup

First you need to define your application adapter:

```javascript
import baseAdapter from 'ember-data-offline/adapters/base';

export default baseAdapter.extend({
  offlineNamespace: 'foo'//optional
});
```

Then specify model and define serializer for it (for now it is required, later we'll fix it):

```javascript
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
});
```

And basically, that's all!

If you have `'id'` in your model different from default (`'_id'` for example), you need to specify it in adapter for the model like that:

```javascript
export default appAdapter.extend({
  serializerPrimaryKey: '_id',
});
```

and also in serializer for that model you need to use mixin for translating it to normal `'id'`:

```javascript
import DS from 'ember-data';
import offlineIdMixin from 'ember-data-offline/mixins/localstorage-id'; //thing that you need!

export default DS.RESTSerializer.extend(offlineIdMixin, {
  primaryKey: '_id', //usual ember-data stuff
});
```

## Details

This addon contains of two essential parts. First - `queue` and `jobs`, second - `online` and `offline mixins`.

`Queue` is just super easy task runner and used to make kind of background proccessing mechanism and basically we use it to synchronize data flows from online api and local storage.

`Online mixin` redefine all adapter methods for finding, creation, deletion to to make request to online api, but with running offline job to make offline data actual.

Same for `offline mixin`, but vice versa.

As you see it is as simple as possible and names of mixins say mostly all about them :-).

Example of usage of these mixins you can see in `addon/adapters/base.js`.

Also we created this base adapter (`addon/adapters/base.js`) to simplify setup proccess. By default it use `RESTAdapter` and `LocalForageAdapter`, but you can use your own adapters that you like.

## Contribution

1. fork repo
2. `git clone git@github.com:your-github/ember-data-offline.git`
2. `npm i && bower install`
3. add your feature
4. cover with tests
5. send PR!

## License

[Licensed under MIT license] [1]

[1]:http://opensource.org/licenses/mit-license.php
