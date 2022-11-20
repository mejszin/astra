function createElement(name, classList = []) {
    let element = document.createElement(name);
    element.classList.add(...classList);
    return element;
}

function createP(text, classList = []) {
    let element = createElement('p', classList);
    element.innerText = text;
    return element;
}

function createI(text, classList = []) {
    let element = createElement('i', classList);
    element.innerText = text;
    return element;
}

function createDiv(classList = []) {
    return createElement('div', classList);
}

function createArticle(classList = []) {
    return createElement('article', classList);
}

function createSpan(classList = []) {
    return createElement('span', classList);
}

function createImg(src, classList = []) {
    let element = createElement('img', classList);
    element.src = src;
    return element;
}

function createCanvas(classList = []) {
    return createElement('canvas', classList);
}

function createTable(classList = []) {
    return createElement('table', classList);
}

function createButton(classList = [], aria_label = null) {
    let element = createElement('button', classList);
    if (aria_label != null) { element.ariaLabel = aria_label };
    return element;
}

function secondsToDuration(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h:${minutes}m`;
}

function getContrast(hexcolor){
    hexcolor = hexcolor.replace("#", "");
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 200) ? 'black' : 'white';
}

function openBrowser(url = 'https://google.com') {
    const execSync = require('child_process').execSync;
    execSync(`start ${url}`);
}