class CreateVenues < ActiveRecord::Migration
  def change
    create_table :venues do |t|
      t.string :name
      t.string :address
      t.string :phone
      t.references :neighborhood, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
