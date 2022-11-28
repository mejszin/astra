require_relative './api.rb'

TASK_ID = 'rysA0WAD'

KEY = 'test_var'

puts get('/tasks/variables/delete', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :key => KEY,
})