require_relative './api.rb'

TASK_ID = 'rysA0WAD'

TAGS = ['DWFFoRFV', 'E3eICQjh']

puts post('/tasks/tags/update', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, TAGS).inspect