import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  isLoading: boolean = false;
  filteredCompanies: Observable<any[]>;  
  sellForm:FormGroup;
  companies: {id: string, name: string}[];

  constructor(private apiService: ApiService, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.getCompanyData();
    this.sellForm = new FormGroup({
      'company' : new FormControl(null, [Validators.required]),
      'quantity' : new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required])
    });
  }

  private getCompanyData(){
    this.isLoading = true;
    this.apiService.getCompanies().subscribe((res)=>{
      this.companies = res;
      this.isLoading = false;
      this.filteredCompanies = this.sellForm.controls.company.valueChanges
                                  .startWith(null)
                                  .map(company => company ? this.filterCompanies(company) : this.companies.slice());
      }, (err) => {

      })
  }

  private filterCompanies(name: string) {
    return this.companies.filter(company =>
      company.name.toLowerCase().indexOf(name.toLowerCase()) != -1 || company.id.toLowerCase().indexOf(name.toLowerCase()) != -1);
  }

  onSubmit() {    
    this.isLoading = true;
    this.apiService.sellStock({
      'company': this.sellForm.controls.company.value,
      'price': this.sellForm.controls.price.value,
      'quantity': this.sellForm.controls.quantity.value
    }).subscribe((res)=>{
      this.snackbar.open(res.message, res.status, {
        duration: 2000,
      });
      this.isLoading = false;
      this.sellForm.reset();
    })
  }

}
