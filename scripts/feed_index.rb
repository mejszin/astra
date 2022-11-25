require_relative './api.rb'

TASK_ID = ARGV[0]

puts get('/tasks/feed', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
})