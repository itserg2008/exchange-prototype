# frozen_string_literal: true

require 'json'
require 'dry/monads/result'

module V1
  class ExchangeController < ApplicationController
    def settings
      exchange_config = Rails.application.config_for(:exchange)
      resp = { exchange_fee_percent: exchange_config.exchange_fee_percent,
               miners_fee_satoshis: exchange_config.miners_fee_satoshis,
               max_changed_amount: exchange_config.max_changed_amount }
      render json: resp
    end

    def createtx
      op_result = ExchangeService.call(permitted_exchange_params.to_h.symbolize_keys)
      case op_result
      when Dry::Monads::Success then render json: { tx_id: op_result.value! }
      when Dry::Monads::Failure then render json: { errors: op_result.failure }, status: :unprocessable_entity
      else
        raise 'Unhandled use case'
      end
    end

    def permitted_exchange_params
      params.permit(:address, :from_currency, :to_currency, :sent_amount, :rate, :email)
    end
  end
end
