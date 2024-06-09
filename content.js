let startX, startY, path;
let canvas, ctx;
let ClickTime;

let currentTool = null;
let currentColor = 'red';

let annotations = [];
let highlights = [];
let Actions = [];

let isDrawing = false;
let tool_used = 2;
let TextSelecting = false;
let MouseMovedOrNot = false;

function createCanvas() {
  canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  loadAnnotations();
  loadToolState();
}

function undoLastHighlight() {
  if (highlights.length > 0) {
    const lastHighlight = highlights.pop();
    const span = document.querySelector(`span[highlight-id="${lastHighlight.id}"]`);
    if (span) {
      span.replaceWith(document.createTextNode(span.textContent));
      Actions.push(2);
      console.log("Last highlight undone");
    }
  }
}

function resizeCanvasByRatio(ratio) {
  const newWidth = window.innerWidth * ratio;
  const newHeight = window.innerHeight * ratio;
  canvas.width = newWidth;
  canvas.height = newHeight;
  console.log(`Canvas resized to ${newWidth}x${newHeight}`);
}

function confirmClearAllHighlights() {
  const confirmation = confirm("Are you sure you want to clear all highlights?");
  if (confirmation) {
    highlights = [];
    document.querySelectorAll('span[highlight-id]').forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent));
    });
    console.log("All highlights cleared");
  }
}

function changePenToolWidth(width) {
  ctx.lineWidth = width;
  console.log(`Pen tool width changed to ${width}`);
}

function changeHighlightColor(highlightId, newColor) {
  const highlight = highlights.find(h => h.id === highlightId);
  if (highlight) {
    highlight.color = newColor;
    const span = document.querySelector(`span[highlight-id="${highlightId}"]`);
    if (span) {
      span.style.backgroundColor = newColor;
      console.log(`Highlight color changed to ${newColor} for highlight ID ${highlightId}`);
    }
  }
}
function handleMouseDown(e) {
  if (currentTool === 'pen') {
    startDrawing(e);
  } else if (currentTool === 'highlighter') {
    TextSelecting = true;
    MouseMovedOrNot = false;
  }
}

function clearAllAnnotationsAndHighlights() {
  annotations = [];
  highlights = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelectorAll('span[highlight-id]').forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  console.log("All annotations and highlights cleared");
}

function handleMouseMove(e) {
  if (currentTool === 'pen' && isDrawing) {
    draw(e);
  } else if (TextSelecting) {
    MouseMovedOrNot = true;
  }
}

function handleMouseUp(e) {
  if (currentTool === 'pen' && isDrawing) {
    stopDrawing(currentColor);
  } else if (currentTool === 'highlighter' && TextSelecting) {
    TextSelecting = false;
    if (MouseMovedOrNot) {
      clearTimeout(ClickTime);
      ClickTime = setTimeout(() => {
        startHighlighting();
      }, 200);
    }
  }
}

function clearAllAnnotationsAndHighlights() {
  annotations = [];
  highlights = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelectorAll('span[highlight-id]').forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  console.log("All annotations and highlights cleared");
}

function startDrawing(e) {
  canvas.style.pointerEvents = 'auto';
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
  path = [{ x: startX, y: startY }];
}
function exportAnnotationsAsJSON() {
  const data = JSON.stringify({ annotations, highlights });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'annotations.json';
  link.click();
  console.log("Annotations exported as JSON");
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

  startX = e.clientX;
  startY = e.clientY;
  path.push({ x: startX, y: startY });
}

function stopDrawing(color) {
  if (!isDrawing) return;
  isDrawing = false;
  if (path.length > 1) {
    Actions.push(1);
    annotations.push({ tool: 'pen', color: color, path: path });
  }
}

function WrapTheText(color, notes) {
  let selection = window.getSelection();
  if (selection.rangeCount > 0) {
    let range = selection.getRangeAt(0);
    let span = document.createElement('span');
    span.style.backgroundColor = color;
    span.setAttribute('highlight-id', Date.now()); 
    range.surroundContents(span);
    Actions.push(2);
    highlights.push({ span: span.outerHTML, range: range.toString(), color: color, id: span.getAttribute('highlight-id'), note: notes });
  }
}

function startHighlighting() {
  if (currentTool === 'highlighter') {
    let note = prompt("Enter a note for this highlight:");
    WrapTheText(currentColor, note);
  }
}

function loadAnnotations() {
  chrome.runtime.sendMessage({ action: "loadAnnotations" }, (response) => {
    if (response && response.annotations) {
      annotations = response.annotations;
      highlights = response.highlights;
      tool_used = 2;
      redraw(tool_used);
    } else {
      console.log("No annotations found");
    }
  });
}
function rotateCanvasContent(angle) {
  const radians = angle * (Math.PI / 180);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
  console.log(`Canvas content rotated by ${angle} degrees`);
}
function loadToolState() {
  chrome.storage.local.get(['PenStatus', 'HighlighterStatus', 'ColorStatus'], (result) => {
    if (result.PenStatus === true) {
      currentTool = 'pen';
      canvas.style.pointerEvents = 'auto';
      currentColor = result.ColorStatus || '#FFFF00';
    } else if (result.HighlighterStatus === true) {
      currentTool = 'highlighter';
      canvas.style.pointerEvents = 'none';
      currentColor = result.ColorStatus || '#FFFF00';
    } else {
      currentTool = null;
      canvas.style.pointerEvents = 'none';
      currentColor = result.ColorStatus || '#FFFF00';
    }
  });
}

function redraw(tool_used) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (tool_used === 2 || tool_used === 1) {
    highlights.forEach(highlight => {
      let span = document.createElement('span');
      span.innerHTML = highlight.range;
      span.style.backgroundColor = highlight.color;
      span.setAttribute('highlight-id', highlight.id);
      let bodyText = document.body.innerHTML;
      let highlightedText = bodyText.replace(highlight.range, span.outerHTML);
      document.body.innerHTML = highlightedText;
    });
  }
  if (tool_used === 2 || tool_used === 1) {
    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1.0;
      ctx.lineCap = 'round';
      const paths = annotation.path;
      for (let i = 1; i < paths.length; i++) {
        ctx.beginPath();
        ctx.moveTo(paths[i - 1].x, paths[i - 1].y);
        ctx.lineTo(paths[i].x, paths[i].y);
        ctx.stroke();
      }
    });
  }
}

createCanvas();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen") {
    currentTool = message.status2 ? 'pen' : null;
    canvas.style.pointerEvents = message.status2 ? 'auto' : 'none';
  } else if (message.action === "highlighter") {
    currentTool = message.status1 ? 'highlighter' : null;
    canvas.style.pointerEvents = message.status1 ? 'none' : 'none';
    if (currentTool === 'highlighter') {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  } else if (message.action === "color") {
    currentColor = message.color;
  } else if (message.action === "save") {
    chrome.runtime.sendMessage({ action: "saveAnnotation", annotat: annotations, high: highlights }, (response) => {
      if (response && response.status === "success") {
        alert("Annotations have been Saved!");
      }
    });
  } else if (message.action === "undo") {
    tool_used = 1;
    const currentAction = Actions.pop();
    if (currentAction === 1) {
      if (annotations.length > 0) {
        const lastAnnotation = annotations.pop();
        redraw(tool_used);
      }
    } else if (currentAction === 2) {
      if (highlights.length > 0) {
        const lastHighlight = highlights.pop();
        const span = document.querySelector(`span[highlight-id="${lastHighlight.id}"]`);
        if (span) {
          span.replaceWith(document.createTextNode(span.textContent));
        }
        redraw(tool_used);
      }
    }
  }
});
document.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN' && event.target.hasAttribute('highlight-id')) {
    let highlightId = event.target.getAttribute('highlight-id');
    let highlight = highlights.find(h => h.id === highlightId);
    if (highlight && highlight.note) {
      alert(`Note: ${highlight.note}`);
    }
  }
});
