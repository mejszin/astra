require_relative './api.rb'

TASK_ID = 'SkAQWEWb'
FEED_DATA = {
    'type': 'text',
    'metadata': {
        'day': '2022-11-28'
    },
    'content': {
        'title': 'Hello world!'
    }
}

puts post('/tasks/feed/new', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, FEED_DATA)