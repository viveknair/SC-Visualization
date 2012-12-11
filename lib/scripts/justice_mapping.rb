# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'
require 'pp'
require 'csv'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_mapping_patterns']

collection.remove

CSV.foreach("justices.csv") do |row|
  collection.insert justiceName: row[0], status: row[1].to_i
end
