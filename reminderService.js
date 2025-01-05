const schedule = require("node-schedule");
const notificationService = require("./notificationService");
const User = require("../models/user");

const setupReminderJobs = async () => {
  // Get all users with reminders
  const users = await User.find({ "alignerReminders.enabled": true });

  users.forEach((user) => {
    user.alignerReminders.times.forEach((time) => {
      schedule.scheduleJob(time, async () => {
        await notificationService.sendReminderNotification(
          user,
          time.type // 'wear' or 'remove'
        );
      });
    });
  });
};

module.exports = { setupReminderJobs };
