# frozen_string_literal: true

json.array! @transactions, partial: 'v1/transactions/transaction', as: :transaction
