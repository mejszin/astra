require_relative './api.rb'

TASK_ID = 'SkAQWEWb'
FEED_ID = 'LM6pyps7'

puts get('/tasks/feed/delete', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :feed_id => FEED_ID,
})