# frozen_string_literal: true

json.id transaction.id
json.tx_id transaction.tx_id
json.from_currency transaction.from_currency
json.to_currency transaction.to_currency
json.sent_amount transaction.sent_amount.to_f
json.received_amount transaction.received_amount.to_f
json.exchange_rate transaction.exchange_rate.to_f
json.exchange_fee transaction.exchange_fee.to_f
json.address transaction.address
json.status transaction.status
json.email transaction.email
