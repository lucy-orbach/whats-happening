require 'crack/xml'

HOODS = [ "Queens", "Harlem, Bronx", "Williamsburg", "DUMBO, other Brooklyn", "Upper East Side", "Midtown", "Flatiron, Gramercy", "East Chelsea", "Chelsea 28th - 33rd", "Chelsea 27th", "Chelsea 26th", "Chelsea 25th", "Chelsea 24th", "Chelsea 23rd", "Chelsea 22nd", "Chelsea 21st", "Chelsea 20th", "Chelsea 14th - 19th", "Villages", "Soho", "Lower East Side", "Lower Manhattan" ]

CAT = [ "2D: Calligraphy", "2D: Illustration", "2D: Drawing", "2D: Graphics", "2D: Painting", "2D: Photography", "2D: others", "3D: Architecture", "3D: Sculpture", "3D: Crafts", "3D: Fashion", "3D: Furniture", "3D: Installation", "3D: Product", "3D: Ceramics", "3D: other", "Screen: Film", "Screen: Digital", "Screen: Video Installation", "Screen: others", "Misc.: Art Parties", "Misc.: Art Talk", "Misc.: Performance Art", "Misc.: Art Competition"]

URLS = [ 
	"http://www.nyartbeat.com/list/event_area_queens.en.xml",
	"http://www.nyartbeat.com/list/event_area_harlem_bronx.en.xml",
	"http://www.nyartbeat.com/list/event_area_williamsburg.en.xml",
	"http://www.nyartbeat.com/list/event_area_dumbo_brooklyn.en.xml",
	"http://www.nyartbeat.com/list/event_area_upper_east_side.en.xml",
	"http://www.nyartbeat.com/list/event_area_midtown.en.xml",
	"http://www.nyartbeat.com/list/event_area_flatiron_gramercy.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_east.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_28_above.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_27.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_26.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_25.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_24.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_23.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_22.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_21.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_20.en.xml",
	"http://www.nyartbeat.com/list/event_area_chelsea_19_below.en.xml",
	"http://www.nyartbeat.com/list/event_area_villages.en.xml",
	"http://www.nyartbeat.com/list/event_area_soho.en.xml",
	"http://www.nyartbeat.com/list/event_area_lower_east_side.en.xml",
	"http://www.nyartbeat.com/list/event_area_lower_manhattan.en.xml"
]

def createEvents(data)
	event_arr = data["Events"]["Event"]
	
	event_arr.map.with_index do |e, i|
		if Venue.exists?(:name => event_arr[i]["Venue"]["Name"])
			venue = Venue.find_by(name: event_arr[i]["Venue"]["Name"])
		
		else
			neighborhood =  Neighborhood.find_by(name: event_arr[i]["Venue"]["Area"])
			venue = Venue.create(
				name: event_arr[i]["Venue"]["Name"], 
				address: event_arr[i]["Venue"]["Address"],
				phone: event_arr[i]["Venue"]["Phone"],
				neighborhood_id: neighborhood.id )
		end
		
		
		category = Category.find_by(name: event_arr[i]["Media"][0])

		event = Event.create(
			:name => event_arr[i]["Name"],
			:venue_id => venue.id,
			:description => event_arr[i]["Description"],
			:image30 => event_arr[i]["Image"][0]["src"],
			:image80 => event_arr[i]["Image"][1]["src"],
			:image170 => event_arr[i]["Image"][2]["src"],
			:price => event_arr[i]["Price"],
			:date_s => event_arr[i]["DateStart"],
			:date_e => event_arr[i]["DateEnd"],
			:lat => event_arr[i]["Latitude"],
			:long => event_arr[i]["Longitude"],
			:href => event_arr[i]["href"]
		)
		event.update(:category_id => category.id) if category
		event.save
	end
end

HOODS.each do |n|
	Neighborhood.create(name: n)
end

CAT.each do |c|
	Category.create(name: c)
end

URLS.each do |url|
	uri = URI.parse(URI.encode(url).strip)
	xml = uri.read
	data = Crack::XML.parse(xml)
	createEvents(data)
end
 

