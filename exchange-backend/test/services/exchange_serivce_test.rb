require "test_helper"
require 'minitest/mock'
require 'dry/monads/result'

class ExchangeServiceTest < ActiveSupport::TestCase

  test 'successful exchange' do
    tx_service = TransactionService.new
    tx_id = '4cff011ec53022f2ae47197d1a2fd4a6...'
    tx_service.stub :send, tx_id do
      tx_service.stub :get_address_info, '' do
        tx_service.stub :balance, 500000 do
          res = ExchangeService.call({ :from_currency => 'USDT',
                                       :to_currency => 'BTC',
                                       :sent_amount => 10,
                                       :rate => 0.000024,
                                       :address => '2MvUxk91D7kKjeku8ZoypYrE9EjMiUXHmGs',
                                       :email => 'mail@mail.com',
                                       :tx_service => tx_service})
          assert_instance_of(Dry::Monads::Success, res)
          assert_equal(tx_id, res.value!)
          tx = Transaction.find_by(tx_id: tx_id)
          assert(tx)
          assert_equal(tx_id, tx.tx_id)
        end
      end
    end
  end

  test 'insufficient exchange funds' do
    tx_service = TransactionService.new
    tx_service.stub :get_address_info, '' do
      tx_service.stub :balance, 10000 do
        res = ExchangeService.call({ :from_currency => 'USDT',
                                     :to_currency => 'BTC',
                                     :sent_amount => 10,
                                     :rate => 0.000024,
                                     :address => '2MvUxk91D7kKjeku8ZoypYrE9EjMiUXHmGs',
                                     :email => 'mail@mail.com',
                                     :tx_service => tx_service})
        assert_instance_of(Dry::Monads::Failure, res)
        assert_equal('Insufficient exchange balance', res.failure[0])
      end
    end
  end

  test 'invalid address format' do
    res = ExchangeService.call({ :from_currency => 'USDT',
                                 :to_currency => 'BTC',
                                 :sent_amount => 10,
                                 :rate => 0.000024,
                                 :address => 'QMvUxk91D7kKjeku8ZoypYrE9EjMiUXHmGs',
                                 :email => 'mail@mail.com'})
    assert_instance_of(Dry::Monads::Failure, res)
    assert_equal('address has invalid format', res.failure[0])
  end
end