import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Http, HttpModule } from '@angular/http';

import {
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSnackBarModule,
  MatCardModule,
  MatGridListModule,
  MatChipsModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommunicationService } from './services/communication.service';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { LocalStorageService } from './services/local-storage.service';
import { ExtendedHttpService } from './services/extended-http.service';
import { ApiService } from './services/api.service';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { CompanyComponent } from './dashboard/company/company.component';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent , canActivate: [AuthGuard]},
  { path: 'buy', component: BuyComponent, canActivate: [AuthGuard]},
  { path: 'sell', component: SellComponent, canActivate: [AuthGuard] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/' }
]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BuyComponent,
    SellComponent,
    ChangePasswordComponent,
    LoginComponent,
    SummaryComponent,
    CompanyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    MatGridListModule,
    MatChipsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    CommunicationService,
    AuthGuard,
    LocalStorageService,
    { provide: Http, useClass: ExtendedHttpService },
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
