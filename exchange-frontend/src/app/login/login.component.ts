import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
     
  isLoading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });     

  returnUrl: string = '';
  error = '';


  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,    
              private fb: FormBuilder) { }

   

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  
  onSubmit() {

    if (!this.loginForm.valid) {
      return;
    }

      this.isLoading = true;
      this.authService.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value).subscribe(authResult => {
          if (authResult) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = "Invalid credentials";
            this.isLoading = false;             
          }
      }, error => {
        this.error = error;        
        this.isLoading = false;
      })
  }
}
