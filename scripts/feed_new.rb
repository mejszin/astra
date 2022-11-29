require_relative './api.rb'

TASK_ID = 'rysA0WAD'

FEED_DATA = {
    'type': 'text',
    'content': {
        'text': "I'd like to be able to log some other fitness data like from crossfit, I have no idea how that data can be exported. It will be intesting to look into!"
    }
}

# FEED_DATA = {
#     'type': 'gpx',
#     'content': {
#         'uri': 'https://gist.githubusercontent.com/mejszin/50f33bc08b940abefe526274317b78f7/raw/acb0e97788d4e43b09f254920da5f5320f051d41/activity_9450094021.gmx',
#         'basename': 'activity_9450094021'
#     }
# }

puts post('/tasks/feed/new', {
    :token => API_TOKEN,
    :task_id => TASK_ID,
}, FEED_DATA)