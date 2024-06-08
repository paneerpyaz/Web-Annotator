document.addEventListener('DOMContentLoaded',()=>{
  let c1 = false;
  let c2 = false;
  let c3 = "#FFFFFF";
  function UpdateButton(){
    document.getElementById('pen').style.backgroundColor = c1 ? '#D4D4D4' : 'FFFFFF';
    document.getElementById('highlighter').style.backgroundColor = c2 ? '#D4D4D4' : 'FFFFFF';
    document.getElementById('color-palette').value = c3.toString();
  }
  document.getElementById('pen').addEventListener('click', () => {
    c1=!c1;
    c2=false;
    console.log(c1);
    chrome.storage.local.set({ c1, c2, c3});
    UpdateButton();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "pen" , status1 : c2,status2 : c1});
      } else {
        console.error("No active tab found");
      }
    });
  });
  document.getElementById('highlighter').addEventListener('click', () => {
    c2=!c2;
    c1=false;
    chrome.storage.local.set({ c1, c2, c3 });
    UpdateButton();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "highlighter" , status1 : c2,status2 : c1});
      } else {
        console.error("No active tab found");
      }
    });
  });
  chrome.storage.local.get(['c1', 'c2','c3'], (result) => {
    c1 = result.c1 || false;
    c2 = result.c2 || false;
    c3 = result.c3 || '#FFFF00';
    UpdateButton();
  });
  document.getElementById('color-palette').addEventListener('change', (event) => {
    const selectedColor=event.target.value;
    c3 = selectedColor;
    chrome.storage.local.set({ c1, c2, c3 });
    UpdateButton();
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "color", color: selectedColor});
      } else {
        console.error("No active tab found");
      }
    });
  });

  document.getElementById('save').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "save"});
      } else {
        console.error("No active tab found");
      }
    });
  });
  document.getElementById('undo').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        console.log("Sending 'undo' action to content script");
        chrome.tabs.sendMessage(tabs[0].id, {action: "undo"});
      } else {
        console.error("No active tab found");
      }
    });
  });
});
  