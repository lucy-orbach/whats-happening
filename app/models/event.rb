class Event < ActiveRecord::Base

def getEvents
	require "pry"
	binding.pry

	  
	  #gets JSON
		response = JSON.parse(open('https://api.nytimes.com/svc/events/v2/listings.jsonp?&ll='+lat+','+lon+'&radius=5000&api-key='+ENV['GMAIL_KEY']).read)
		results = response['Result']


	# nyc='40.7127, 74.0059'
	# response = HTTParty.get('https://api.nytimes.com/svc/events/v2/listings.jsonp?&ll='+lat+','+lon+'&radius=5000&api-key='+ENV['GMAIL_KEY'])

end
	
		
	


end
