import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  QUOTE_ENDPOINT = 'https://api.huobi.pro/market/detail/merged?symbol=btcusdt';

  constructor(private http: HttpClient) {
  }

  getQuote(): Observable<any> {
    return this.http.get(this.QUOTE_ENDPOINT);
  }

}
