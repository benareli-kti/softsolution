import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.sass']
})
export class PosComponent implements OnInit {

  constructor(
    private router: Router,
    private globals: Globals,
  ) {}

  ngOnInit(): void {
    this.globals.isPOS = true;
    /*if (!localStorage.getItem('poop')) { 
      localStorage.setItem('poop', 'no reload') 
      location.reload() 
    }else{
      localStorage.removeItem('poop') 
    }*/
  }

}
