class AddNeighborhoodToVenues < ActiveRecord::Migration
  def change
    add_reference :venues, :neighborhood, index: true, foreign_key: true
  end
end
