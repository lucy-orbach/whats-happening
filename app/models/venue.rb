class Venue < ActiveRecord::Base
	has_many :events
	belongs_to :neighborhood
end
