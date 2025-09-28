const awakenessCheckForm = document.getElementById("settings-form");
const successMessage = document.getElementById("success-message");
const infoMessage = document.getElementById("info-message");
const intervalInfoMessage = document.getElementById("interval-info");
const errorContent = document.getElementById("error-content");
const removeCheckButton = document.getElementById("remove-check");

const COMMANDS = {
  SET_AWAKENESS_CHECK: "set.awakeness.check",
  GET_STATUS: "get.status",
  UPDATE_BROWSER_ACTION_UI: "update.browser.action.ui",
  REMOVE_AWAKENESS_CHECK: "remove.awakeness.check",
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

    const chatIdInput = document.getElementById("chatId");
    const intervalInput = document.getElementById("interval");

    const chatId = chatIdInput.value;
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
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute content script: ${error.message}`, error);
}

browser.tabs
  .executeScript({ file: "/content_scripts/main.js" })
  .then(sendStatusRequest)
  .then(listenForAwakenessCheckFormSubmission)
  .then(listenForRemoveCheckButtonClick)
  .catch(reportExecuteScriptError);
