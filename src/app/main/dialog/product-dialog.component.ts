import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class ProductDialogComponent implements OnInit {
  @Input() currentProd: Product = {
    sku: '',
    name: '',
    category: '',
    brand: '',
    active: false
  };
  isChecked = false;
  isNew = false;
  datsku?: string;
  datname?: string;
  datdesc?: string;
  datlprice?: number;
  datbprice?: number;
  datcost?: number;
  statusActive?: string;

  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  categoryid?: any;
  brandid?: any;

  a = 0; b = 0;
  isUpdated = 'update';

  //Add
  productadd: Product = {
    sku: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    active: true
  };

  //Select Category
  selectedCategory: string = "";
  selectedData: { valueCat: string; text: string } = {
    valueCat: "",
    text: ""
  };
  selectedCategoryControl = new FormControl(this.selectedCategory);
  selectedValue(event: MatSelectChange) {
    this.categoryid = event.value;
  }

  //Select Brand
  selectedBrand: string = "";
  selectedData2: { valueBrand: string; textBrand: string } = {
    valueBrand: "",
    textBrand: ""
  };
  selectedBrandControl = new FormControl(this.selectedBrand);
  selectedValue2(event: MatSelectChange) {
    this.brandid = event.value;
  }

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private globals: Globals,
    private logService: LogService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.datsku = this.data.sku;
      this.datname = this.data.name;
      this.datdesc = this.data.description;
      this.datlprice = this.data.listprice;
      this.datbprice = this.data.botprice;
      this.datcost = this.data.cost;
      if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
      if (this.data.category){
        this.selectedCategory = this.data.category._id;
      }else{
        this.selectedCategory = "";
      }
      if (this.data.brand){
        this.selectedBrand = this.data.brand._id;
      }else{
        this.selectedBrand = "";
      }
    } else{
      this.isNew = true;
      this.isChecked = true;
      this.statusActive = 'true';
      this.datsku = "";
      this.datname = "";
    }
    this.retrieveProduct();
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

  retrieveProduct(): void {
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

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (this.a+this.b==4){this.isUpdated = 'deactivate'};
    if (this.a+this.b==3){this.isUpdated = 'activate'};
    if (this.datsku != this.data.sku){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datsku + " to " + this.data.sku;
    }
    if (this.datname != this.data.name){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datname + " to " + this.data.name;
    }
    if (this.datdesc != this.data.description){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datdesc + " to " + this.data.description;
    }
    if (this.datlprice != this.data.listprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datlprice + " to " + this.data.listprice;
    }
    if (this.datbprice != this.data.botprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datbprice + " to " + this.data.botprice;
    }
    if (this.datcost != this.data.cost){
      this.isUpdated = this.isUpdated + ", from " 
      + this.datcost + " to " + this.data.cost;
    }
    const data = {
      sku: this.datsku,
      name: this.datname,
      description: this.datdesc,
      listprice: this.datlprice,
      botprice: this.datbprice,
      cost: this.datcost,
      category: this.categoryid,
      brand: this.brandid,
      active: this.isChecked
    };
    this.productService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          const log = {
            message: this.isUpdated,
            brand: "null",
            category: "null",
            product: res.id,
            partner: "null",
            warehouse: "null",
            user: this.globals.userid
          };
          this.logService.create(log)
          .subscribe({
            next: (logres) => {
              this.closeDialog();
            }
          });
        },
        error: (e) => console.error(e)
      });
  }

  createData(): void {
    const data = {
      sku: this.datsku,
      name: this.datname,
      description: this.datdesc,
      listprice: this.datlprice,
      botprice: this.datbprice,
      cost: this.datcost,
      category: this.categoryid,
      brand: this.brandid,
      active: this.isChecked
    };
    this.productService.create(data)
      .subscribe({
        next: (res) => {
          const log = {
            message: "add",
            brand: "null",
            category: "null",
            product: res.id,
            partner: "null",
            warehouse: "null",
            user: this.globals.userid
          };
          this.logService.create(log)
          .subscribe({
            next: (logres) => {
              this.closeDialog();
            }
          });
        },
        error: (e) => console.error(e)
      });
  }
}
