(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const COMMANDS = {
    SET_AWAKENESS_CHECK: "set.awakeness.check",
    GET_STATUS: "get.status",
    UPDATE_BROWSER_ACTION_UI: "update.browser.action.ui",
    REMOVE_AWAKENESS_CHECK: "remove.awakeness.check",
  };
  const commandHandler = {
    [COMMANDS.SET_AWAKENESS_CHECK]: (data) => {
      const { interval, start, chatId } = data;

      window.awakenessCheckSet = data;
      window.awakenessCheckInterval = setInterval(
        () =>
          console.log(
            `[checking set for ${chatId} started at ${new Date().getDate(
              start
            )} each ${interval} minutes]`
          ),
        interval * 1000
      );

      return;
    },
    [COMMANDS.GET_STATUS]: (data) => {
      if (window.awakenessCheckSet) {
        browser.runtime.sendMessage({
          command: COMMANDS.UPDATE_BROWSER_ACTION_UI,
          data: { interval: window.awakenessCheckSet.interval },
        });
      }

      return;
    },
    [COMMANDS.UPDATE_BROWSER_ACTION_UI]: (data) => {
      return;
    },
    [COMMANDS.REMOVE_AWAKENESS_CHECK]: (data) => {
      clearInterval(window.awakenessCheckInterval);
      window.awakenessCheckSet = null;
      console.log("[checking removed]");
      return;
    },
  };

  browser.runtime.onMessage.addListener((message) => {
    const { command, data } = message;

    const executor = commandHandler[command];
    executor(data);
  });
})();
