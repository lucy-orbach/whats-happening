require 'json'

class Neighborhood < ActiveRecord::Base
	has_many :venues
	has_many :events, through: :venues




end

