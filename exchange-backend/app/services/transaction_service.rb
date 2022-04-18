# frozen_string_literal: true

require 'bitcoin'
require 'net/http'
require 'dry/monads/result'

# TransactionService is responsible for creating and sending transactions using the BlockCypher API
class TransactionService
  include Bitcoin::Builder

  def get_address_info(address)
    address_info_response = Net::HTTP.get(URI("https://api.blockcypher.com/v1/btc/test3/addrs/#{address}?includeScript=true&unspentOnly=true"))
    @address_info = JSON.parse(address_info_response)
  end

  def balance
    @address_info['final_balance']
  end

  def key
    @key ||= Bitcoin::Key.from_base58(Rails.application.config_for(:exchange).btc_funding_private_key)
  end

  def tx_refs
    all_txrefs = []

    # check confirmed transactions first
    all_txrefs += @address_info['txrefs'] if @address_info.key?('txrefs')

    # merge with unconfirmed transactions if they are present
    all_txrefs += @address_info['unconfirmed_txrefs'] if @address_info.key?('unconfirmed_txrefs')

    all_txrefs.sort { |a, b| b['value'] <=> a['value'] }
  end

  # get sorted utxos to pay the specific amount
  def utxos_data(amount)
    # collecting inputs
    utxos = []
    sum = 0
    tx_refs.each do |elem|
      utxos.push elem
      sum += elem['value']
      break if sum > amount
    end

    utxos
  end

  def send(amount, address, change_address, miners_fee)
    tx_hex = create_transaction(amount, address, change_address, miners_fee)
    broadcast_transaction(tx_hex)
  end

  def create_transaction(amount, address, change_address, miners_fee)
    inputs_data = utxos_data(amount)
    inputs_sum_satoshis = inputs_data.sum { |x| x['value'] }
    # create a new transaction (and sign the inputs)
    new_tx = build_tx do |t|
      inputs_data.each do |input_data|
        t.input do |i|
          i.prev_out input_data['tx_hash']
          i.prev_out_index input_data['tx_output_n']
          i.prev_out_script input_data['script'].htb
          i.signature_key key
        end
      end

      t.output do |o|
        o.value amount
        o.script { |s| s.recipient address }
      end

      t.output do |o|
        o.value inputs_sum_satoshis - amount - miners_fee
        o.script { |s| s.recipient change_address }
      end
    end

    # convert to hex and return
    new_tx.to_payload.unpack1('H*')
  end

  def broadcast_transaction(tx_hex)
    broadcast_response = Net::HTTP.post URI('https://api.blockcypher.com/v1/btc/test3/txs/push'),
                                        { tx: tx_hex }.to_json, 'Content-Type' => 'application/json'
    if broadcast_response.code != '201'
      nil
    else
      broadcast_response_json = JSON.parse(broadcast_response.body)
      broadcast_response_json['tx']['hash']
    end
  end
end
