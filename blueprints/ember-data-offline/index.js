module.exports = {
  description: 'main',

  afterInstall: function() {
    this.addAddonToProject({name: "ember-localforage-adapter", target: "git+https://github.com/igorrKurr/ember-localforage-adapter.git"});
  }
};
