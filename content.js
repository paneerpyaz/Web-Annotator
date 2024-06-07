let currentTool = null;
let currentColor = 'red';
let annotations = [];
let undoStack = [];
let isDrawing = false;
let startX, startY;
let canvas, ctx;

// function saveAnnotations() {
//   chrome.storage.local.set({ annotations: annotations }, () => {
//     if (chrome.runtime.lastError) {
//       console.error("Error saving annotations:", chrome.runtime.lastError);
//       sendResponse({ status: "error", message: "Error saving annotations" });
//     } else {
//       console.log("Annotations saved successfully");
//       sendResponse({ status: "success", message: "Annotations saved successfully" });
//     }
//   });
// }
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen") {
    activateMarker();
  } else if (message.action === "highlight-btn") {
    currentColor = message.color || 'yellow';
    activateHighlighter();
  } else if (message.action === "undo-btn") {
    undoLastAction();
  }
  else if (message.action === "save") {
    console.log("Saving annotations");
    chrome.runtime.sendMessage({ action: "saveAnnotation", annotat: annotations, high: highlights }, (response) => {
      if (response && response.status === "success") {
        alert("Annotations Saved!");
      }
    });
  }
});

function activateMarker() {
  currentTool = 'pen';
  if (!canvas) {
    createCanvas();
  }
}
function deleteCanvas() {
  if (canvas) {   
    canvas.parentNode.removeChild(canvas);
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('mouseout', stopDrawing);
    canvas = null;
    ctx = null;
    annotations = [];
  }
}
// function stopDrawing() {
//   if (!isDrawing) return;
//   isDrawing = false;
//   if (path.length > 1) {
//     annotations.push({ tool: 'pen', color: currentColor, path: path });
//     undoStack.push({ action: 'add', annotation: annotations[annotations.length - 1] });
//   }
// }
function activateHighlighter() {
  deleteCanvas();
  currentTool = 'text-highlighter';
  document.addEventListener('mouseup', highlightSelection);
}

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  loadAnnotations();
  loadToolState();
}

function startDrawing(e) {
  if (currentTool !== 'pen') return;
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
  path = [{ x: startX, y: startY }];
}
// function SaveToolState() {
//   chrome.storage.local.set({
//     PenStatus: currentTool === 'pen',
//     HighlighterStatus: currentTool === 'highlighter',
//     ColorStatus: currentColor
//   });
// }
function draw(e) {
  if (!isDrawing) return;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 1.0;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();

  annotations.push({ tool: 'pen', color: currentColor, startX, startY, endX: e.clientX, endY: e.clientY });

  startX = e.clientX;
  startY = e.clientY;
  path.push({ x: startX, y: startY });
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  if (path.length > 1) {
    annotations.push({ tool: currentTool, color: currentColor, path: path });
  }
}

function loadAnnotations() {
  chrome.runtime.sendMessage({ action: "loadAnnotations" }, (response) => {
    if (response && response.annotations) {
      annotations = response.annotations;
      redraw();
    }
  });
}

function redraw() {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    annotations.forEach(annotation => {
      if (annotation.tool === 'pen') {
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(annotation.startX, annotation.startY);
        ctx.lineTo(annotation.endX, annotation.endY);
        ctx.stroke();
      } else if (annotation.tool === 'text-highlighter') {
        ctx.fillStyle = annotation.color;
        ctx.fillRect(annotation.rect.left, annotation.rect.top, annotation.rect.width, annotation.rect.height);
      }
    });
  }
}


function highlightSelection() {
  if (currentTool !== 'text-highlighter') return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = currentColor;
    span.id = 'highlight-' + new Date().getTime();
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();

    annotations.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode), id: span.id });
  }
}

function getXPath(element) {
  if (element.id !== '') return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;
  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}
function undoLastAction() {
  if (annotations.length > 0) {
    const lastAnnotation = annotations.pop();
    undoStack.push(lastAnnotation);
    redraw();
    if (lastAnnotation.tool === 'text-highlighter') {
      const parent = document.evaluate(lastAnnotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (parent) {
        const spans = parent.querySelectorAll(`span[id="${lastAnnotation.id}"]`);
        spans.forEach(span => {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
        });
      }
    }
  }
}
