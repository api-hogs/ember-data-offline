# Ember-data-offline
[![Build Status](https://travis-ci.org/api-hogs/ember-data-offline.svg?branch=master)](https://travis-ci.org/api-hogs/ember-data-offline)
[![npm version](https://badge.fury.io/js/ember-data-offline.svg)](http://badge.fury.io/js/ember-data-offline)
[![Ember Observer Score](http://emberobserver.com/badges/ember-data-offline.svg)](http://emberobserver.com/addons/ember-data-offline)

Ember-data-offline is an addon that extends ember-data to work in offline mode.

It caches records in the local storage (IndexedDB or equivalents).

## Installation

```
ember install ember-data-offline
```

## Setup

First, define your application adapter with offline support:

```javascript
//app/adapters/application.js

import baseAdapter from 'ember-data-offline/adapters/base';

export default baseAdapter.extend({
  offlineNamespace: 'foo'//optional
});
```

Then define a model and a serializer for it:

```javascript
//app/serializers/application.js

import DS from 'ember-data';

export default DS.RESTSerializer.extend({
});
```

If your primary key is different from `'id'`, you have to specify it in the adapter and serializer:

```javascript
// in adapter:

export default appAdapter.extend({
  serializerPrimaryKey: '_id',
});
```

For more information, please, take look at dummy app.

## Details

All syncornizations between local storage and backend are queued and performed sequentially.

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
