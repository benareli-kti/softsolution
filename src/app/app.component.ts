import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnDestroy {
  message: any;
  subscription: Subscription;

  title = 'Soft Solution';
  isIU = false;
  isPU = false;
  isTU = false;
  isAdm = false;
  isPOS?: boolean;

  isProductShow = false;
  isPartnerShow = false;
  isTransacShow = false;

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  private roles: string[] = [];
  isLoggedIn = false;
  username?: string;
  constructor(
    private router: Router,
    private globals: Globals,
    public breakpointObserver: BreakpointObserver,
    private tokenStorageService: TokenStorageService
  ){
    this.subscription = this.messageService.getMessage().subscribe(message => { this.message = message; });
    console.log(this.message);
    if(this.message=="Open PO") {
      this.isPOS = true;
      this.ngOnInit();
    }else{
      this.isPos = false;
    }
  }
  ngOnInit(): void {
    //console.log(Globals.username);
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
    this.isPOS = this.globals.isPOS;
    console.log(this.globals.isPOS);
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
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          if(this.isPOS){
            this.sidenav.mode = 'over';
            this.sidenav.close();
          }else{
            this.sidenav.mode = 'side';
            this.sidenav.open();
          }
        }
      });
  }

  toggleProduct() {
    this.isProductShow = !this.isProductShow;
  }

  logout(): void {
    this.subscription.unsubscribe();
    this.tokenStorageService.signOut();
    window.location.reload();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
