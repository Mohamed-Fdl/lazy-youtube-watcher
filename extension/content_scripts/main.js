(() => {
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  const extensionName = "LazyYoutubeWatcher";

  const serverUrl = "ws://localhost:8080";
  let socket = null;

  const ytVideo = document.querySelector("video");
  const ytVideoPageTitle = document.querySelector("title").textContent;
  const ytVideoTitle = extractYoutubeVideoTitleFromPageTitle(ytVideoPageTitle);

  const COMMANDS = {
    SET_AWAKENESS_CHECK: "set.awakeness.check",
    GET_STATUS: "get.status",
    UPDATE_BROWSER_ACTION_UI: "update.browser.action.ui",
    REMOVE_AWAKENESS_CHECK: "remove.awakeness.check",
    SEND_NOTIFICATION: "send.notification",
  };
  const commandHandler = {
    [COMMANDS.SET_AWAKENESS_CHECK]: async (data) => {
      const { interval, start, chatId } = data;

      await setUpWebSocketConnection(chatId);

      window.awakenessCheckSet = data;
      window.awakenessCheckInterval = setInterval(
        () => checkForAwakeness(chatId),
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
      socket.close();
      window.awakenessCheckSet = null;
      console.log("[checking removed]");
      return;
    },
    [COMMANDS.SEND_NOTIFICATION]: (data) => {
      return;
    },
  };

  const SERVER_EVENTS_TO_HANDLE = {
    PAUSE: "pause",
    RESUME: "resume",
  };
  const serverEventsHandler = {
    [SERVER_EVENTS_TO_HANDLE.PAUSE]: (data) => {
      ytVideo.pause();
      return;
    },
    [SERVER_EVENTS_TO_HANDLE.RESUME]: (data) => {
      ytVideo.play();
      return;
    },
  };

  browser.runtime.onMessage.addListener((message) => {
    const { command, data } = message;

    const executor = commandHandler[command];
    executor(data);
  });

  async function checkForAwakeness(chatId) {
    console.log("[checking for awakeness]", chatId);
    if (ytVideo.paused) return;
    ytVideo.pause();
    const notificationData = {
      type: "basic",
      iconUrl: browser.runtime.getURL("icons/96.png"),
      title: extensionName,
      message: getPauseNotificationMessage(ytVideoTitle),
    };
    browser.runtime.sendMessage({
      command: COMMANDS.SEND_NOTIFICATION,
      data: notificationData,
    });
    if (!socket) throw new Error("Fatal: Unable to get ws connection");
    socket.send(
      JSON.stringify({
        event: "check.awakeness",
        data: {
          chatId,
          youtubeVideoLink: window.location.href,
        },
      })
    );

    return;
  }

  async function setUpWebSocketConnection(chatId) {
    socket = new WebSocket(`${serverUrl}/${chatId}`);

    socket.addEventListener("open", (event) => {
      console.log("ws connection ready");
    });

    socket.addEventListener("message", (message) => {
      const { event, data } = JSON.parse(message.data.toString());

      const executor = serverEventsHandler[event];
      executor(data);
    });
  }

  function extractYoutubeVideoTitleFromPageTitle(pageTtitle) {
    return pageTtitle.slice(
      pageTtitle.indexOf(" ") + 1,
      pageTtitle.indexOf("-") - 1
    );
  }

  function getPauseNotificationMessage(youtubeVideoTitle) {
    return `Your video: "${youtubeVideoTitle}" was paused.`;
  }
})();
