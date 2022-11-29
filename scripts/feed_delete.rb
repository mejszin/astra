require_relative './api.rb'

TASK_ID = 'rysA0WAD'
FEED_ID = 'Il3rMfBG'

puts get('/tasks/feed/delete', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :feed_id => FEED_ID,
})