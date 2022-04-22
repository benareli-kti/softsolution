import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { BrandDialogComponent } from '../dialog/brand-dialog.component';
import { UploadDialogComponent } from '../dialog/upload-dialog.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class BrandComponent implements OnInit {
  brands?: Brand[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  
  //Add
  brandadd: Brand = {
    description: '',
    active: true
  };
  
  //View
  currentBrand: Brand = {};
  currentIndex = -1;
  searchBrand='';
  
  //Table
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Brand>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private brandService: BrandService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveBrand();
  }

  retrieveBrand(): void {
    if(this.isIM || this.isAdm){
      this.brandService.getAll()
        .subscribe(brand => {
          this.brands = brand;
          this.dataSource.data = brand;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }else{
      this.brandService.findAllActive()
        .subscribe(brand => {
          this.dataSource.data = brand;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }
  }

  searchActive(): void {
    this.dataSource.data = this.brands!.filter(role => role.active === true);
  }
  searchInactive(): void {
    this.dataSource.data = this.brands!.filter(role => role.active === false);
  }

  saveBrand(): void {
    if(!this.brandadd.description || this.brandadd.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        description: this.brandadd.description,
        active: this.brandadd.active,
        user: this.globals.userid
      };
      this.brandService.create(data)
        .subscribe(res => {
          this.retrieveBrand();
          this.brandadd = {
            description: '',
            active: true
          };
        });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Brand) {
    const dialog = this.dialog.open(BrandDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveBrand());
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "brand"
    })
      .afterClosed()
      .subscribe(() => this.retrieveBrand());
  }

}