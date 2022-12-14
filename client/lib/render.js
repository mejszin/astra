function selectTask(div) {
    var entries = document.getElementsByClassName('entry');
    for (var i = 0; i < entries.length; i++) {
      entries[i].classList.remove('selected');
    };
    div.classList.add('selected');
}

function addTaskListItem(entry, tags = {}) {
  let parent = document.getElementById('entries');
  let div = createDiv(['box', 'entry', 'm-2', 'px-3', 'pt-2', 'pb-3']);
  let element;
  console.log('tags=', JSON.stringify(tags));
  div.appendChild(createP(`#${entry.id}`, ['caption', 'is-size-7']));
  div.appendChild(createP(entry.content.title, ['entries-item-title', 'is-size-6']));
  let span = createSpan(['tag-span', 'mt-2']);
  div.appendChild(span);
  entry.tags.forEach(tag_id => {
    element = createDiv(['tag-square', 'mr-2']);
    element.style.backgroundColor = tags[tag_id].color;
    span.appendChild(element);
  });
  div.onclick = () => {
    entry_id = entry.id;
    selectTask(div);
    renderTask(entry, tags);
  };
  parent.appendChild(div);
}

function renderTaskList() {
  document.getElementById('entries').innerHTML = '';
  getUserTags().then(tags => {
    getTasks().then(tasks => {
      Object.keys(tasks).forEach(task_id => {
        console.log('task_data=', tasks[task_id]);
        addTaskListItem(tasks[task_id], tags);
      });
    });
  });
}

function addTagListItem(id, name, color) {
  console.log('tag=', id, name, color);
  let span = createSpan(['tag', 'is-medium']);
  span.style.backgroundColor = color;
  span.style.color = getContrast(color);
  span.innerText = name;
  return span
}

function renderTagsList() {
  let parent = document.getElementById('entries')
  parent.innerHTML = '';
  let div = createDiv(['tags', 'm-2']);
  parent.appendChild(div);
  getUserTags().then(tags => {
    Object.keys(tags).forEach(tag_id => {
      let span = addTagListItem(tag_id, tags[tag_id].name, tags[tag_id].color);
      div.appendChild(span);
    });
  });
}

function renderVariables(variables) {
  let div = document.getElementById('entry-variables');
  let tr, td, tbody, table;
  if ((div.style.display == 'none') || (div.style.display == '')) {
    div.style.display = 'flex';
    div.innerHTML = '';
    table = createTable(['table', 'is-striped', 'is-bordered']);
    div.appendChild(table);
    tbody = createElement('tbody');
    table.appendChild(tbody);
    Object.keys(variables).forEach((key) => {
      tr = createElement('tr');
      tbody.appendChild(tr);
      // Key
      td = createElement('td', ['monospace', 'is-small-text']);
      td.innerText = key;
      tr.appendChild(td);
      // Value
      td = createElement('td', ['is-small-text']);
      if (Array.isArray(variables[key])) {
        td.innerText = variables[key].join(', ');
      } else if (typeof variables[key] === 'object') {
        td.innerText = JSON.stringify(variables[key]);
      } else {
        td.innerText = variables[key];
      }
      tr.appendChild(td);
    });
  } else {
    div.style.display = 'none';
  }
}


function createContainer(item) {
  let classes = ['message', 'mb-2', 'mt-0'];
  if (item.level == 'error') { classes.push(['is-danger']) };
  if (item.level == 'warning') { classes.push(['is-warning']) };
  if (item.level == 'success') { classes.push(['is-success']) };
  let article = createArticle(classes);
  //     <button class="delete" aria-label="delete"></button>
  let div = createDiv(['message-body', 'pl-4', 'pr-2', 'py-2']);
  article.appendChild(div);
  let button = createButton(['delete', 'float-right'], 'delete');
  button.onclick = () => {
    console.log(`Clicked delete for entry #${entry_id}, item index #${item.index}`);
  }
  div.appendChild(button);
  return article;
}

function renderFeedLog(item) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  div.innerHTML += item.message + '<br><p class="is-size-7">' + (new Date(item.time * 1000)).toLocaleTimeString() + '</p>';
  return container;
}

function renderFeedChart(item, variables) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  let canvas = createCanvas();
  div.appendChild(canvas);
  let config = item.chart;
  if (!Array.isArray(config.data.datasets[0].data)) {
    let dataset = variables[config.data.datasets[0].data];
    let labels = variables[config.data.labels];
    config.data.datasets[0].data = dataset;
    config.data.labels = labels;
    console.log(dataset);
    console.log(config);
  }
  new Chart(canvas.getContext('2d'), config);
  return container;
}

function renderFeedImage(item) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  let anchor = createElement('a');
  anchor.onclick = () => { openBrowser(item.source) };
  let img = createImg(item.source, ['p-0']);
  anchor.appendChild(img);
  div.appendChild(anchor);
  return container;
}

function renderFeedText(item) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  div.innerHTML += item.content.text + '<br><p class="is-size-7">' + (new Date(item.time.created * 1000)).toLocaleTimeString() + '</p>';
  return container;
}

function renderFeedGpx(item) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  div.innerHTML += item.content.basename + '<br><p class="is-size-7">' + (new Date(item.time.created * 1000)).toLocaleTimeString() + '</p>';
  // item.content.uri
  return container;
}

function renderFeedTodo(item) {
  let container = createContainer(item);
  let div = container.getElementsByClassName('message-body')[0];
  let label = createElement('label', ['checkbox']);
  div.appendChild(label);
  let input = createElement('input', ['mr-2']);
  if (item.completed) { input.setAttribute('checked', 'checked') };
  input.type = 'checkbox';
  //input.setAttribute('onchange', checkTest());
  label.appendChild(input);
  label.innerHTML += item.label;
  label.onclick = (self) => {
    if (self.path[0].tagName == 'INPUT') {
      let updated_item = Object.assign({}, item);
      delete updated_item['index'];
      updated_item['completed'] = self.path[0].checked;
      setProjectEntryFeed(item.index, updated_item);
    }
  }
  return container;
}

function renderTask(entry, tags = {}) {
  let element, span, div;
  console.log('renderEntry()', entry);
  // Header
  let header = document.getElementById('entry-view-header');
  header.innerHTML = '';
  // Header > Span
  span = createSpan(['entry-header']);
  header.appendChild(span);
  // Header > Span > ID
  element = createP('#' + entry.id, ['id']);
  span.appendChild(element);
  // Header > Span > Title
  element = createP(entry.content.title);
  span.appendChild(element);
  // Contents
  let parent = document.getElementById('entry-view');
  parent.innerHTML = '';
  // Contents > Icons span
  span = createSpan(['entry-icons', 'py-4']);
  parent.appendChild(span);
  // Contents > Icons span > Delete
  element = createI('', ['fa', 'fa-trash-can']);
  span.appendChild(element);
  // Contents > Icons span > Copy
  element = createI('', ['fa', 'fa-copy', 'pl-4']);
  span.appendChild(element);
  // Contents > Icons span > Edit
  element = createI('', ['fa', 'fa-pencil', 'pl-4']);
  element.onclick = () => { gotoEntryForm(entry.id) };
  span.appendChild(element);
  // Contents > Icons span > Variables
  element = createI('', ['fa', 'fa-hashtag', 'pl-4']);
  element.onclick = () => { renderVariables(entry.variables) };
  span.appendChild(element);
  // Contents > Variable container
  element = createDiv(['entry-variables', 'mt-4']);
  element.id = 'entry-variables';
  parent.appendChild(element);
  // Contents > Title span
  span = createSpan(['entry-title', 'mt-4']);
  parent.appendChild(span);
  // Contents > Title span > ID
  element = createP('#' + entry.id, ['caption', 'pr-2']);
  span.appendChild(element);
  // Contents > Title span > Title
  element = createP(entry.content.title, ['bold']);
  span.appendChild(element);
  // Contents > Creation date
  span = createSpan(['entry-creation-date', 'my-4']);
  parent.appendChild(span);
  element = createI('', ['fa', 'fa-calendar-days', 'pr-2']);
  span.appendChild(element);
  element = createP((new Date(entry.time.created * 1000)).toLocaleDateString());
  span.appendChild(element);
  // Contents > Description
  element = createP('Description', ['caption', 'mb-2']);
  parent.appendChild(element);
  element = createP(entry.content.description, ['entry-description', 'p-4', 'mb-2']);
  parent.appendChild(element);
  // Contents > Tags
  entry.tags.forEach(tag_id => {
    span = createSpan(['tag-span']);
    parent.appendChild(span);
    element = createDiv(['tag-square', 'mr-2']);
    element.style.backgroundColor = tags[tag_id].color;
    span.appendChild(element);
    element = createP(tags[tag_id].name);
    span.appendChild(element);
  });
  // Contents > Feed
  element = createP('Feed', ['caption', 'my-2']);
  parent.appendChild(element);
  div = createDiv(['entry-feed']);
  parent.appendChild(div);
  // Contents > Feed > Items
  Object.keys(entry.feed).reverse().forEach(feed_id => {
    let item = entry.feed[feed_id];
    console.log(item);
    if (item.type == 'text') {
      div.appendChild(renderFeedText(item));
    }
    if (item.type == 'gpx') {
      div.appendChild(renderFeedGpx(item));
    }
    if (item.type == 'log') {
      div.appendChild(renderFeedLog(item));
    }
    if (item.type == 'image') {
      div.appendChild(renderFeedImage(item));
    }
    if (item.type == 'todo') {
      div.appendChild(renderFeedTodo(item));
    }
    if (item.type == 'chart') {
      div.appendChild(renderFeedChart(item, entry.variables));
    }
  });
}

function renderActivityHeatmap() {
  let parent = document.getElementById('entry-view');
  parent.innerHTML = '';
  let table = createTable(['table', 'is-bordered', 'is-narrow']);
  parent.appendChild(table);
  let tr, td;
  for (let day = 0; day < 7; day += 1) {
    tr = createElement('tr');
    table.appendChild(tr);
    for (let week = 0; week < 12; week += 1) {
      td = createElement('td', ['activity']);
      tr.appendChild(td);
    }
  }
}

function renderActivity() {
  getProjectActivity().then(activity => {
    let parent = document.getElementById('entry-view');
    parent.innerHTML = '';
    let table = createTable(['table', 'is-small-text']);
    parent.appendChild(table);
    let tr, td;
    Object.keys(activity).forEach(date_id => {
      tr = createElement('tr');
      table.appendChild(tr);
      // Date
      td = createElement('td');
      td.innerText = date_id.split('_').reverse().join('/');
      tr.appendChild(td);
      // Count
      td = createElement('td');
      td.innerText = activity[date_id];
      tr.appendChild(td);
    })
  });
}