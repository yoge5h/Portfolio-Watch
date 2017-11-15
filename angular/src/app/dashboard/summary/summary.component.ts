import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Summary } from '../../models/summary.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() summary: Summary
  @Output() refreshWasClicked = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
   
  }

  onRefreshClicked(){
    this.refreshWasClicked.emit();
  }

}
