require 'pry'

class WelcomeController < ApplicationController
  def index
    
  	gon.neighborhoods = getIndexes(Neighborhood)
  	gon.categories = getIndexes(Category)
    gon.flare = getFlare
  	render layout: false
  end

  private

  def getIndexes(klass)
		array = []
   
		klass.all.each do |k|
       v_array = []
      if klass.name == 'Neighborhood'
        k.venues.each do |v|
          e_array = []
          v.events.map {|e| e_array<<e.name}
          v_array << {"name"=>v.name, "events"=>e_array}
        end 
      end
			array << { "name" => k.name, "id" => k.id, "count" => k.events.count, "venues" => v_array  }

		end
		array
	end

  def getFlare
    array = []
    Neighborhood.all.each do |n|
      v_array = []

      n.venues.each do |v|
        e_array = []
        v.events.map {|e| e_array<< { "name"=>e.name, "size"=>2000 } }
        v_array << { "name"=>v.name, "children"=>e_array }
      end 
      array << { "name" => n.name, "children" => v_array  }
    end
    array
  end



end
