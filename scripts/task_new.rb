require_relative './api.rb'

TITLE = 'Test task'
DESCRIPTION = 'This is a test task for development purposes'

puts get('/tasks/new', {
    :token => API_TOKEN,
    :title => TITLE,
    :description => DESCRIPTION,
})