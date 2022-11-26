require_relative './api.rb'

TASK_ID = 'SkAQWEWb'

KEY = 'test_var'
VALUE = [123, 456, 789]

puts post('/tasks/variables/new', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
    :key => KEY,
}, VALUE)