const popupContent = document.getElementById("popup-content");
const awakenessCheckForm = document.getElementById("settings-form");
const successMessage = document.getElementById("success-message");
const infoMessage = document.getElementById("info-message");
const intervalInfoMessage = document.getElementById("interval-info");
const errorContent = document.getElementById("error-content");
const removeCheckButton = document.getElementById("remove-check");

const youtubeVideoPagePrefix = "https://www.youtube.com/watch?v=";
const pageUrl = window.location.href;

const COMMANDS = {
  SET_AWAKENESS_CHECK: "set.awakeness.check",
  GET_STATUS: "get.status",
  UPDATE_BROWSER_ACTION_UI: "update.browser.action.ui",
  REMOVE_AWAKENESS_CHECK: "remove.awakeness.check",
  SEND_NOTIFICATION: "send.notification",
  DISABLE_EXTENSION: "disable.extension",
};
const commandHandler = {
  [COMMANDS.SET_AWAKENESS_CHECK]: (data) => {
    return;
  },
  [COMMANDS.GET_STATUS]: (data) => {
    return;
  },
  [COMMANDS.UPDATE_BROWSER_ACTION_UI]: (data) => {
    const { interval } = data;
    awakenessCheckForm.style.display = "none";
    infoMessage.style.display = "block";
    intervalInfoMessage.textContent = `${interval}`;

    return;
  },
  [COMMANDS.REMOVE_AWAKENESS_CHECK]: (data) => {
    return;
  },
  [COMMANDS.SEND_NOTIFICATION]: (data) => {
    return;
  },
  [COMMANDS.DISABLE_EXTENSION]: (data) => {
    popupContent.style.display = "none";
    errorContent.style.display = "block";
    errorContent.textContent =
      "Use this extension when you are wayching a youtube video";

    return;
  },
};

browser.runtime.onMessage.addListener((message) => {
  const { command, data } = message;

  const executor = commandHandler[command];
  executor(data);
});

async function getTabs() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs;
}

async function sendStatusRequest() {
  const tabs = await getTabs();
  browser.tabs.sendMessage(tabs[0].id, {
    command: COMMANDS.GET_STATUS,
    data: null,
  });
}

function listenForAwakenessCheckFormSubmission() {
  awakenessCheckForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    successMessage.style.display = "none";
    errorContent.style.display = "none";

    const intervalInput = document.getElementById("interval");

    const message = await browser.storage.sync.get("chatId");

    const chatId = message.chatId;
    const interval = parseInt(intervalInput.value);

    if (!(chatId && interval)) {
      errorContent.style.display = "block";
      errorContent.textContent = "Invalid data provided";
      return;
    }

    successMessage.style.display = "block";
    successMessage.textContent = "Settings saved successfully!";
    awakenessCheckForm.style.display = "none";

    const awakenessSettings = {
      start: Date.now(),
      chatId: chatId,
      interval: interval,
    };

    const tabs = await getTabs();
    browser.tabs.sendMessage(tabs[0].id, {
      command: COMMANDS.SET_AWAKENESS_CHECK,
      data: awakenessSettings,
    });
  });
}

function listenForRemoveCheckButtonClick() {
  removeCheckButton.addEventListener("click", async (e) => {
    awakenessCheckForm.style.display = "none";
    infoMessage.style.display = "none";
    errorContent.style.display = "none";
    successMessage.style.display = "block";
    successMessage.textContent = "Check removed successfully!";

    const tabs = await getTabs();
    browser.tabs.sendMessage(tabs[0].id, {
      command: COMMANDS.REMOVE_AWAKENESS_CHECK,
      data: null,
    });
  });
}

function reportExecuteScriptError(error) {
  popupContent.style.display = "none";
  errorContent.style.display = "block";
  errorContent.textContent = error.message;
  console.error(`Failed to execute content script: ${error.message}`, error);
  return;
}

browser.tabs
  .executeScript({ file: "/content_scripts/main.js" })
  .then(sendStatusRequest)
  .then(listenForAwakenessCheckFormSubmission)
  .then(listenForRemoveCheckButtonClick)
  .catch(reportExecuteScriptError);
