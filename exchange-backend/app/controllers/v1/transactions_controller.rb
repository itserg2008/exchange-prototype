# frozen_string_literal: true

module V1
  class TransactionsController < ApplicationController
    include ActionController::HttpAuthentication::Basic::ControllerMethods

    http_basic_authenticate_with name: Rails.application.config_for(:exchange).auth_username,
                                 password: Rails.application.config_for(:exchange).auth_password

    def index
      @transactions = Transaction.all
    end

    def statistics
      resp = { total_exchange_fee: Transaction.where(status: 'SUCCESS').sum(:exchange_fee),
               total_success_transactions: Transaction.where(status: 'SUCCESS').count,
               total_transactions: Transaction.count }
      render json: resp
    end

    private

    # Only allow a list of trusted parameters through.
    def transaction_params
      params.require(:transaction).permit(:tx_id, :from, :to, :email)
    end
  end
end
