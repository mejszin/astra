require_relative './api.rb'

USERNAME = ''
PASSWORD = ''

puts get('/user/login', {
    :username => USERNAME,
    :password => PASSWORD,
})