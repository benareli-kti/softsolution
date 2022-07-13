import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';

import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Setting } from 'src/app/models/setting.model';
import { SettingService } from 'src/app/services/setting.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../../main/style/main.component.sass']
})
export class SettingComponent implements OnInit {
  stores?: Store[];
  settingid?: string;
  cost_general?: boolean = true;
  pos_shift?: boolean = false;
  restaurant?: boolean = false;
  comp_name?: string;
  comp_addr?: string;
  comp_phone?: string;
  comp_email?: string;

  //Table
  displayedColumns: string[] = ['name','address','phone','warehouse'];
  dataSource = new MatTableDataSource<Store>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private token: TokenStorageService,
    private settingService: SettingService,
    private storeService: StoreService,
    private possessionService: PossessionService
  ) { }

  ngOnInit(): void {
    this.retrieveSetting();
  }

  retrieveSetting(): void {
    this.settingService.getAll()
      .subscribe(setting => {
        this.settingid = setting[0].id;
        this.cost_general = setting[0].cost_general;
        this.comp_name = setting[0].comp_name;
        this.comp_addr = setting[0].comp_addr;
        this.comp_phone = setting[0].comp_phone;
        this.comp_email = setting[0].comp_email;
        this.pos_shift = setting[0].pos_shift;
        this.restaurant = setting[0].restaurant;
      })
    this.storeService.getAll()
      .subscribe(store => {
        this.dataSource.data = store;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

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
    const save2 = {
      cost_general: this.cost_general
    }

    this.settingService.update(this.settingid, save2)
      .subscribe(res => {
        this.retrieveSetting();
        this.reloadPage();
      });
  }

  save3(): void {
    this.possessionService.getAllOpen()
      .subscribe(poss => {
        if(poss.length>0){
          this._snackBar.open("Tidak bisa menutup karena ada POS Session Terbuka", "Tutup", {duration: 10000});
          this.retrieveSetting();
        }else{
          const save3 = {
            pos_shift: this.pos_shift,
            restaurant: this.restaurant,
          }
          this.settingService.update(this.settingid, save3)
            .subscribe({
              next: (res) => {
                this.retrieveSetting();
                this.reloadPage();
              },
              error: (e) => console.error(e)
            });
        }
      })
  }

  reloadPage(): void {
    window.location.reload();
  }
}
