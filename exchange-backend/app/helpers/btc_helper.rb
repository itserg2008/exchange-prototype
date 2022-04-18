# frozen_string_literal: true

module BtcHelper
  SATOSHIS_IN_BTC = 100_000_000

  def convert_to_satoshis(value)
    (value * SATOSHIS_IN_BTC).to_i
  end
end
