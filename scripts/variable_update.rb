require_relative './api.rb'

TASK_ID = 'SkAQWEWb'

KEY = 'test_var'
VALUE = ['abc', 'def', 'ghi']

puts post('/tasks/variables/update', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :key => KEY,
}, VALUE)