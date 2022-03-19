import { Component, OnInit, ViewChild } from '@angular/core';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { ProductcatDialogComponent } from '../dialog/productcat-dialog.component';

@Component({
  selector: 'app-product-cat',
  templateUrl: './product-cat.component.html',
  styleUrls: ['./product-cat.component.sass']
})
export class ProductCatComponent implements OnInit {
  productcats?: Productcat[];
  isShow = false;
  filtered: Object[];
  
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

  //Filter Data
  actives=['All','true','false'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  selection: any;

  //New
  defaultValue = "All";
  dataFilters: DataFilter[]=[];
  filterDictionary= new Map<string,string>();
  //one is boolean , one is string

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private productCatService: ProductCatService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveProductCat();

    this.dataFilters.push({name:'active',options:this.actives,
      defaultValue:this.defaultValue});
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Productcat] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
  }

  retrieveProductCat(): void {
    this.productCatService.findAllActive()
      .subscribe(prodcat => {
        this.dataSource.data = prodcat;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  searchData(): void {
    this.productCatService.findByDesc(this.searchProdCat)
      .subscribe(prodcat => {
        this.dataSource.data = prodcat;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  saveProductCat(): void {
    const data = {
      catid: this.productcatadd.catid,
      description: this.productcatadd.description,
      active: this.productcatadd.active
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

  /*applyTblFilter(filterValue: string) {
    this.dataSource.filter = this.selection.trim().toLowerCase()
  }*/

  applyTblFilter(ob:MatSelectChange,datafilter:DataFilter) {
    this.filterDictionary.set(datafilter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

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

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}
