import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/global';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';
import { User } from 'src/app/models/user.model';
import { User2Service } from 'src/app/services/user2.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../main/style/main.component.sass']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  roles?: Role[];
  isInvenDisabled = false;
  isPartnerDisabled = false;
  isTransDisabled = false;
  isIManager = false;
  isPManager = false;
  isTManager = false;
  isIUser = false;
  isPUser = false;
  isTUser = false
  isAdmin = false;
  listRoles: any = [];

  constructor(
    private globals: Globals,
    private token: TokenStorageService,
    private roleService: RoleService,
    private user2Service: User2Service,
  ){
    this.retrieveRole();
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }

  onAdmin(enable: boolean) {if(enable){this.isAdmin=true;}else{this.isAdmin=false;}}

  onInven(enable: boolean) {if(enable){this.isInvenDisabled=false;}else{this.isInvenDisabled=true;}}
  onIManager(enable: boolean) {if(enable){this.isIManager=true;}else{this.isIManager=false;}}

  onPartner(enable: boolean) {if(enable){this.isPartnerDisabled=false;}else{this.isPartnerDisabled = true;}}
  onPManager(enable: boolean) {if(enable){this.isPManager=true;}else{this.isPManager=false;}}

  onTrans(enable: boolean) {if(enable){this.isTransDisabled=false;}else{this.isTransDisabled=true;}}
  onTManager(enable: boolean) {if(enable){this.isTManager=true;}else{this.isTManager=false;}}

  retrieveRole(): void {
    this.user2Service.get(this.globals.userid)
      .subscribe(user => {
        this.checkSlider(user);
    });

    this.roleService.getAll()
      .subscribe(role => {
        this.roles = role;
      })
  }

  checkSlider(user: any): void {
    for(let x=0; x < user.roles.length; x++){
      if(user.roles[x].name == "admin") this.isAdmin=true;
      if(user.roles[x].name == "inventory_user") {this.isIUser=true;this.isInvenDisabled=false;}
      if(user.roles[x].name == "inventory_manager") this.isIManager=true;
      if(user.roles[x].name == "partner_user") {this.isPUser=true;this.isPartnerDisabled=false;}
      if(user.roles[x].name == "partner_manager") this.isPManager=true;
      if(user.roles[x].name == "trans_user") {this.isTUser=true;this.isTransDisabled=false;}
      if(user.roles[x].name == "trans_manager") this.isTManager=true;
    }
  }
  

  test(): void {
    this.listRoles = [];
        //console.log(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
    if(this.isAdmin){
      this.listRoles.push(this.roles?.filter(role => role.name === "admin").map(role => role._id));
    }
    if(!this.isInvenDisabled){
      if(this.isIManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "inventory_user").map(role => role._id));
    }
    if(!this.isPartnerDisabled){
      if(this.isPManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "partner_user").map(role => role._id));
    }
    if(!this.isTransDisabled){
      if(this.isTManager){
        this.listRoles.push(this.roles?.filter(role => role.name === "trans_manager").map(role => role._id));
        this.listRoles.push(this.roles?.filter(role => role.name === "trans_user").map(role => role._id));
      }else this.listRoles.push(this.roles?.filter(role => role.name === "trans_user").map(role => role._id));
    }
    const dataRole = {
      roles: this.listRoles,
    };
    this.user2Service.update(this.globals.userid, dataRole)
      .subscribe({
        next: (res) => {
        },
        error: (e) => console.error(e)
      });

  }
}