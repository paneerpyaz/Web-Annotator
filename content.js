// let currentTool = 'pen';
// let currentColor = '#FF0000';
// let annotations = [];
// let isDrawing = false;
// let startX, startY;
// let canvas, ctx;

// // Listen for messages from the extension
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('Received message:', message); // Debug logging
//   if (message.action === "pen") {
//     activateMarker();
//   } else if (message.action === "highlight-btn") {
//     activateHighlighter();
//   } else if (message.action === "save-btn") {
//     saveAnnotations();
//   } else if (message.action === "undo-btn") {
//     console.log('Undo action triggered'); // Debug logging
//     undoLastAction();
//   }
// });

// function activateMarker() {
//   currentTool = 'pen';
//   if (!canvas) {
//     createCanvas();
//   }
// }

// function activateHighlighter() {
//   currentTool = 'text-highlighter';
//   document.addEventListener('mouseup', highlightSelection);
// }

// function createCanvas() {
//   canvas = document.createElement('canvas');
//   canvas.style.position = 'absolute';
//   canvas.style.top = '0';
//   canvas.style.left = '0';
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   document.body.appendChild(canvas);
//   ctx = canvas.getContext('2d');

//   canvas.addEventListener('mousedown', startDrawing);
//   canvas.addEventListener('mousemove', draw);
//   canvas.addEventListener('mouseup', stopDrawing);
//   canvas.addEventListener('mouseout', stopDrawing);

//   // loadAnnotations();
// }

// function startDrawing(e) {
//   isDrawing = true;
//   startX = e.clientX;
//   startY = e.clientY;
// }

// function draw(e) {
//   if (!isDrawing) return;

//   ctx.strokeStyle = currentColor;
//   ctx.lineWidth = currentTool === 'pen' ? 2 : 10;
//   ctx.lineCap = 'round';
//   ctx.globalAlpha = currentTool === 'highlighter' ? 0.3 : 1.0;

//   ctx.beginPath();
//   ctx.moveTo(startX, startY);
//   ctx.lineTo(e.clientX, e.clientY);
//   ctx.stroke();

//   startX = e.clientX;
//   startY = e.clientY;
// }

// function stopDrawing() {
//   if (!isDrawing) return;
//   isDrawing = false;
//   annotations.push({ tool: currentTool, color: currentColor, startX, startY, endX: startX, endY: startY });
// }

// function highlightSelection() {
//   const selection = window.getSelection();
//   if (!selection.isCollapsed) {
//     const range = selection.getRangeAt(0);
//     const span = document.createElement('span');
//     span.style.backgroundColor = 'yellow';
//     span.appendChild(range.extractContents());
//     range.insertNode(span);

//     selection.removeAllRanges();

//     annotations.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode) });
//   }
// }

// function getXPath(element) {
//   if (element.id !== '') return 'id("' + element.id + '")';
//   if (element === document.body) return element.tagName;
//   let ix = 0;
//   const siblings = element.parentNode.childNodes;
//   for (let i = 0; i < siblings.length; i++) {
//     const sibling = siblings[i];
//     if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
//     if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
//   }
// }

// function redraw() {
//   if (ctx) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     annotations.forEach(annotation => {
//       if (annotation.tool === 'pen') {
//         ctx.strokeStyle = annotation.color;
//         ctx.lineWidth = annotation.tool === 'pen' ? 2 : 10;
//         ctx.globalAlpha = annotation.tool === 'highlighter' ? 0.3 : 1.0;
//         ctx.beginPath();
//         ctx.moveTo(annotation.startX, annotation.startY);
//         ctx.lineTo(annotation.endX, annotation.endY);
//         ctx.stroke();
//       } else if (annotation.tool === 'text-highlighter') {
//         const parent = document.evaluate(annotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//         if (parent) {
//           const tempDiv = document.createElement('div');
//           tempDiv.innerHTML = annotation.html;
//           parent.appendChild(tempDiv.firstChild);
//         }
//       }
//     });
//   }
// }

// function undoLastAction() {
//   if (annotations.length === 0) {
//     console.log('No annotations to undo'); // Debug logging
//     return;
//   }
//   const lastAnnotation = annotations.pop();
//   console.log('Last annotation:', lastAnnotation); // Debug logging
//   if (lastAnnotation.tool === 'pen') {
//     redraw();
//   } else if (lastAnnotation.tool === 'text-highlighter') {
//     const parent = document.evaluate(lastAnnotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//     if (parent) {
//       const span = parent.querySelector(`span[style="background-color: yellow;"]`);
//       if (span) {
//         const text = document.createTextNode(span.textContent);
//         span.parentNode.replaceChild(text, span);
//       }
//     }
//   }
// }




// let annotations = [];

// // Listen for messages from the extension
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('Received message:', message); // Debug logging
//   if (message.action === "highlight-btn") {
//     activateHighlighter();
//   } else if (message.action === "undo-btn") {
//     console.log('Undo action triggered'); // Debug logging
//     undoLastAction();
//   }
// });

// function activateHighlighter() {
//   document.addEventListener('mouseup', highlightSelection);
// }

// function highlightSelection() {
//   const selection = window.getSelection();
//   if (!selection.isCollapsed) {
//     const range = selection.getRangeAt(0);
//     const span = document.createElement('span');
//     span.style.backgroundColor = 'yellow';
//     span.appendChild(range.extractContents());
//     range.insertNode(span);

//     selection.removeAllRanges();

//     annotations.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode) });
//     console.log('Annotation added:', annotations); // Debug logging
//   }
// }

// function getXPath(element) {
//   if (element.id !== '') return 'id("' + element.id + '")';
//   if (element === document.body) return element.tagName;
//   let ix = 0;
//   const siblings = element.parentNode.childNodes;
//   for (let i = 0; i < siblings.length; i++) {
//     const sibling = siblings[i];
//     if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
//     if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
//   }
// }

// function undoLastAction() {
//   if (annotations.length === 0) {
//     console.log('No annotations to undo'); // Debug logging
//     return;
//   }

//   const lastAnnotation = annotations.pop();
//   console.log('Last annotation:', lastAnnotation); // Debug logging

//   if (lastAnnotation.tool === 'text-highlighter') {
//     const parent = document.evaluate(lastAnnotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//     if (parent) {
//       const spans = parent.querySelectorAll('span[style="background-color: yellow;"]');
//       for (const span of spans) {
//         if (span.outerHTML === lastAnnotation.html) {
//           const text = document.createTextNode(span.textContent);
//           span.parentNode.replaceChild(text, span);
//           break; // Break after removing the matching span
//         }
//       }
//     }
//   }
// }


let currentTool = 'pen';
let currentColor = '#FF0000';
let annotations = [];
let isDrawing = false;
let startX, startY;
let canvas, ctx;

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message); // Debug logging
  if (message.action === "pen") {
    activateMarker();
  } else if (message.action === "highlight-btn") {
    activateHighlighter();
  } else if (message.action === "undo-btn") {
    console.log('Undo action triggered'); // Debug logging
    undoLastAction();
  }
});

function activateMarker() {
  currentTool = 'pen';
  if (!canvas) {
    createCanvas();
  }
}

function activateHighlighter() {
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
}

function startDrawing(e) {
  if (currentTool !== 'pen') return;
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
}

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
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
}

function highlightSelection() {
  if (currentTool !== 'text-highlighter') return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();

    annotations.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode) });
    console.log('Annotation added:', annotations); // Debug logging
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
  if (annotations.length === 0) {
    console.log('No annotations to undo'); // Debug logging
    return;
  }

  // const lastAnnotation = annotations.top();
  annotations.pop();
  annotations.pop();
  console.log('Last annotation:', lastAnnotation); // Debug logging

  if (lastAnnotation.tool === 'pen') {
    redrawCanvas();
  } else if (lastAnnotation.tool === 'text-highlighter') {
    const parent = document.evaluate(lastAnnotation.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (parent) {
      const spans = parent.querySelectorAll('span[style="background-color: yellow;"]');
      for (const span of spans) {
        if (span.outerHTML === lastAnnotation.html) {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
          break; // Break after removing the matching span
        }
      }
    }
  }
}

function redrawCanvas() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  annotations.forEach(annotation => {
    if (annotation.tool === 'pen') {
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      ctx.moveTo(annotation.startX, annotation.startY);
      ctx.lineTo(annotation.endX, annotation.endY);
      ctx.stroke();
    }
  });
}
