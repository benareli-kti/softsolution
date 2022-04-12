import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { User } from 'src/app/models/user.model';
import { User2Service } from 'src/app/services/user2.service';

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

  pos_shift?: boolean;

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
    private user2Service: User2Service,
    private settingService: SettingService,
    public breakpointObserver: BreakpointObserver,
    private tokenStorageService: TokenStorageService
  ){ 
    router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.rute = 'Soft Solution';
        if(event.url=="/pos"){
          this.rute = 'POS';
          this.layPOS = true;
          this.wiggle();
        }else if(event.url=="/pos-session"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Session';
          this.layPOS = true;
          this.wiggle();
        }else if(event.url=="/partner"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Partner';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/warehouse"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Warehouse';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/product"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Product';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/productcategory"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Product Category';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/brand"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Brand';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/setting"){
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
          this.rute = this.rute + ' | Global Setting';
          this.layPOS = false;
          this.wiggle();
        }else{
          //if(this.globals.pos_open) this.router.navigate(['/pos-session']);
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
      this.username = user.username;
      this.globals.username = user.username;
      this.globals.userid = user.id;
      this.globals.roles = user.roles;
      this.settingService.getAll()
        .subscribe(setting => {
          this.globals.pos_shift = setting[0].pos_shift;
          this.pos_shift = setting[0].pos_shift;
          if(this.globals.pos_shift){
            this.user2Service.get(user.id)
              .subscribe(users => {
                this.checkRole();
              })
          }else{ this.checkRole(); }
        });
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
