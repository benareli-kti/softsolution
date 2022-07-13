import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { Uomcat } from 'src/app/models/uomcat.model';
import { UomcatService } from 'src/app/services/uomcat.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class UomComponent implements OnInit {
  uomcats?: Uomcat[];
  uoms?: Uom[];
  datcat?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;

  //Add
  uomadd: Uom = {
    uom_name: '',
    uom_cat: '',
    ratio: 0,
  };

  //Table
  displayedColumns: string[] = ['name','kategori','ratio'];
  dataSource = new MatTableDataSource<Uom>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private uomService: UomService,
    private uomcatService: UomcatService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveUom();
  }

  retrieveUom(): void {
    this.uomcatService.getAll()
      .subscribe(uomcat => {
        this.uomcats = uomcat;
    });
    this.uomService.getAll()
      .subscribe(uom => {
        this.uoms = uom;
        this.dataSource.data = uom;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  saveUom(): void {
    if(!this.uomadd.uom_name || this.uomadd.uom_name == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        uom_name: this.uomadd.uom_name,
        uom_cat: this.datcat,
        ratio: this.uomadd.ratio,
        user: this.globals.userid
      };
      this.uomService.create(data)
        .subscribe(res => {
          this.retrieveUom();
          this.uomadd = {
            uom_name: '',
            uom_cat: '',
            ratio: 0,
          };
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
