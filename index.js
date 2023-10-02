MathJax.Hub.Config({
  skipStartupTypeset: true,
  showProcessingMessages: false,
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEscapes: true,
  },
  TeX: {
    equationNumbers: {
      autoNumber: "AMS",
    },
  },
});
marked.setOptions({
  smartLists: true,
  smartypants: true,
});
const Preview = {
  delay: 0,
  preview: null,
  buffer: null,
  timeout: null,
  mjRunning: false,
  oldText: null,
  Init() {
    this.preview = document.getElementById("viewer");
    this.buffer = document.getElementById("buffer");
    this.textarea = document.getElementById("getm");
    this.wordcount = document.getElementById("wordcount");
    this.charcount = document.getElementById("charcount");
    this.save = document.getElementById("save");
  },
  SwapBuffers() {
    let buffer = this.preview;
    let preview = this.buffer;
    this.buffer = buffer;
    this.preview = preview;
    buffer.style.display = "none";
    preview.style.display = "flex";
  },
  Update() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.callback, this.delay);
  },
  CreatePreview() {
    Preview.timeout = null;
    if (this.mjRunning) return;
    let text = this.textarea.value;
    if (text === this.oldtext) return;
    text = this.Escape(text);
    this.buffer.innerHTML = this.oldtext = text;
    this.mjRunning = true;
    MathJax.Hub.Configured();
    MathJax.Hub.Queue(
      ["Typeset", MathJax.Hub, this.buffer],
      ["PreviewDone", this],
      ["resetEquationNumbers", MathJax.InputJax.TeX]
    );
    let viewer =
      document.getElementById("viewer").style.display == "none"
        ? document.getElementById("buffer")
        : document.getElementById("viewer");
    let regex = /\s+/gi;
    if (text !== "") {
      let wordCount = viewer.innerText.trim().replace(regex, " ").split(" ")
        .length;
      let charCount = viewer.innerText.replace(regex, "").length;
      this.wordcount.innerHTML = `${wordCount} words`;
      this.charcount.innerHTML = `${charCount} chars`;
      this.save.disabled = false;
    } else {
      this.wordcount.innerHTML = "0 words";
      this.charcount.innerHTML = "0 chars";
      this.save.disabled = true;
    }
    mouseUp();
  },
  PreviewDone() {
    this.mjRunning = false;
    text = this.buffer.innerHTML;
    text = this.PartialDescape(text);
    this.buffer.innerHTML = marked.parse(text);
    document.querySelectorAll("code").forEach((block) => {
      hljs.highlightBlock(block);
    });
    this.SwapBuffers();
  },
  Escape(html, encode) {
    return html
      .replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },
  PartialDescape(html) {
    let lines = html.split("\n");
    let out = "";
    // is true when we are
    // ```
    //  inside a code block
    // ```
    let inside_code = false;
    for (let i = 0; i < lines.length; i++) {
      // a hack to properly rendre the blockquotes
      if (lines[i].startsWith("&gt;")) {
        lines[i] = lines[i].replace(/&gt;/g, ">");
      }
      // rendrer properly stuff like this
      // ```c
      //  if (a > b)
      // ```
      if (inside_code) {
        // inside the code we descape stuff
        lines[i] = lines[i]
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }
      if (lines[i].startsWith("```")) {
        inside_code = !inside_code;
      }
      out += `${lines[i]}\n`;
    }
    return out;
  },
  // The idea here is to perform fast updates.
  // See http://stackoverflow.com/questions/11228558/let-pagedown-and-mathjax-work-together/21563171?noredirect=1#comment46869312_21563171
  // But our implementation is a bit buggy: flickering, bad rendering when someone types very fast.
  //
  // If you want to enable such buggy fast updates, you should
  // add something like  onkeypress="Preview.UpdateKeyPress(event)" to textarea's attributes.
  UpdateKeyPress({ keyCode }) {
    if (keyCode < 16 || keyCode > 47) {
      this.preview.innerHTML = `<p>${marked.parse(this.textarea.value)}</p>`;
      this.buffer.innerHTML = `<p>${marked.parse(this.textarea.value)}</p>`;
    }
    this.Update();
  },
};
Preview.callback = MathJax.Callback(["CreatePreview", Preview]);
Preview.callback.autoReset = true;
Preview.Init();
Preview.Update();
const mouseUp = () => {
  let mark = document.getElementById("getm");
  let lineno = document.getElementById("lineno");
  let colno = document.getElementById("colno");
  let textLines = mark.value.substr(0, mark.selectionStart).split("\n");
  lineno.innerHTML = `Line ${textLines.length}`;
  colno.innerHTML = `Col ${textLines[textLines.length - 1].length}`;
};
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
if (localStorage.getItem("marcdownTheme") == "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#282a36");
  toggleSwitch.checked = true;
  localStorage.setItem("marcdownTheme", "dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#DAE5ED");
  toggleSwitch.checked = false;
  localStorage.setItem("marcdownTheme", "light");
}
const switchTheme = ({ target }) => {
  if (target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", "#282a36");
    localStorage.setItem("marcdownTheme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", "#DAE5ED");
    localStorage.setItem("marcdownTheme", "light");
  }
};
toggleSwitch.addEventListener("change", switchTheme, false);
const download = () => {
  let text = document.getElementById("getm").value;
  text = text.replace(/\n/g, "\r\n");
  let blob = new Blob([text], {
    type: "text/plain",
  });
  let anchor = document.createElement("a");
  anchor.download = "marcdown.md";
  anchor.href = window.URL.createObjectURL(blob);
  anchor.target = "_blank";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
const openFile = ({ target }) => {
  let input = target;
  let reader = new FileReader();
  reader.onload = () => {
    document.getElementById("getm").value = reader.result;
    input.value = "";
    Preview.Update();
  };
  reader.readAsText(input.files[0]);
};
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  const files = evt.dataTransfer.files;
  const reader = new FileReader();
  reader.onload = ({ target }) => {
    document.getElementById("getm").value = target.result;
    Preview.Update();
  };
  reader.readAsText(files[0], "UTF-8");
};
const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "copy";
};
let dropZone = document.getElementById("getm");
dropZone.addEventListener("dragover", handleDragOver, false);
dropZone.addEventListener("drop", handleFileSelect, false);
document.onkeyup = ({ altKey, which }) => {
  if (altKey && which == 79) {
    document.getElementById("file").click();
  } else if (altKey && which == 83) {
    document.getElementById("save").click();
  }
};
const apply = (e) => {
  let myField = document.getElementById("getm");
  let myValueBefore;
  let myValueAfter;
  switch (e) {
    case "bold":
      myValueBefore = "**";
      myValueAfter = "**";
      break;
    case "italic":
      myValueBefore = "*";
      myValueAfter = "*";
      break;
    case "strike":
      myValueBefore = "~";
      myValueAfter = "~";
      break;
    case "h1":
      myValueBefore = "# ";
      myValueAfter = "";
      break;
    case "h2":
      myValueBefore = "## ";
      myValueAfter = "";
      break;
    case "h3":
      myValueBefore = "### ";
      myValueAfter = "";
      break;
    case "bq":
      myValueBefore = "> ";
      myValueAfter = "";
      break;
    case "ol":
      myValueBefore = "1. ";
      myValueAfter = "";
      break;
    case "ul":
      myValueBefore = "- ";
      myValueAfter = "";
      break;
    case "ic":
      myValueBefore = "`";
      myValueAfter = "`";
      break;
    case "bc":
      myValueBefore = "```\n";
      myValueAfter = "\n```";
      break;
    case "link":
      myValueBefore = "[";
      myValueAfter = "]()";
      break;
    case "check":
      myValueBefore = "- [x] ";
      myValueAfter = "";
      break;
    case "image":
      myValueBefore = "![alt text](image.jpg)";
      myValueAfter = "";
      break;
    case "hr":
      myValueBefore = "---\n";
      myValueAfter = "";
      break;
    case "table":
      myValueBefore =
        "| Header | Title |\n| ----------- | ----------- |\n| Paragraph | Text |\n";
      myValueAfter = "";
      break;
  }
  if (document.selection) {
    myField.focus();
    document.selection.createRange().text =
      myValueBefore + document.selection.createRange().text + myValueAfter;
  } else if (myField.selectionStart || myField.selectionStart == "0") {
    let startPos = myField.selectionStart;
    let endPos = myField.selectionEnd;
    myField.value =
      myField.value.substring(0, startPos) +
      myValueBefore +
      myField.value.substring(startPos, endPos) +
      myValueAfter +
      myField.value.substring(endPos, myField.value.length);
    myField.selectionStart = startPos + myValueBefore.length;
    myField.selectionEnd = endPos + myValueBefore.length;
    myField.focus();
  }
  Preview.Update();
};
const slide = (e) => {
  let viewer = document.getElementById("viewer");
  let mark = document.getElementById("getm");
  switch (e) {
    case "nill":
      viewer.style.width = "100vw";
      viewer.style.padding = "16px";
      mark.style.width = "0";
      mark.style.padding = "0";
      break;
    case "half":
      viewer.style.width = "50vw";
      viewer.style.padding = "16px";
      mark.style.width = "50vw";
      mark.style.padding = "16px";
      break;
    case "full":
      viewer.style.width = "0";
      viewer.style.padding = "0";
      mark.style.width = "100vw";
      mark.style.padding = "16px";
      break;
  }
};
const modal = document.querySelector(".modal");
const trigger = document.querySelector(".trigger");
const closeButton = document.querySelector(".close-button");
const toggleModal = () => modal.classList.toggle("show-modal");
const windowOnClick = ({ target }) => {
  if (target === modal) {
    toggleModal();
  }
};
trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
let pwaInstalled = localStorage.getItem("pwaInstalled") == "yes";
if (window.matchMedia("(display-mode: standalone)").matches) {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
}
if (window.navigator.standalone === true) {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
}
if (pwaInstalled) {
  document.getElementById("installPWA").style.display = "none";
} else {
  document.getElementById("installPWA").style.display = "inline-flex";
}
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
});
async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(({ outcome }) => {
      if (outcome === "accepted") {
        console.log("Your PWA has been installed");
      } else {
        console.log("User chose to not install your PWA");
      }
      deferredPrompt = null;
    });
  }
}
window.addEventListener("appinstalled", (evt) => {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
  document.getElementById("installPWA").style.display = "none";
});
