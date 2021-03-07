module.exports = function (config) {
  config.module.rules.forEach(rule => {
    if (rule.test.source === '\\.js$') rule.test = /\.jsx?$/;
  });
  config.resolve.extensions.push('.jsx');
  return config;
};
