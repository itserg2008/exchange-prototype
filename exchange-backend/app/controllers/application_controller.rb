# frozen_string_literal: true

class ApplicationController < ActionController::API
  def index
    render plain: 'Exchange API version 1.0'
  end
end
