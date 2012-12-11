# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'
require 'pp'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['inline2']

client = PG::Connection.new dbname: "assignment_4"

collection.find().each do |row|
  date = row['_id']['year'].to_i
  justiceName = row['_id']['justiceName']

  conservative_votes = row['value']['conservative_votes'].to_i
  liberal_votes = row['value']['liberal_votes'].to_i

  client.exec('insert into cases (year, conservative_votes, liberal_votes) values ($1, $2, $3)', [date, conservative_votes, liberal_votes])
end
