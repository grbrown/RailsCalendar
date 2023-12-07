class CreateEvents < ActiveRecord::Migration[7.1]
  def change
    create_table :events do |t|
      t.string :name
      t.string :start
      t.string :end
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
