import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class Globals{
    username?: string;
    userid?: string;
    roles?: string[];
    isPOS?: boolean;
    pos_shift?: boolean;
    pos_open?: boolean;
    pos_session?: string;
    pos_session_id?: string;
}