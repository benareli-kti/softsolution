import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class Globals{
    username?: string;
    userid?: string;
    roles?: string[];
    isPOS?: boolean;
    
    private subject = new Subject<any>();

    sendMessage(message: string) {
        this.subject.next({ text: message });
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}