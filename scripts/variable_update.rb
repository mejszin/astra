require_relative './api.rb'

TASK_ID = 'rysA0WAD'

KEY = 'weeknote_titles'
VALUE = {
    0 => 'the zeroth week',
}

puts post('/tasks/variables/update', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :key => KEY,
}, VALUE)