import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  roles?: Role[];

  constructor(
    private token: TokenStorageService,
    private roleService: RoleService
  ){
    this.retrieveRole();
  }

  retrieveRole(): void {
    this.roleService.getAll()
      .subscribe(role => {
        console.log(role);
    });
  }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
}
