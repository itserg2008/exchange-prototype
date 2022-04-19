# frozen_string_literal: true

require 'dry/monads/result'

# ExchangeService provides functionality for changing currencies.
class ExchangeService
  extend Dry::Initializer
  include BtcHelper

  option :from_currency
  option :to_currency
  option :sent_amount
  option :rate
  option :address
  option :email
  option :tx_service, default: -> { TransactionService.new }

  def self.call(**args)
    validation_result = ExchangeContract.new.call(args)
    return Dry::Monads::Failure.new(errors_to_array(validation_result.errors)) unless validation_result.success?

    new(**args).call
  end

  def self.errors_to_array(errors)
    errors.to_h.map { |k, v| "#{k} #{v.join(' ')}" }
  end

  def key
    @key ||= Bitcoin::Key.from_base58(config.btc_funding_private_key)
  end

  def config
    Rails.application.config_for(:exchange)
  end

  def exchange_fee
    (config.exchange_fee_percent * sent_amount * rate) / 100
  end

  def user_received_amount
    sent_amount * rate - exchange_fee - config.miners_fee_satoshis / BtcHelper::SATOSHIS_IN_BTC.to_f
  end

  def user_received_satoshis
    convert_to_satoshis(user_received_amount)
  end

  def exchange_fee_satoshis
    convert_to_satoshis(exchange_fee)
  end

  def call
    tx_service.get_address_info(key.addr)

    if tx_service.balance < (user_received_satoshis + exchange_fee_satoshis + config.miners_fee_satoshis)
      save_transaction('', exchange_fee, user_received_amount, address, :FAILED)
      return Dry::Monads::Failure(['Insufficient exchange balance'])
    end

    tx_id = tx_service.send(user_received_satoshis, address, @key.addr, config.miners_fee_satoshis)

    unless tx_id
      save_transaction('', exchange_fee, user_received_amount, address, :FAILED)
      return Dry::Monads::Failure(['Cannot broadcast a transaction'])
    end

    save_transaction(tx_id, exchange_fee, user_received_amount, address, :SUCCESS)
    Dry::Monads::Success(tx_id)
  end

  # saves the transaction information to the database
  def save_transaction(tx_id, exchange_fee, user_received_amount, address, status)
    tx = Transaction.new(tx_id: tx_id,
                         from_currency: from_currency,
                         to_currency: to_currency,
                         sent_amount: sent_amount,
                         received_amount: user_received_amount,
                         exchange_rate: rate,
                         exchange_fee: exchange_fee,
                         address: address,
                         email: email,
                         status: status)
    tx.save
  end
end
