require_relative './api.rb'

USERNAME = ''
PASSWORD = ''

puts get('/user/new', { :username => USERNAME, :password => PASSWORD })