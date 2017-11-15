import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../services/api.service';
import { Summary } from '../models/summary.model';
import { Portfolio } from '../models/portfolio.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  portfolio: Portfolio[];
  isLoading: boolean = false;
  summary: Summary;
  constructor(private apiService: ApiService, private snackbar: MatSnackBar) { };

  ngOnInit() {
    this.getUserData()
  };

  onRefreshClicked(){
    this.refreshPortfolioData()
  };

  private refreshPortfolioData(){
    this.isLoading = true;
    this.apiService.refreshPortfolioData()
                  .subscribe((res)=>{
                    this.portfolio = res;
                    this.getSummary();
                    this.isLoading = false;
                  })
  }

  private getUserData(){
    this.isLoading = true;
    this.apiService.getUserData()
                  .subscribe((res)=>{
                    this.portfolio = res;
                    this.getSummary();
                    this.isLoading = false;
                  })
  };

  private getSummary(){
    if(this.portfolio.length > 0){
      this.summary = new Summary();
      this.summary.noOfCompanies = this.portfolio.length;
      this.summary.time = this.portfolio[0].rateTime;
      let noOfShares: number = 0;
      let netIncome: number = 0;
      let portfolioValue: number = 0;
      let totalInvestment: number = 0;

      for(let holding of this.portfolio){
        noOfShares = noOfShares + holding.quantity;
        netIncome = netIncome + ((holding.currentPrice - holding.averagePrice) * holding.quantity);
        portfolioValue = portfolioValue + (holding.currentPrice * holding.quantity);
        totalInvestment = totalInvestment + (holding.averagePrice * holding.quantity);
      }
      this.summary.noOfShares = noOfShares;
      this.summary.netIncome = netIncome;
      this.summary.portfolioValue = portfolioValue;
      this.summary.totalInvestment = totalInvestment;
    };
  };

}
