# frozen_string_literal: true

# ExchangeContract is a validation contract for checking data before exchange is made
class ExchangeContract < Dry::Validation::Contract
  params do
    required(:from_currency).filled(:string)
    required(:to_currency).filled(:string)
    required(:sent_amount).filled(:float)
    required(:rate).filled(:float)
    required(:address).filled(:string)
    required(:email).filled(:string)
  end

  rule(:email) do
    key.failure('has invalid format') unless /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i.match?(value)
  end

  rule(:sent_amount) do
    key.failure('must be less than 30') if value >= 30
  end

  rule(:address) do
    key.failure('has invalid format') unless Bitcoin.valid_address? value
  end
end
