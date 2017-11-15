import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
  isLoading: boolean = false;
  filteredCompanies: Observable<any[]>;  
  buyForm:FormGroup;
  companies: {id: string, name: string}[];

  constructor(private apiService: ApiService, private snackbar: MatSnackBar) {
   }

  ngOnInit() {
    this.getCompanyData();
    this.buyForm = new FormGroup({
      'company' : new FormControl(null, [Validators.required]),
      'type' : new FormControl(null, [Validators.required]),
      'quantity' : new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required])
    });   

    this.buyForm.controls.type.valueChanges.subscribe((value) => {
      this.buyForm.controls.price.setValue(this.getPrice(value));
    });    
  }

  private getCompanyData(){
    this.isLoading = true;
    this.apiService.getCompanies().subscribe((res)=>{
      this.companies = res;
      this.isLoading = false;
      this.filteredCompanies = this.buyForm.controls.company.valueChanges
                                  .startWith(null)
                                  .map(company => company ? this.filterCompanies(company) : this.companies.slice());
      }, (err) => {

      })
  }

  private getPrice(type: string){
    if(type === 'bonus'){
      return 0;
    }
    else if(type === 'right' || type === "ipo"){
      return 100;
    }
    return null;
  }

  private filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.name.toLowerCase().indexOf(name.toLowerCase()) != -1 || company.id.toLowerCase().indexOf(name.toLowerCase()) != -1);
  }

  onSubmit() {
    this.isLoading = true;
    this.apiService.buyStock({
      'company': this.buyForm.controls.company.value,
      'price': this.buyForm.controls.price.value,
      'quantity': this.buyForm.controls.quantity.value,
      'type': this.buyForm.controls.type.value
    }).subscribe((res)=>{
      this.snackbar.open(res.message, res.status, {
        duration: 2000,
      });
      this.isLoading = false;
      this.buyForm.reset();
    })    
  }

}
