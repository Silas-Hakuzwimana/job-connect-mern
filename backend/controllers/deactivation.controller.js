const cron = require('node-cron');
const Job = require('../models/Job');

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    await Job.updateMany({ isActive: true, deadline: { $lte: now } }, { isActive: false });
    console.log('Expired jobs deactivated');
  } catch (err) {
    console.error('Error deactivating jobs:', err);
  }
});
