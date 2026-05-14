const cron = require('node-cron');

cron.schedule('* * * * *', () => {
  // run reminder checks every minute (stub)
  console.log('running reminder job (stub)');
});
