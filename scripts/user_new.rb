require_relative './api.rb'

USERNAME = ARGV[0]
PASSWORD = ARGV[1]

puts get('/user/new', { :username => USERNAME, :password => PASSWORD })