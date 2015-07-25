import Ember from "ember";

var localforageHelpers = function() {

  Ember.Test.registerAsyncHelper('waitForRecordingAll', function(app, modelsToProccess) {
    return Ember.Test.promise(function(resolve) {
      Ember.Test.adapter.asyncStart();
      let interval = window.setInterval(function() {

        let recordingEnded = Object.keys(modelsToProccess).map(model => {
          let adapter = app.__container__.lookup('service:store').adapterFor(model);
          let queue = adapter.get('queue.queue');
          return queue.length === modelsToProccess[model] + 1;
        }).reduce((p, n) => {
          return p && n;
        }, true);

        if (recordingEnded) {
          window.clearInterval(interval);
          Ember.Test.adapter.asyncEnd();
          Ember.run(null, resolve, true);
        }
      }, 100);
    });
  });

  Ember.Test.registerAsyncHelper('waitForRecordingModel', function(app, model, numberOfRecords = 1) {
    return Ember.Test.promise(function(resolve) {
      Ember.Test.adapter.asyncStart();
      let adapter = app.__container__.lookup('service:store').adapterFor(model);
      let queue = adapter.get('queue.queue');

      let interval = window.setInterval(function() {
        if (queue.length === numberOfRecords + 1) {
          queue[numberOfRecords].then(() => {
            window.clearInterval(interval);
            Ember.Test.adapter.asyncEnd();
            Ember.run(null, resolve, true);
          });
        }
      }, 100);
    });
  });

  Ember.Test.registerAsyncHelper('getLocalforageData', function(app, hash, modelToCheck) {
    return Ember.Test.promise(function(resolve) {
      waitForRecordingAll(hash).then(() => {

        let adapter = app.__container__.lookup('service:store').adapterFor(modelToCheck);
        let queue = adapter.get('queue.queue');
        queue[queue.length - 1]
          .then(() => {
            return window.localforage.getItem("foo");
          })
          .then(records => {
            resolve(records);
          });
      });
    });
  });

}();

export default localforageHelpers;