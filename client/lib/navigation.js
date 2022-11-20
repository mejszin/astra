function dirname(path) {
   return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}

function gotoPage(page = 'index') {
    let url = `${dirname(location.href)}/${page}.html`;
    url += `?token=${token}`;
    url += `&id=${user_id}`;
    if (entry_id !== null) { url += `&entry=${entry_id}`; }
    window.location = url;
}

function gotoEntryForm(id = null) {
    entry_id = id;
    gotoPage('entry_form');
}