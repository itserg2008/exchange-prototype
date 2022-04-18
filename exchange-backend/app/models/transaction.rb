# frozen_string_literal: true

class Transaction < ApplicationRecord
  validates :from_currency, presence: true
  validates :to_currency, presence: true
  validates :sent_amount, presence: true
  validates :exchange_rate, presence: true
  validates :address, presence: true
  validates :email, presence: true
end
