require_relative './api.rb'

USERNAME = ARGV[0]
PASSWORD = ARGV[1]

puts get('/users/login', {
    :username => USERNAME,
    :password => PASSWORD,
})