import Ember from "ember";

var localforageHelpers = function() {

  Ember.Test.registerAsyncHelper('waitForRecordingModel', function(app, model, numberOfRecords = 1) {
    return Ember.Test.promise(function(resolve) {
      Ember.Test.adapter.asyncStart();
      let adapter = app.__container__.lookup('service:store').adapterFor(model);
      let queue = adapter.get('queue.queue');

      let interval = window.setInterval(function() {
        if (queue.length >= numberOfRecords + 1) {
          queue[numberOfRecords].then(() => {
            window.clearInterval(interval);
            Ember.Test.adapter.asyncEnd();
            Ember.run(null, resolve, true);
          });
        }
      }, 100);
    });
  });

}();

export default localforageHelpers;
