require_relative './api.rb'

TASK_ID = 'SkAQWEWb'

puts get('/tasks/variables', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
})