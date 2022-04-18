import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { StatInfo } from '../model/statInfo';
import { Transaction } from '../model/transaction';
import { TransactionsService } from '../services/transactions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'txid', 'email', 'from_currency', 'to_currency', 'sent_amount', 'received_amount', 'address', 'exchange_fee','status'];
  dataSource = [] as Transaction[];
  statInfo: StatInfo;

  constructor(private transactionsService: TransactionsService, private authService: AuthService, private router: Router) { 
    this.statInfo = {
      total_exchange_fee : 0,
      total_success_transactions : 0,
      total_transactions : 0
    }
  }

  ngOnInit(): void {
    this.transactionsService.getTransactionsList().subscribe(transactions => {
      this.dataSource = transactions;
    });

    this.transactionsService.getStatistics().subscribe(statInfo => {
      this.statInfo = statInfo;
    });
  }

  logout(): void {    
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
