import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExchangeRequest } from '../model/exchangeRequest';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  constructor(private http: HttpClient) { }

  getSettings(): Observable<any> {
    return this.http.get(environment.apiUrl + "/v1/exchange/settings");
  }
  exchange(exchangeRequest : ExchangeRequest): Observable<any> {
    return this.http.post(environment.apiUrl + "/v1/exchange/createtx", exchangeRequest);
  }

  getActualAmountReceived(amount: number, rate: number, exchange_fee_percent: number, miners_fee:number) {
    const convertedBtc = amount * rate;
    return ((1 - exchange_fee_percent/100) * convertedBtc - miners_fee);
  }

  getSendAmountByReceived(amountRcv: number, rate: number, exchange_fee_percent: number, miners_fee:number) {
    return ((amountRcv + miners_fee) / (rate * (1 - exchange_fee_percent/100)));
  }
}
