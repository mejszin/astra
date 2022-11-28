require_relative './api.rb'

TASK_ID = 'rysA0WAD'

body = get("/tasks/#{TASK_ID}", {
    :token => API_TOKEN,
})

puts JSON.pretty_generate(body)