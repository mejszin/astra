require_relative './api.rb'

TASK_ID = 'SkAQWEWb'

puts get('/tasks/feed', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
})