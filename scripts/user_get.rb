require_relative './api.rb'

USER_ID = 'XuBO1jF1'

body = get("/user/#{USER_ID}", {
    :token => API_TOKEN,
})

puts JSON.pretty_generate(body)