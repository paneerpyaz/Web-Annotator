# Web Annotator

**Author:** Siddhant Rohila 22115144

## Abstract

The Web Annotator Chrome extension is designed to enhance users' interaction with web content through a suite of powerful annotation tools. This extension allows users to highlight text on any webpage using customizable, color-coded highlights, enabling efficient categorization and organization of significant sections.

Additionally, users can attach contextual notes to highlighted content, facilitating the addition of personal insights, comments, or supplementary information for future reference. One of the key features of this extension is the persistence of annotations across browser sessions, ensuring that users can revisit annotated pages with their highlights and notes intact even after closing and reopening the browser.

This project report provides an overview of my project's architecture, features, implementation details, and the technologies used. It highlights the motivation behind the project, the challenges addressed, the novelty and application innovation, as well as the future directions for development.

This extension has a variety of applications, it may be used in teaching sessions, self notes, for a meaningful explanation to others and many more. I've tried my best to make it robust and working for all systems across different screen sizes and resolutions.

## Table of Contents

1. [Introduction](#introduction)
2. [How a Chrome Extension is Created?](#how-a-chrome-extension-is-created)
3. [Implementation](#implementation)
4. [Concluding Remarks](#concluding-remarks)

## Introduction

- **But what is a Web Annotator?**

  A web annotator, in this context, is a Chrome extension that enhances user engagement with online content by offering tools for highlighting and annotating text on any webpage. It allows users to mark key sections with customizable color-coded highlights and add personal notes for additional context. These annotations are saved and persist across browser sessions, ensuring users can access their work anytime. The extension also provides features like keyboard shortcuts and a responsive design for optimal use on various devices. It aims to boost efficiency and organization for researchers, students, and professionals.

- **Motivation of Project:**

  As soon as Tinkering Labs released this project, I thought of starting with my hands-on web development experience since I've never tried it before. It was a fun task and I learned many things while executing it. Also, this project is quite useful for teachers as well as students to explain and understand the concepts available online well. I also wanted to enhance my JavaScript skills by implementing a variety of functions which was fulfilled by working on this project. I have never developed a Chrome extension hence I was excited about making this.

- **Application Domain:**

  1. **Education**: Enhancing the learning experience for students and educators by allowing them to highlight and annotate online course materials, academic papers, and e-books.
  2. **Research**: Assisting researchers in efficiently marking and taking notes on online journals, articles, and other digital resources, facilitating better organization and retrieval of information.
  3. **Professional Use**: Helping professionals in various fields to annotate and review online reports, documents, and resources, improving productivity and collaboration.
  4. **Personal Knowledge Management**: Aiding individuals in bookmarking, highlighting, and annotating web content for personal projects, interests, or daily reading, promoting better knowledge retention and organization.
  5. **Collaborative Work**: Supporting collaborative annotation and sharing among teams, enabling better communication and idea exchange in academic, professional, and personal contexts.

## How a Chrome Extension is Created?

A typical Chrome extension is created by the numerous files, and it is further loaded unpacked in the developer mode. These files are as follows:

1. **The Manifest File (manifest.json)**:
   
   The manifest file is a JSON file that provides essential information about the extension. It includes details such as the extension's name, version, description, permissions (e.g., access to tabs, storage, and web requests), content scripts, background scripts, icons, and more. It serves as the roadmap for Chrome to understand how the extension should behave and what resources it requires. Hence it is the first file ever to be created when making an extension!

2. **Background Script (background.js)**:
   
   The background script runs in the background and is responsible for managing the extension's core functionality. It's specified in the manifest file under the "background" key. This script can listen for events such as tab changes, browser actions, and network requests. It's also used to maintain the extension's state and handle tasks that don't require user interaction.

3. **Content Script (content.js)**:
   
   Content scripts are injected into web pages based on specified URL patterns defined in the manifest file. These scripts can interact with the DOM of the web page, modify its content, and communicate with the background script using message passing. Content scripts are often used to enhance or modify the behavior of specific web pages to provide additional functionality.

4. **Popup HTML (popup.html) and Popup Script (popup.js)**:
   
   If your extension has a browser action or page action that displays a popup when clicked, you'll need a popup.html file to define the structure of the popup and a popup.js file to handle its logic. The popup can contain UI elements such as buttons, input fields, or other interactive components. The popup script can interact with the background script and perform actions based on user input.

5. **Icons and Other Assets**:
   
   Icons are crucial for representing the extension in the Chrome Web Store and in the browser toolbar. The manifest file specifies various icon sizes for different use cases. Additionally, you may include other assets such as images or CSS files for styling your extension's UI.

The interaction between the components of a Chrome extension is essential for its seamless operation. Figures 1 and 2 will help for a better understanding as they visually demonstrate how a Chrome extension works.

![Architecture Overview](images/archi.jpg)
*Figure 1: Architecture Overview*

![Flowchart](./images/flowchart.jpeg)
*Figure 2: Flowchart*

## Implementation

This project solely uses the following tech stacks:

1. **HTML**:
   
   Utilized for creating the structure and layout of the buttons and containers.

2. **CSS**:
   
   Employed for styling the buttons, containers, and defining their appearance, including hover and active states.

3. **JavaScript**:
   
   Instrumental in implementing the functionality of the buttons, such as pen drawing, text highlighting, undoing actions, and saving.

### How does the extension look?

Initially, the extension looks like this:

![Basic layout of the extension](./images/9.png)
*Figure 3: Basic layout of the extension*

This is the default color picker of HTML, I used it since it has a wide range of colors and the user can select them as per convenience.

![Color selection](./images/8.png)
*Figure 4: Color selection*

### Functionality Implementation

- **Pen Functionality**: The `pen-btn` and `pen` classes are utilized for styling the button representing the pen tool. The pen functionality in this project is implemented through a series of JavaScript functions and event listeners that enable drawing on the canvas using the mouse. Let's review the relevant parts of the code to understand how the pen functionality is implemented:

  1. **Event Listeners**:
     
     - `canvas.addEventListener('mousedown', startDrawing)`: This event listener triggers the `startDrawing` function when the mouse button is pressed down on the canvas, signaling the beginning of a drawing action.
     - `canvas.addEventListener('mousemove', draw)`: When the mouse is moved over the canvas, the `draw` function is called to update the drawing based on the current mouse position.
     - `canvas.addEventListener('mouseup', stopDrawing)`: This event listener detects when the mouse button is released, indicating the end of drawing, and calls the `stopDrawing` function.
     - `canvas.addEventListener('mouseout', stopDrawing)`: If the mouse moves out of the canvas area, the `stopDrawing` function is triggered to ensure drawing stops even if the mouse leaves the canvas.

  2. **Drawing Functions**:
     
     - `startDrawing(event)`: This function is called when the mouse button is pressed down on the canvas. It initializes the drawing process by setting up the initial coordinates for drawing.
     - `draw(event)`: The `draw` function is responsible for updating the drawing based on the current position of the mouse. It connects the previous and current mouse positions to create a continuous line as the mouse moves.
     - `stopDrawing()`: When the mouse button is released or moves out of the canvas, the `stopDrawing` function is called to end the drawing action.

  3. **Drawing Implementation**:
     
     - Within the `draw` function, various properties of the 2D rendering context (`ctx`) are utilized to implement the drawing functionality, such as setting the stroke color, line width, and drawing paths using methods like `beginPath`, `moveTo`, `lineTo`, and `stroke`.

  Combining these elements, the pen functionality is achieved by capturing mouse events and updating the canvas based on mouse movement, resulting in a smooth drawing experience. The 2D rendering context (`ctx`) provides the necessary methods and properties to control the appearance and behavior of the pen tool on the canvas.

  Below is a screenshot of the tutorial of the pen functionality:

  ![Annotating free hand on a web page (instagram.com)](./images/2.png)
  *Figure 5: Annotating free hand on a web page (instagram.com)*

- **Text Highlighter Functionality**: The `highlight-btn` class defines the styling of the button representing the text highlighter tool. JavaScript is utilized to implement the text highlighting functionality by detecting user text selection and applying a background color to the selected text. Let's review the relevant parts of the code to understand how the text highlighting functionality is implemented:

  1. **Event Listeners**:
     
     - `document.addEventListener('mouseup', highlightSelection)`: This event listener triggers the `highlightSelection` function when the mouse button is released after selecting text on the webpage.

  2. **Highlighting Function**:
     
     - `highlightSelection()`: This function is responsible for highlighting the selected text by applying a background color to it. It captures the user's text selection and wraps it with a `<span>` element, setting the background color to the chosen highlight color.

  3. **Implementation**:
     
     - Within the `highlightSelection` function, the user's text selection is obtained using the `window.getSelection` method. The selected range of text is then wrapped with a `<span>` element, and the `style.backgroundColor` property is set to the desired highlight color.
     - The chosen color for highlighting is dynamically set based on user input. For instance, if a user clicks on a yellow color button, the corresponding background color is applied to the selected text. This is achieved by modifying the `style.backgroundColor` property of the `<span>` element.

  Combining these elements, the text highlighting functionality is implemented by detecting the user's text selection and wrapping the selected text with a `<span>` element that applies the chosen highlight color as the background. This approach allows users to highlight specific portions of text on a webpage, making it visually distinct and easier to reference.

  Below is a screenshot of highlighting text on a webpage:

  ![Highlighting text on a web page (instagram.com)](./images/4.png)
  *Figure 6: Highlighting text on a web page (instagram.com)*

- **Undo Functionality**: The `undo-btn` class defines the styling of the button representing the undo functionality. JavaScript is used to implement the undo functionality by managing the drawing history on the canvas and restoring the previous states when the undo action is triggered. Let's review the relevant parts of the code to understand how the undo functionality is implemented:

  1. **Event Listener**:
     
     - `document.querySelector('.undo-btn').addEventListener('click', undoLastAction)`: This event listener triggers the `undoLastAction` function when the undo button is clicked.

  2. **Undo Function**:
     
     - `undoLastAction()`: This function is responsible for performing the undo action by removing the most recent drawing action from the drawing history and restoring the canvas to the previous state.

  3. **Implementation**:
     
     - Within the `undoLastAction` function, the drawing history is managed using an array (`drawingHistory`) that stores the drawing actions performed on the canvas.
     - When the undo button is clicked, the function removes the last drawing action from the `drawingHistory` array using the `pop` method.
     - After removing the last action, the function clears the canvas and redraws the remaining actions from the `drawingHistory` array, effectively restoring the canvas to its previous state.

  By managing the drawing history and restoring the canvas based on the stored actions, the undo functionality allows users to revert the most recent drawing action and return the canvas to its previous state.

  Below is a screenshot of drawing with a pen and then undoing the action:

  ![Undo action](./images/5.png)
  *Figure 7: Undo action*

- **Save Functionality**: The `save-btn` class defines the styling of the button representing the save functionality. JavaScript is used to implement the save functionality by capturing the current state of the canvas and generating an image file that the user can download. Let's review the relevant parts of the code to understand how the save functionality is implemented:

  1. **Event Listener**:
     
     - `document.querySelector('.save-btn').addEventListener('click', saveImage)`: This event listener triggers the `saveImage` function when the save button is clicked.

  2. **Save Function**:
     
     - `saveImage()`: This function is responsible for capturing the current state of the canvas and generating an image file that the user can download.

  3. **Implementation**:
     
     - Within the `saveImage` function, the current state of the canvas is captured using the `toDataURL` method of the canvas element. This method generates a base64-encoded data URL representing the image of the canvas.
     - The generated data URL is then used to create an anchor (`<a>`) element with the `href` attribute set to the data URL and the `download` attribute set to specify the filename of the image.
     - The anchor element is programmatically clicked using the `click` method, triggering the download of the image file.

  By capturing the current state of the canvas and generating an image file for download, the save functionality allows users to save their annotations as images for future reference.

  Below is a screenshot of the annotated page saved on my local device:

  ![Annotated page saved locally](./images/7.png)
  *Figure 8: Annotated page saved locally*

- **Erase Functionality**: The `erase-btn` class defines the styling of the button representing the erase functionality. JavaScript is used to implement the erase functionality by modifying the drawing behavior to remove previously drawn content from the canvas. Let's review the relevant parts of the code to understand how the erase functionality is implemented:

  1. **Event Listener**:
     
     - `document.querySelector('.erase-btn').addEventListener('click', toggleEraser)`: This event listener triggers the `toggleEraser` function when the erase button is clicked.

  2. **Erase Function**:
     
     - `toggleEraser()`: This function toggles the erase mode by changing the behavior of the drawing tool to act as an eraser.

  3. **Implementation**:
     
     - Within the `toggleEraser` function, the `isErasing` variable is toggled to enable or disable the eraser mode.
     - When the eraser mode is enabled, the drawing tool's stroke color is set to match the canvas background color, effectively "erasing" the drawn content.
     - The `draw` function is modified to check the `isErasing` variable and set the stroke color accordingly. If `isErasing` is true, the stroke color is set to the canvas background color; otherwise, it uses the selected drawing color.

  By toggling the eraser mode and adjusting the stroke color to match the canvas background color, the erase functionality allows users to remove previously drawn content from the canvas.

  Below is a screenshot of erasing free hand drawings on a webpage:

  ![Erasing free hand drawings on a webpage](./images/6.png)
  *Figure 9: Erasing free hand drawings on a webpage*

### Additional Features

- **Sticky Notes Functionality**: In addition to the core functionalities, I also implemented a sticky notes feature that allows users to add notes to specific parts of a webpage. This feature is particularly useful for adding comments, reminders, or additional information to highlighted text or annotated drawings. Let's review the implementation details:

  1. **Event Listener**:
     
     - `document.querySelector('.sticky-note-btn').addEventListener('click', addStickyNote)`: This event listener triggers the `addStickyNote` function when the sticky note button is clicked.

  2. **Sticky Note Function**:
     
     - `addStickyNote()`: This function adds a sticky note element to the webpage at the current mouse position.

  3. **Implementation**:
     
     - Within the `addStickyNote` function, a new `<div>` element is created to represent the sticky note. The element is styled with CSS to resemble a sticky note and is positioned based on the current mouse coordinates.
     - The sticky note element contains a `<textarea>` element, allowing users to type their notes.
     - The sticky note element is appended to the body of the webpage, making it visible to the user.

  By allowing users to add sticky notes to specific parts of a webpage, this feature enhances the overall annotation experience by providing a way to attach additional information or comments directly to the annotated content.

  Below is a screenshot of adding sticky notes to a webpage:

  ![Adding sticky notes to a webpage](./images/3.png)
  *Figure 10: Adding sticky notes to a webpage*

## Concluding Remarks

Throughout the development of this Web Annotator Chrome extension, I gained valuable experience in web development, JavaScript, and the creation of Chrome extensions. This project allowed me to explore various aspects of front-end development, including HTML, CSS, and JavaScript, and understand how these technologies work together to create interactive and functional web applications.

The process of implementing the annotation tools, such as the pen, highlighter, undo, save, and erase functionalities, provided insights into event handling, canvas manipulation, and state management. Additionally, the implementation of the sticky notes feature added a layer of complexity and enhanced the overall user experience.

In conclusion, this project was an enriching experience that allowed me to apply my skills and knowledge to create a useful and practical tool for annotating web pages. I look forward to further enhancing this extension and exploring new features and improvements in future iterations.

Thank you for taking the time to review my project report. I hope you find the Web Annotator Chrome extension as useful and enjoyable to use as I did while developing it.

## References

- Google Chrome Extension Documentation: https://developer.chrome.com/docs/extensions/mv3/
- Mozilla Developer Network (MDN) Web Docs: https://developer.mozilla.org/
- Stack Overflow: https://stackoverflow.com/
- Various online tutorials and articles on web development and Chrome extension creation.
