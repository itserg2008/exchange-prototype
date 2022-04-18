import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ExchangeService } from '../services/exchange.service';
import { ExchangeRequest } from '../model/exchangeRequest';
import { QuoteService } from '../services/quote.service';
import { FormBuilder, Validators } from '@angular/forms';
import { maxValidatorAsync } from '../validators/max-validator';
import { btcAddressValidatorAsync } from '../validators/btc-address-validator';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {
  
  constructor(
              private fb: FormBuilder,
              private router: Router,
              private quoteService: QuoteService,
               private exchangeService: ExchangeService) { }

  exchangeForm = this.fb.group({
    fromCurrency: ['USDT', Validators.required],
    toCurrency: ['BTC', Validators.required],
    sendAmount: ['', Validators.required, maxValidatorAsync(30.0)],
    getAmount: ['', Validators.required],
    address: ['', Validators.required, btcAddressValidatorAsync()],
    email: ['', Validators.email]
  });             
  
  backendErrors = [];
  usdtbtc: number = 0.0;
  btcusdt: number = 0.0;
  exchangeFee: number = 0;
  exchangeFeePercent: number = 0;
  minersFeeSatoshis: number = 0;
  maxChangedAmount: number = 0;
  acceptPolicies = false;

  DECIMALS_BTC = 8;
  DECIMALS_USDT = 6;

  ngOnInit(): void {

    this.exchangeService.getSettings().subscribe((data: any) => {
        this.exchangeFeePercent = data.exchange_fee_percent;        
        this.minersFeeSatoshis = data.miners_fee_satoshis;        
        this.maxChangedAmount = data.max_changed_amount;
    });

    this.quoteService.getQuote()
    .subscribe((data: any)=> {
        this.usdtbtc = data.tick.close;
        this.btcusdt = 1 / this.usdtbtc;
    });    
  }

  getMinersFee() {
    return this.minersFeeSatoshis / 100000000;
  }

  onYouSendInputKeyPress() {       
    const amountReceivedBtc = this.exchangeService.getActualAmountReceived(parseFloat(this.exchangeForm.get('sendAmount')?.value), this.btcusdt, this.exchangeFeePercent, this.getMinersFee())
    this.exchangeForm.get('getAmount')?.setValue(amountReceivedBtc.toFixed(this.DECIMALS_BTC));   
    this.updateExchangeFee();
  }

  onYouGetInputKeyPress() {       
    const amountShouldBeSent = this.exchangeService.getSendAmountByReceived(parseFloat(this.exchangeForm.get('getAmount')?.value), this.btcusdt, this.exchangeFeePercent, this.getMinersFee())
    this.exchangeForm.get('sendAmount')?.setValue(amountShouldBeSent.toFixed(this.DECIMALS_USDT));   
  }

  updateExchangeFee() {
    this.exchangeFee = this.exchangeFeePercent * this.exchangeForm.get('getAmount')?.value / 100;     
  }

  onSubmit() {   
    if (!this.exchangeForm.valid) {
      return;
    }
    const sendAmount = parseFloat(this.exchangeForm.get('sendAmount')?.value.toString())

    const request : ExchangeRequest = { 
      from_currency: this.exchangeForm.get('fromCurrency')?.value,
      sent_amount: sendAmount,
      to_currency: this.exchangeForm.get('toCurrency')?.value,
      rate: this.btcusdt,
      address: this.exchangeForm.get('address')?.value,
      email: this.exchangeForm.get('email')?.value
    };
        
    this.exchangeService.exchange(request).subscribe((result : any) => {
      const navigationExtras: NavigationExtras = {
          state: {
            sendAmount: sendAmount,
            receiveAmount: this.exchangeForm.get('getAmount')?.value,
            exchangeFee: this.exchangeFee,
            networkFee: this.getMinersFee(),
            address: request.address,
            exchangeRate: this.btcusdt,
            txId: result.tx_id            
          }
        };
                
        this.router.navigate(['/checkout'], navigationExtras);    
    }, errorResponse => {
      this.backendErrors = errorResponse.error.errors;
      console.log(this.backendErrors);
    });
  }

}
