import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { ApiService } from '../services/api.service';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  isLoading:boolean = false;

  constructor(private router: Router, private localStorage:LocalStorageService
    , private apiService: ApiService, private communicationService : CommunicationService
    , private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username':new FormControl(null, [Validators.required]),
      'password':new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {    
    this.isLoading = true;
    this.apiService.login({'username': this.loginForm.controls.username.value.toLowerCase(), 'password': this.loginForm.controls.password.value})
      .subscribe((res)=>{
        this.communicationService.isLoggedIn.next(true);
        this.isLoading = false;
        this.localStorage.store('token', window.btoa(res.token + ':x'));
        this.localStorage.store('user', res.username);
        this.router.navigate(['/']);
      },(err)=>{
        this.isLoading = false;
        this.snackbar.open('Invalid login credentials', 'Error', {
          duration: 2000,
        });        
      })        
  }

}
