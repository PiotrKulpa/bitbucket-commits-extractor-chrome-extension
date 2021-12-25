// Initialize butotn with users's prefered color resultContainer
const searchCommitsBtn = document.getElementById('searchCommitsBtn');
const resultContainer = document.getElementById('resultContainer');
const name = document.getElementById('name');
const timestamp = document.getElementById('timestamp');

// loging into extension
searchCommitsBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
  });

  chrome.storage.local.set({ name: name.value });
  chrome.storage.local.set({ timestamp: timestamp.value });

  chrome.storage.local.get(['commitList'], function ({ commitList }) {

    commitList.map(({id, }) => {
      
      const p = document.createElement("p");
      p.innerHTML = `<a href=${id}>${id}</a>`;
      resultContainer.appendChild(p);
    })
  });

});

// loging into page
const setPageBackgroundColor = () => {
  try {
    const commitNodeList = document.querySelectorAll('[data-commit-json]');
    chrome.storage.local.get(['name', 'timestamp'], function ({ name, timestamp }) {
      const extractedYear = parseInt(timestamp.split('-')[0], 10) || 0;
      const extractedMonth = parseInt(timestamp.split('-')[1], 10) || 0;

      const links = Array.from(commitNodeList)
        ?.map((el) => JSON.parse(el.dataset.commitJson))
        ?.filter((el) => {
          const currentMonth = new Date(el.committerTimestamp).getMonth() + 1;
          const currentYear = new Date(el.committerTimestamp).getFullYear();
  
          return el.author.displayName === name 
            && extractedYear === currentYear 
            && extractedMonth === currentMonth;
        });
  
      console.log(links);
      chrome.storage.local.set({ commitList: links });
  
    });
  } catch(e) {
    console.warn(e);
  }
}
