import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

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
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
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
    }else{
      this.isChecked = false;
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
          this.closeDialog();
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
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
