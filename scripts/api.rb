require 'net/http'
require 'uri'
require 'json'
require_relative './common.rb'

BASE_URL = 'https://astra.machin.dev/api'

API_TOKEN_BASENAME = '/api_token'
API_TOKEN_PATH = File.dirname(__FILE__) + API_TOKEN_BASENAME

VERBOSE = true

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
    return res.code == '200' ? JSON.parse(res.body) : {}
end

def get(route, headers = {})
    uri = URI(BASE_URL + route)
    uri.query = URI.encode_www_form(headers)
    puts uri if VERBOSE
    res = Net::HTTP.get_response(uri)
    return res.code == '200' ? JSON.parse(res.body) : {}
end