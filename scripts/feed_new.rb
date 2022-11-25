require_relative './api.rb'

TASK_ID = 'SkAQWEWb'
FEED_DATA = {
    'type': 'text',
    'content': {
        'title': 'This is a test feed item'
    }
}

puts post('/tasks/feed/new', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, FEED_DATA)