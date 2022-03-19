import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";

import { Product } from 'src/app/models/product.model';
import { Productcat } from 'src/app/models/productcat.model';
import { Brand } from 'src/app/models/brand.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { BrandService } from 'src/app/services/brand.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { ProductDialogComponent } from '../dialog/product-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  isShow = false;
  categoryid?: any;
  brandid?: any;

  //Select Category
  selectedCategory: string = "";
  selectedData: { valueCat: string; text: string } = {
    valueCat: "",
    text: ""
  };
  selectedCategoryControl = new FormControl(this.selectedCategory);
  selectedValue(event: MatSelectChange) {
    this.categoryid = event.value
  }

  //Select Brand
  selectedBrand: string = "";
  selectedData2: { valueBrand: string; textBrand: string } = {
    valueBrand: "",
    textBrand: ""
  };
  selectedBrandControl = new FormControl(this.selectedBrand);
  selectedValue2(event: MatSelectChange) {
    this.brandid = event.value
  }

  //Add
  productadd: Product = {
    sku: '',
    name: '',
    category: '',
    brand: '',
    active: true
  };
  
  //View
  currentProduct: Product = {};
  searchProd='';

  //Product Category
  currentProductCat: Productcat = {};
  //Brand
  currentBrand: Brand = {};

  //Table
  displayedColumns: string[] = 
  ['sku', 'name', 'description', 'listprice', 'botprice',
  'category', 'brand'];
  dataSource = new MatTableDataSource<Product>();
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
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveProduct();

    this.dataFilters.push({name:'active',options:this.actives,
      defaultValue:this.defaultValue});
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Product] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
  }

  retrieveProduct(): void {
    this.productService.findAllActive()
      .subscribe(prod => {
        /*prod = prod.filter
        (data => data.active === true)*/
        this.dataSource.data = prod;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });

    this.productCatService.getAll()
      .subscribe({
        next: (dataPC) => {
          this.productcats = dataPC;
        },
        error: (e) => console.error(e)
      });

    this.brandService.getAll()
      .subscribe({
        next: (dataB) => {
          this.brands = dataB;
        },
        error: (e) => console.error(e)
      });
  }

  searchData(): void {
    this.productService.findByDesc(this.searchProd)
      .subscribe(prod => {
        this.dataSource.data = prod;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  saveProduct(): void {
    const data = {
      sku: this.productadd.sku,
      name: this.productadd.name,
      category: this.categoryid,
      brand: this.brandid,
      active: this.productadd.active
    };
    this.productService.create(data)
      .subscribe({
        next: (res) => {
          this.retrieveProduct();
          this.productadd = {
            sku: '',
            name: '',
            category: '',
            brand: '',
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

  openDialog(row: Product) {
    const dialog = this.dialog.open(ProductDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(ProductDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}