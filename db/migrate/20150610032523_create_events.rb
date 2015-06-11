class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :name
      t.string :detail_url
      t.string :ll

      t.timestamps null: false
    end
  end
end
