require 'mongo'
require 'net/http'
require 'mysql2'
require 'pp'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_evaluation']

client = Mysql2::Client.new  username: "root", database: "assignment_4"

collection.find().each do |row|
  date = row['_id']['date']
  justiceName = row['_id']['justiceName']

  conservative_votes = row['value']['conservative_votes']
  liberal_votes = row['value']['liberal_votes']

  
  client.query("insert into justice_evaluation (justiceName, year, conservative_votes, liberal_votes) values ('#{justiceName}', '#{date}', '#{conservative_votes}', '#{liberal_votes}')")
end
