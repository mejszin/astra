const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// token
const token = urlParams.get('token');
console.log('token=', token);
// user_id
const user_id = urlParams.get('id');
console.log('user_id=', user_id);
// entry_id
var entry_id = urlParams.get('entry');
console.log('entry_id=', entry_id);
// base_url
const base_url = 'https://astra.machin.dev/api'
console.log('base_url=', base_url);