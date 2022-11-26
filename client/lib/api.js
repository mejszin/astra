function getTasks() {
    console.log('getProjectEntries()');
    return new Promise(resolve => {
        (async () => {
            var url = `${base_url}/tasks`;
            url += `?token=${token}`;
            console.log(url);
            fetch(url).then (response => response.json()).then(data => {
                console.log('/tasks', data);
                resolve(data);
            }).catch(err => {
                console.log(err);
                resolve({});
            });
        })()
    });
}

function getTaskTags() {
    console.log('getTaskTags()');
    return new Promise(resolve => {
        (async () => {
            var url = `${base_url}/tasks/tags`;
            url += `?token=${token}`;
            url += `&task_id=${task_id}`;
            console.log(url);
            fetch(url).then (response => response.json()).then(data => {
                console.log('/projects/tags/get', data);
                resolve(data);
            }).catch(err => {
                console.log(err);
                resolve({});
            });
        })()
    });
}

function getProjectActivity() {
    console.log('getProjectActivity()');
    return new Promise(resolve => {
        (async () => {
            var url = `${base_url}/projects/activity/get`;
            url += `?token=${token}`;
            url += `&id=${user_id}`;
            console.log(url);
            fetch(url).then (response => response.json()).then(data => {
                console.log('/projects/activity/get', data);
                resolve(data);
            }).catch(err => {
                console.log(err);
                resolve({});
            });
        })()
    });
}

function setProjectEntryFeed(index, body) {
    console.log('setProjectEntryFeed()');
    return new Promise(resolve => {
        (async () => {
            var url = `${base_url}/projects/entry/feed/set`;
            url += `?token=${token}`;
            url += `&id=${user_id}`;
            url += `&entry=${entry_id}`;
            url += `&index=${index}`;
            console.log(url);
            let config = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            fetch(url, config).then (response => {
                console.log('/projects/entry/feed/set', response);
                resolve(response);
            }).catch(err => {
                console.log(err);
                resolve({});
            });
        })()
    });
}

function newProjectEntry(body) {
    console.log('newProjectEntry()');
    return new Promise(resolve => {
        (async () => {
            var url = `${base_url}/projects/entry/new`;
            url += `?token=${token}`;
            url += `&id=${user_id}`;
            if (entry_id != null) { url += `&id=${entry_id}` };
            console.log(url);
            let config = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            fetch(url, config).then (response => {
                console.log('/projects/entry/new', response);
                resolve(response);
            }).catch(err => {
                console.log(err);
                resolve({});
            });
        })()
    });
}