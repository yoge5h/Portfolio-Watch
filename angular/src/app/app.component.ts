import { Component, OnInit } from '@angular/core';
import { CommunicationService } from './services/communication.service';
import { LocalStorageService } from './services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  isLoggedIn: boolean;
  constructor(private communicationService : CommunicationService, private localStorage: LocalStorageService, private router: Router){}

  ngOnInit(){
    this.isLoggedIn = this.localStorage.get('token') !== '' && this.localStorage.get('token') !== null;
    this.communicationService.isLoggedIn.subscribe((loggedIn: boolean)=>{
      this.isLoggedIn = loggedIn;
    });
  }

  onLogout(){
    this.localStorage.store('token','');
    this.router.navigate(['login']);
    this.isLoggedIn = false;
  }

  getUserName(){
    return this.localStorage.get('user')
  }

}
