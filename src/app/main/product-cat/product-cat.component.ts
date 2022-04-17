import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { ProductcatDialogComponent } from '../dialog/productcat-dialog.component';
import { UploadDialogComponent } from '../dialog/upload-dialog.component';

//console.log(this.roles?.filter(role => role.name === "admin").map(role => role._id)); FUCKING HOLY GRAIL
@Component({
  selector: 'app-product-cat',
  templateUrl: './product-cat.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class ProductCatComponent implements OnInit {
  productcats?: Productcat[];
  isIU = false;
  isIM = false;
  isAdm = false;
  isShow = false;
  
  //Add
  productcatadd: Productcat = {
    catid: '',
    description: '',
    active: true
  };
  
  //View
  currentProductCat: Productcat = {};
  currentIndex = -1;
  searchProdCat='';
  
  //Table
  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<Productcat>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private globals: Globals,
    private _snackBar: MatSnackBar,
    private logService: LogService,
    private productCatService: ProductCatService,
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
    this.retrieveProductCat();
  }

  retrieveProductCat(): void {
    if(this.isIM || this.isAdm){
      this.productCatService.getAll()
        .subscribe(category => {
          this.productcats = category;
          this.dataSource.data = category;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }else{
      this.productCatService.findAllActive()
        .subscribe(category => {
          this.dataSource.data = category;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }
  }

  searchActive(): void {
    this.dataSource.data = this.productcats!.filter(role => role.active === true);
  }
  searchInactive(): void {
    this.dataSource.data = this.productcats!.filter(role => role.active === false);
  }

  saveProductCat(): void {
    if(!this.productcatadd.catid || this.productcatadd.catid == null
      || !this.productcatadd.description || this.productcatadd.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        catid: this.productcatadd.catid,
        description: this.productcatadd.description,
        active: this.productcatadd.active,
        user: this.globals.userid
      };
      this.productCatService.create(data)
        .subscribe({
          next: (res) => {
            this.retrieveProductCat();
            this.productcatadd = {
              catid: '',
              description: '',
              active: true
            };
          },
          error: (e) => console.error(e)
        });
    }
  }

  /*applyTblFilter(filterValue: string) {
    this.dataSource.filter = this.selection.trim().toLowerCase()
  }*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Productcat) {
    //console.log('Row clicked', row);
    const dialog = this.dialog.open(ProductcatDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveProductCat());
  }

  openUpload() {
    const dialog = this.dialog.open(UploadDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: "product category"
    })
      .afterClosed()
      .subscribe(() => this.retrieveProductCat());
  }

}
