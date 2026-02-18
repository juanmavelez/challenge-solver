document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');

  // Load saved key
  chrome.storage.local.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save key
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      status.textContent = 'Settings saved!';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });
});
