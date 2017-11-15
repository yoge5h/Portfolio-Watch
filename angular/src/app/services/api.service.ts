import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions,Headers  } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class ApiService{
    private headers: Headers
    private baseUrl: string = 'http://13.126.188.218/api/'; 
    constructor(private http: Http, private localStorage: LocalStorageService) { }

    login(user:{username:string, password:string}){
        const authHeader: string = window.btoa(user.username + ':' + user.password);
        this.headers = new Headers();
        this.headers.append('Authorization', 'Basic ' + authHeader);
        let options = new RequestOptions({'headers' : this.headers});
        return this.http.get(this.baseUrl + 'auth/login', options)
                        .map((res: Response) => res.json());
    };

    getCompanies(){
        return this.http.get(this.baseUrl + 'portfolio/get-companies')
                        .map((res: Response)=>{
                            this.setRefreshToken(res);
                            return res.json()
                        });
    }

    buyStock(data:{'company':string, 'price':number, 'quantity':number, 'type': string}){
        return this.http.post(this.baseUrl + 'portfolio/buy', data)
                        .map((res: Response) => {
                            this.setRefreshToken(res);
                            return res.json();
                        });
    }

    sellStock(data:{'company':string, 'price':number, 'quantity':number}){
        return this.http.post(this.baseUrl + 'portfolio/sell', data)
                        .map((res: Response) => {
                            this.setRefreshToken(res);
                            return res.json();
                        });
    }

    getUserData(){
        return this.http.get(this.baseUrl + 'portfolio/get-portfolio')
                        .map((res: Response)=>{
                            this.setRefreshToken(res);
                            return res.json()
                        });
    }

    refreshPortfolioData(){
        return this.http.get(this.baseUrl + 'portfolio/refresh-data')
        .map((res: Response)=>{
            this.setRefreshToken(res);
            return res.json();
        });
    }

    chnagePassword(data:{'newPassword':string}){
        return this.http.put(this.baseUrl + 'auth/changepassword', data)
                        .map((res: Response)=>{
                            this.setRefreshToken(res);
                            return res.json();
                        })
    }

    private setRefreshToken(response: Response){        
        const token: string = response.headers.get('refresh-token');
        if(token != null)               
            this.localStorage.store('token',window.btoa(token + ":x"));
    }
}