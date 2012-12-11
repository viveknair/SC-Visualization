# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['inline5']

rcollection = database['random_cases']

collection.find().each do |row|
  if (rand(1..10) == 1) 
    date = row['_id']['year'].to_i
    justiceName = row['_id']['justiceName']
  
    conservative_votes = row['value']['conservative_votes'].to_i
    liberal_votes = row['value']['liberal_votes'].to_i

    # client.exec('insert into cases (year, conservative_votes, liberal_votes) values ($1, $2, $3)', [date, conservative_votes, liberal_votes])
  end
end
