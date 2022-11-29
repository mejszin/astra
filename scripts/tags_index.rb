require_relative './api.rb'

TASK_ID = 'rysA0WAD'

puts get('/tasks/tags', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
})