import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  sendAmount: number = 0;
  receiveAmount: number = 0;
  exchangeFee: number = 0;
  networkFee: number = 0;
  address: string = '';
  exchangeRate: number = 0;
  txId: string = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation != null ) {
      const state = navigation.extras.state as {
        sendAmount: number,
        receiveAmount: number,
        exchangeFee: number,
        networkFee: number,
        address: string,
        exchangeRate: number,
        txId: string
      };         
      this.sendAmount = state.sendAmount;
      this.receiveAmount = state.receiveAmount;
      this.exchangeFee = state.exchangeFee;
      this.networkFee = state.networkFee;
      this.address = state.address;
      this.exchangeRate = state.exchangeRate;
      this.txId = state.txId;
    }
   }

  ngOnInit(): void {    
  }

}
