class Event < ActiveRecord::Base
  belongs_to :venue
  belongs_to :category
  has_one :neighborhood, through: :venue


	def getData(url)
			uri = URI.parse(URI.encode(url).strip)
			xml = uri.read
		  response = Crack::XML.parse(xml)
	end
end

