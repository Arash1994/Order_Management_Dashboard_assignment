class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      t.string  :customer,   null: false
      t.string  :status,     null: false, default: "Pending"
      t.decimal :total,      null: false, precision: 10, scale: 2
      t.json    :items

      t.timestamps
    end
  end
end
