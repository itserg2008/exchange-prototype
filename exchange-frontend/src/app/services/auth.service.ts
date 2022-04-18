import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuth } from '../model/userAuth';

import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userAuth: UserAuth = new UserAuth;

  constructor(private http: HttpClient) { 
    const userDataLocalStorage = localStorage.getItem('user');
    if (userDataLocalStorage != null) {
      this.userAuth = JSON.parse(userDataLocalStorage);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${environment.apiUrl}/v1/auth/login`, { username, password }).pipe(map(response => {
      if (response.success) {        
        this.userAuth.username = username
        this.userAuth.password = password;      
        localStorage.setItem('user', JSON.stringify(this.userAuth));
      }  
      return response.success;
    }));
  }

  logout() {
    localStorage.removeItem('user');
  }
}
