require_relative './api.rb'

TASK_ID = 'rysA0WAD'

FEED_DATA = {
    'type': 'text',
    'content': {
        'title': 'Hello world!'
    }
}

puts post('/tasks/feed/new', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, FEED_DATA)