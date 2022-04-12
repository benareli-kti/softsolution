import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../main/style/main.component.sass']
})
export class SettingComponent implements OnInit {
  settingid?: string;
  pos_shift?: boolean = false;
  comp_name?: string;
  comp_addr?: string;
  comp_phone?: string;
  comp_email?: string;

  constructor(
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private token: TokenStorageService,
    private settingService: SettingService,
    private possessionService: PossessionService
  ) { }

  ngOnInit(): void {
    this.retrieveSetting();
  }

  retrieveSetting(): void {
    this.settingService.getAll()
      .subscribe(setting => {
        this.settingid = setting[0].id;
        this.comp_name = setting[0].comp_name;
        this.comp_addr = setting[0].comp_addr;
        this.comp_phone = setting[0].comp_phone;
        this.comp_email = setting[0].comp_email;
        this.pos_shift = setting[0].pos_shift;
      })
  }

  onPosShift(enable: boolean) {if(enable){this.pos_shift=true;}else{this.pos_shift=false;}}

  save1(): void {
    const save1 = {
      comp_name: this.comp_name,
      comp_addr: this.comp_addr,
      comp_phone: this.comp_phone,
      comp_email: this.comp_email
    }

    this.settingService.update(this.settingid, save1)
        .subscribe({
          next: (res) => {
            this.retrieveSetting();
          },
          error: (e) => console.error(e)
        });
  }

  save2(): void {
    this.possessionService.getAllOpen()
      .subscribe(poss => {
        if(poss.length>0){
          this._snackBar.open("Tidak bisa menutup karena ada POS Session Terbuka", "Tutup", {duration: 10000});
          this.retrieveSetting();
        }else{
          const save2 = {
            pos_shift: this.pos_shift
          }
          this.settingService.update(this.settingid, save2)
            .subscribe({
              next: (res) => {
                this.retrieveSetting();
              },
              error: (e) => console.error(e)
            });
        }
      })
    
  }
}
