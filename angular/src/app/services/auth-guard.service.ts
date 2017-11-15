import { 
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private localStorage: LocalStorageService){}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {            
            const token = this.localStorage.get('token');
            if (state.url && state.url !== 'login' && token === ''){
                this.router.navigate(['/login']);
            }
            return true;
        }
}