const schedule = require("node-schedule");
const notificationService = require("./notificationService");
const User = require("../models/user");

const setupReminderJobs = async () => {
  const users = await User.find({ "alignerReminders.enabled": true });

  users.forEach((user) => {
    user.alignerReminders.times.forEach((reminderTime) => {
      schedule.scheduleJob(reminderTime.time, async () => {
        await notificationService.sendReminderNotification(
          user,
          reminderTime.type
        );
      });
    });
  });
};

module.exports = { setupReminderJobs };
