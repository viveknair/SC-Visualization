# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'
require 'pp'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_voting_patterns']

client = PG::Connection.new dbname: "assignment_4"

collection.find().each do |row|
  caseName = row['_id']['caseName']
  justiceName = row['_id']['justiceName']

  direction = row['value']['direction'].to_i

  client.exec('insert into specific_cases (caseName, justiceName, direction) values ($1, $2, $3)', [caseName, justiceName, direction])
end
