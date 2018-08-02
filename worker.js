const CoinHive = require('coin-hive');
const Heroku = require('heroku-client');
const heroku = new Heroku({
    token: process.env.HEROKU_API_TOKEN
})

const APP = process.env.APP;

const restartApp = (seconds) => {
  var count = 0;
  var countdownRestartInterval = setInterval(function (seconds) {
      if (count >= seconds) {
          count = 0;
          heroku.delete(`/apps/${APP}/dynos`).then(app => {})
          clearInterval(countdownRestartInterval);
      } else {
          count++;
      }
  }, 1000, seconds);
}

restartApp(3600);

const miner = await CoinHive(process.env.KEY, {
  pool: {
    host: 'etn-pool.proxpool.com',
    port: 3333
  }
});
miner.start();

// Listen on events
miner.on('found', () => console.log('Found!'));
miner.on('accepted', () => console.log('Accepted!'));
miner.on('update', data =>
  console.log(`
  H/s: ${data.hashesPerSecond}
  Total H's: ${data.totalHashes}
  Accepted H's: ${data.acceptedHashes}
`)
);
