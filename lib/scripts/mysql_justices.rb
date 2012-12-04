require 'mongo'
require 'net/http'
require 'pg'
require 'pp'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_evaluation']

client = PG::Connection.new dbname: "assignment_4"

collection.find().each do |row|
  date = row['_id']['date'].to_i
  justiceName = row['_id']['justiceName']

  conservative_votes = row['value']['conservative_votes'].to_i
  liberal_votes = row['value']['liberal_votes'].to_i

  client.exec('insert into justices (justiceName, year, conservative_votes, liberal_votes) values ($1, $2, $3, $4)', [justiceName, date, conservative_votes, liberal_votes])
  

end
