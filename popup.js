document.getElementById('pen').addEventListener('click',()=>{
  chrome.tabs.query({active: true,currentWindow: true},(tabs)=>{
    chrome.tabs.sendMessage(tabs[0].id,{action: "pen"});
  });
});

document.getElementById('highlight-btn').addEventListener('click',()=>{
  chrome.tabs.query({active: true,currentWindow: true},(tabs)=>{
    chrome.tabs.sendMessage(tabs[0].id,{action: "highlight-btn"});
  });
});
document.getElementById('save-btn').addEventListener('click',()=>{
  chrome.tabs.query({active: true,currentWindow: true},(tabs)=>{
    chrome.tabs.sendMessage(tabs[0].id,{action: "save-btn"});
  });
}); 
document.getElementById('undo-btn').addEventListener('click',()=>{
  chrome.tabs.query({active: true,currentWindow: true},(tabs)=>{
    chrome.tabs.sendMessage(tabs[0].id,{action: "undo-btn"});
  });
});
document.getElementById('erase').addEventListener('click',()=>{
  chrome.tabs.query({active: true,currentWindow: true},(tabs)=>{
    chrome.tabs.sendMessage(tabs[0].id,{action: "erase"});
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const penBtn = document.getElementById('pen-btn');
  const highlightBtn = document.getElementById('highlight-btn');
  const undoBtn = document.getElementById('undo-btn');
  const erasebtn = document.getElementById('erase');

  if (penBtn) {
    penBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'pen' });
    });
  }

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'highlight-btn' });
    });
  }

  if (undoBtn) {
    undoBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'undo-btn' });
    });
  }
  if(erasebtn){
    erase.addEventListener('click',()=>{
      chrome.runtime.sendMessage({action : 'erase'});
    });
  }
});
