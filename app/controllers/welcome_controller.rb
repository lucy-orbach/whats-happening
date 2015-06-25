require 'pry'

class WelcomeController < ApplicationController
  def index
  	gon.neighborhoods = getIndexes(Neighborhood)
  	@neighborhoods = Neighborhood.all
  	@categories = Category.all
  	render layout: false
  end

  private

  def getIndexes(klass)
		array = []
		klass.all.each do |k|
			array << { "name" => k.name, "events" => k.events.count }
		end
		array
	end



end
