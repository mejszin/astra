require_relative './api.rb'

body = get('/tasks', {
    :token => API_TOKEN,
})

puts JSON.pretty_generate(body)