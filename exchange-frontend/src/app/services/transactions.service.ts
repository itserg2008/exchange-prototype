import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../model/transaction';
import { StatInfo } from '../model/statInfo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {


  constructor(private http: HttpClient, private authService: AuthService) { }

  getBasicAuthHeader(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(this.authService.userAuth.username + ':' + this.authService.userAuth.password)
      })  
  }
  getTransactionsList(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(environment.apiUrl + "/v1/transactions.json", { headers: this.getBasicAuthHeader()});  
  }

  getStatistics(): Observable<StatInfo> {
    return this.http.get<StatInfo>(environment.apiUrl + "/v1/statistics", { headers: this.getBasicAuthHeader()});  
  }
}
