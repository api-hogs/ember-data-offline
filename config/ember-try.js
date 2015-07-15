module.exports = {
  scenarios: [
    {
      name: 'default',
      dependencies: { }
    },
    {
      name: 'ember-data-release',
      dependencies: {
        'ember': 'components/ember#release',
        'ember-data': 'components/ember-data#release'
      },
      resolutions: {
        'ember': 'release',
        'ember-data': 'release',
      }
    },
    {
      name: 'ember-data-canary',
      dependencies: {
        'ember': 'components/ember#canary',
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember': 'canary',
        'ember-data': 'canary'
      }
    }
  ]
};
