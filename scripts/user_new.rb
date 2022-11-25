require_relative './api.rb'

USERNAME = 'Louis'
PASSWORD = 'PrettyStock420!'

puts get('/user/new', { :username => USERNAME, :password => PASSWORD })