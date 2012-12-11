# If you get an initialization error, run the export PG_HOME blah thing.

require 'mongo'
require 'net/http'
require 'pg'
require 'pp'

connection = Mongo::Connection.new
database = connection['assignment_4']
collection = database['justice_voting_patterns']

rcollection = database['random_cases']

caseArray = Hash.new 
collection.find().each do |row|
  if ( !caseArray[row['_id']['caseName']]) 
    caseArray[row['_id']['caseName']] = true;
  end
end

parsedCaseArray = Hash.new
caseArray.each do |caseVal, value|
  if (rand(1..10) == 1) 
    parsedCaseArray[caseVal] = true
  end
end

collection.find().each do |row|
  if (parsedCaseArray[row['_id']['caseName']]) 
    caseName = row['_id']['caseName']
    justiceName = row['_id']['justiceName']
  
    direction = row['value']['direction'].to_i
  
    rcollection.insert caseName: caseName, justiceName: justiceName, direction: direction  
  
    # client.exec('insert into specific_cases (caseName, justiceName, direction) values ($1, $2, $3)', [caseName, justiceName, direction])
  end
end
