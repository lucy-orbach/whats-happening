class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.references :venue, index: true, foreign_key: true
      t.references :category, index: true, foreign_key: true
      t.text :description
      t.string :image30
      t.string :image80
      t.string :image170
      t.string :price
      t.date :date_s
      t.date :date_e
      t.string :lat
      t.string :long
      t.string :href

      t.timestamps null: false
    end
  end
end
