require_relative './api.rb'

NAME = 'lifestyle'
COLOR = '#6AB04C'

puts get('/users/tags/new', {
    :token => API_TOKEN,
    :name => NAME,
    :color => COLOR,
})