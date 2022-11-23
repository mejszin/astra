require 'net/http'
require 'uri'
require 'json'
require_relative './common.rb'

BASE_URL = 'https://mindful.machin.dev/api'

API_TOKEN_BASENAME = '/api_token'
API_TOKEN_PATH = File.dirname(__FILE__) + API_TOKEN_BASENAME

VERBOSE = false

if File.file?(API_TOKEN_PATH)
    API_TOKEN = File.read(API_TOKEN_PATH)
else
    message = "Can't find #{API_TOKEN_BASENAME} file\nMake sure any scripts are executed from within the /scripts directory"
    STDERR.puts safe_colorize(message, :red)
    exit
end

def post(route, headers = {}, body = nil)
    uri = URI(BASE_URL + route)
    uri.query = URI.encode_www_form(headers)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl, http.verify_mode = true, OpenSSL::SSL::VERIFY_NONE
    puts uri.request_uri if VERBOSE
    req = Net::HTTP::Post.new(uri.request_uri, {'Content-Type': 'application/json'})
    req.body = body.to_json unless body == nil
    res = http.request(req)
    return res.code
end

def get(route, headers = {})
    uri = URI(BASE_URL + route)
    uri.query = URI.encode_www_form(headers)
    puts uri if VERBOSE
    res = Net::HTTP.get_response(uri)
    return res.code == '200' ? JSON.parse(res.body) : {}
end

def new_chat(message)
    get('/game/chat/new', { :token => API_TOKEN, :message => message })
end

def get_chat(filter = nil)
    get('/game/chat/get', { :token => API_TOKEN, :filter => filter })
end

def new_user(username, password)
    get('/user/new', { :username => username, :password => password })
end

def find_player(username)
    get('/game/player/find', { :token => API_TOKEN, :username => username })
end

def set_position(area, x, y, token = API_TOKEN)
    get('/game/player/position/set', { :token => token, :area => area, :x => x, :y => y })
end

def set_area(area)
    post('/game/area/set', { :token => API_TOKEN, :id => area.id }, area.to_json)
end

def get_area(area_id)
    get('/game/area/get', { :token => API_TOKEN, :id => area_id })
end

def get_locale(area_id)
    data = get('/game/area/get', { :token => API_TOKEN, :id => area_id })
    return data["metadata"]["locale"]
end

def get_area_players(area_id)
    get('/game/area/players/get', { :token => API_TOKEN, :id => area_id })
end

def set_tile(tile)
    post('/game/tile/set', { :token => API_TOKEN, :id => tile.id }, tile.to_json)
end

def get_tile(tile_id)
    get('/game/tile/get', { :token => API_TOKEN, :id => tile_id })
end

def list_tile()
    get('/game/tile/list', { :token => API_TOKEN })
end

def set_assets(assets)
    post('/game/assets/set', { :token => API_TOKEN }, ASSETS)
end

def get_assets()
    get('/game/assets/get', { :token => API_TOKEN })
end

def get_player(id)
    get('/game/player/get', { :token => API_TOKEN, :id => id })
end