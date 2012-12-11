# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'
require 'mysql2'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_voting_patterns']

client = Mysql2::Client.new username: "root", database: "assignment_4"

collection.find().each do |row|
  caseName = row['_id']['caseName']
  justiceName = row['_id']['justiceName']

  direction = row['value']['direction'].to_i

  client.query("insert into specific_cases (caseName, justiceName, direction) values (\"#{caseName}\", \"#{justiceName}\", \"#{direction}\")")
end
