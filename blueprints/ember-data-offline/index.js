module.exports = {
  description: 'main',
  normalizeEntityName: function() {},
  afterInstall: function() {
    var _this = this;
    return this.addAddonToProject({
      name: "ember-moment",
      target: "2.0.1"
    }).then(function() {
      return _this.addAddonToProject({
        name: "ember-localforage-adapter",
        target: "git+https://github.com/igorrKurr/ember-localforage-adapter.git"
      });
    });
  }
};
