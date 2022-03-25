import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-warehouse-dialog',
  templateUrl: './warehouse-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class WarehouseDialogComponent implements OnInit {
  @Input() currentWarehouse: Warehouse = {
    short: '',
    name: '',
    active: false
  };
  isChecked = false;
  statusActive?: string;

  a = 0; b = 0;
  isUpdated = 'update';
  currName?: string;
  currShort?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<WarehouseDialogComponent>,
    private globals: Globals,
    private logService: LogService,
    private warehouseService: WarehouseService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
    this.currName = this.data.name;
    this.currShort = this.data.short;
    this.retrieveLog();
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe({
        next: (logPR) => {
          logPR = logPR.filter
          (dataPR => dataPR.warehouse === this.data.id)
          console.log(logPR);
          this.log = logPR.length;
        },
        error: (e) => console.error(e)
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
      this.b = 2;
    }else{
      this.isChecked = false;
      this.b = 4;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (this.a+this.b==4){this.isUpdated = 'deactivate'};
    if (this.a+this.b==3){this.isUpdated = 'activate'};
    if (this.currName != this.data.name){
      this.isUpdated = this.isUpdated + ", from " 
      + this.currName + " to " + this.data.name;
    }
    if (this.currShort != this.data.short){
      this.isUpdated = this.isUpdated + ", from " 
      + this.currShort + " to " + this.data.short;
    }
    const data = {
      short: this.data.short,
      name: this.data.name,
      active: this.isChecked,
      message: this.isUpdated,
      user: this.globals.userid
    };
    this.warehouseService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
