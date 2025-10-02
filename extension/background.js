let NOTIFICATION_KEY = "send.notification";

browser.runtime.onMessage.addListener((message) => {
  try {
    const { command, data } = message;

    if (!(command === NOTIFICATION_KEY)) return;
    browser.notifications.create(data);
  } catch (error) {}
});
