import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'Soft Solution';

  layPOS = false;
  maxWidth = false;

  isIU = false;
  isPU = false;
  isTU = false;
  isAdm = false;
  isPOS = false;

  isProductShow = false;
  isPartnerShow = false;
  isTransacShow = false;

  rute?: string;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  constructor(
    private router: Router,
    private route : ActivatedRoute,
    private globals: Globals,
    public breakpointObserver: BreakpointObserver,
    private tokenStorageService: TokenStorageService
  ){ 
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        //console.log(event.url);
        this.rute = event.url;
        if(event.url=="/pos"){
          this.layPOS = true;
          this.wiggle();
        }
        else{
          this.layPOS = false;
          this.wiggle();
        }
      }
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      //this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
      this.globals.username = user.username;
      this.globals.userid = user.id;
      this.globals.roles = user.roles;
      this.checkRole();
    }
    else{
      this.router.navigate(['/login']);
    }
  }

  checkRole() {
    for(let x=0; x<this.roles!.length;x++){
      if(this.roles![x]=="inventory_user"){ this.isIU=true;}
      if(this.roles![x]=="partner_user"){ this.isPU=true;}
      if(this.roles![x]=="trans_user"){ this.isTU=true;}
      if(this.roles![x]=="admin"){ this.isAdm=true;}
    };
  }

  ngAfterViewInit(){
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((res) => {
        if (res.matches) {
          this.maxWidth = true;
          this.wiggle();
          //this.sidenav.mode = 'over';
          //this.sidenav.close();
        } else {
          this.maxWidth = false;
          this.wiggle();
          //this.sidenav.mode = 'side';
          //this.sidenav.open();
        }
      });
  }

  toggleProduct() {
    this.isProductShow = !this.isProductShow;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  wiggle() {
    //this.sidenav.mode = 'over';
    //this.sidenav.close();
    if(this.layPOS && this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if(!this.layPOS && this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if(this.layPOS && !this.maxWidth){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }else if (!this.layPOS && !this.maxWidth){
      this.sidenav.mode = 'side';
      this.sidenav.open();
    }
  }

  wigglewiggle() {
    this.sidenav.mode = 'side';
    this.sidenav.open();
  }
}
