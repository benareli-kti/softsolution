import { Component, ViewChild, HostBinding, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
          this.rute = this.rute + ' | Sesi POS';
          this.layPOS = true;
          this.wiggle();
        }else if(event.url=="/purchase"){
          this.rute = this.rute + ' | Pembelian';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/partner"){
          this.rute = this.rute + ' | Pelanggan/Supplier';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/warehouse"){
          this.rute = this.rute + ' | Gudang';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/product"){
          this.rute = this.rute + ' | Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/productcategory"){
          this.rute = this.rute + ' | Kategori Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/uom"){
          this.rute = this.rute + ' | Satuan Produk';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/brand"){
          this.rute = this.rute + ' | Merek';
          this.layPOS = false;
          this.wiggle();
        }else if(event.url=="/setting"){
          this.rute = this.rute + ' | Setting';
          this.layPOS = false;
          this.wiggle();
        }else{
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
          this.globals.cost_general = setting[0].cost_general;
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
        } else {
          this.maxWidth = false;
          this.wiggle();
        }
      });
  }

  toggleProduct() {
    this.isProductShow = !this.isProductShow;
  }

  toggleTransac() {
    this.isTransacShow = !this.isTransacShow;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  wiggle() {
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
