import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  cpForm:FormGroup;
  isLoading: boolean = false;
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.cpForm = new FormGroup({
      'newPassword' : new FormControl(null, [Validators.required]),
      'confirmPassword' : new FormControl(null, [Validators.required, this.passwordsMatch.bind(this)])
    });
  }

  passwordsMatch(control : FormControl): {[s: string]: boolean}{
    if(this.cpForm === undefined){
      return null
    }
    if(this.cpForm.controls.newPassword.value !== control.value){
      return {'passwordsMismatch' : true}
    };
    return null;
  }

  onSubmit() {    
    this.isLoading = true;
    this.apiService.chnagePassword({'newPassword': this.cpForm.controls.newPassword.value})
                    .subscribe((res)=>{
                      this.snackbar.open(res.message, res.status, {
                        duration: 2000,
                      });
                      this.isLoading = false;
                      this.cpForm.reset();
                    });
  };

}
