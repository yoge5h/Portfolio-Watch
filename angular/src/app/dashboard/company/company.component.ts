import { Component, OnInit, Input } from '@angular/core';
import { Portfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  @Input() company: Portfolio
  constructor() { }

  ngOnInit() {
    
  }

  getColor(no: number){
    if(no >= 0){
      return 'lime';
    }
    return 'red';
  }
}
