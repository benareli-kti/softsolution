import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})

export class Globals{
    username?: string;
    userid?: string;
    roles?: string[];
    isPOS?: boolean;
}