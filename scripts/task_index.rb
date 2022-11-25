require_relative './api.rb'

puts get('/tasks', {
    :token => API_TOKEN,
})