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
document.getElementById('highlight-btn').addEventListener('click', () => {
  document.getElementById('color-container').style.display = 'flex';
});
document.querySelectorAll('.color-btn').forEach(button => {
  button.addEventListener('click', () => {
    currentColor = button.getAttribute('data-color');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "highlight-btn", color: currentColor });
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const highlightBtn = document.getElementById('highlight-btn');
  const colorContainer = document.getElementById('color-container');

  // Show color container when highlight button is hovered
  highlightBtn.addEventListener('mouseover', function() {
    colorContainer.style.display = 'block';
  });

  // Hide color container when mouse leaves the color container
  colorContainer.addEventListener('mouseleave', function() {
    colorContainer.style.display = 'none';
  });
});
