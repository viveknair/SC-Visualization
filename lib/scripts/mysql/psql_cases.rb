# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'mysql2'
require 'pp'


connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['inline2']

client = Mysql2::Client.new username: "root", database: "assignment_4"

collection.find().each do |row|
  date = row['_id']['year'].to_i
  justiceName = row['_id']['justiceName']

  conservative_votes = row['value']['conservative_votes'].to_i
  liberal_votes = row['value']['liberal_votes'].to_i

  client.query("insert into cases (year, conservative_votes, liberal_votes) values ('#{date}', '#{conservative_votes}', '#{liberal_votes}')")
end
