require_relative './api.rb'

TITLE = 'Weeknotes'
DESCRIPTION = 'These are my weeknotes to be rendered on https://machin.dev/'

puts get('/tasks/new', {
    :token => API_TOKEN,
    :title => TITLE,
    :description => DESCRIPTION,
})