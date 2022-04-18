# frozen_string_literal: true

module V1
  class AuthController < ActionController::Base
    skip_before_action :verify_authenticity_token

    def login
      config = Rails.application.config_for(:exchange)
      is_authenticated = (params[:username] == config.auth_username and params[:password] == config.auth_password)
      resp = { success: is_authenticated }
      render json: resp
    end
  end
end
