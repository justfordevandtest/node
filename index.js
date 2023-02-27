const config = require('./src/environment/config');
const app = require('./src/controller/express/app');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is up on port ${config.port}`);
});
