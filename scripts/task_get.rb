require_relative './api.rb'

TASK_ID = 'rysA0WAD'

body = get("/task/#{TASK_ID}", {
    :token => API_TOKEN,
})

puts JSON.pretty_generate(body)