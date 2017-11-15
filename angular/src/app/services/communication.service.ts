import { Subject } from 'rxjs/Subject';

export class CommunicationService{
    isLoggedIn = new Subject();
}