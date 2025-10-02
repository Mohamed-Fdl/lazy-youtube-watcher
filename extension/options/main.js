const chatIdInput = document.querySelector("#chat-id");

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    chatId: chatIdInput.value,
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    chatIdInput.value = result.chatId;
  }

  function onError(error) {
    console.error(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get("chatId");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
