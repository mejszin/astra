require_relative './api.rb'

USERNAME = ARGV[0]
PASSWORD = ARGV[1]

puts get('/user/login', {
    :username => USERNAME,
    :password => PASSWORD,
})