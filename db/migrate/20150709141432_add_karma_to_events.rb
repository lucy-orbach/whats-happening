class AddKarmaToEvents < ActiveRecord::Migration
  def change
    add_column :events, :karma, :integer
  end
end
