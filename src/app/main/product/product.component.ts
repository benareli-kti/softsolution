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
  styleUrls: ['../style/main.component.sass']
})
export class ProductComponent implements OnInit {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  isShow = false;
  categoryid?: any;
  brandid?: any;

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

  //Table
  displayedColumns: string[] = 
  ['sku', 'name', 'description', 'listprice',
  'category', 'brand'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.retrieveProduct();
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

    this.productCatService.findAllActive()
      .subscribe({
        next: (dataPC) => {
          this.productcats = dataPC;
        },
        error: (e) => console.error(e)
    });

    this.brandService.findAllActive()
      .subscribe({
        next: (dataB) => {
          this.brands = dataB;
        },
        error: (e) => console.error(e)
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

  applyTblFilter(event: MatSelectChange) {
    //this.dataSource.filter = this.selection.trim().toLowerCase()
    console.log(event.value);
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