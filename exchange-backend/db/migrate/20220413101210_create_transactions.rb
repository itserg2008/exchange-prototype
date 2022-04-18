class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.string "tx_id"
      t.string "from_currency"
      t.string "to_currency"
      t.string "email"
      t.string "address"
      t.decimal "sent_amount", precision: 14, scale: 6
      t.decimal "received_amount", precision: 14, scale: 8
      t.decimal "exchange_rate", precision: 10, scale: 8
      t.decimal "exchange_fee", precision: 10, scale: 8
      t.string "status"
      t.timestamps
    end
  end
end
