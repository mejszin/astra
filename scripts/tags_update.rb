require_relative './api.rb'

TASK_ID = 'rysA0WAD'

TAGS = [0, 1, 2]

puts post('/tasks/tags/update', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, TAGS).inspect