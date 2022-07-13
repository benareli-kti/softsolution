import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Tax } from 'src/app/models/tax.model';
import { TaxService } from 'src/app/services/tax.service';
import { Uom } from 'src/app/models/uom.model';
import { UomService } from 'src/app/services/uom.service';
import { Qop } from 'src/app/models/qop.model';
import { QopService } from 'src/app/services/qop.service';
import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class ProductDialogComponent implements OnInit {
  isChecked = false;
  isStock = true;
  isNew = false;
  isDis = false;
  bbigger = false;
  isCG?: boolean = true;
  oriid?: string;
  orisku?: string;
  oriname?: string;
  oridesc?: string;
  orisuom?: any;
  orisuomn?: string;
  oripuom?: any;
  oripuomn?: string;
  oribarc?: string;
  orilprice?: number;
  oribprice?: number;
  oricost?: number;
  oriimage?: string;
  orimin?: number;
  orimax?: number;
  oricategoryid?: any;
  oribrandid?: any;
  oripartnerid?: any;
  oritaxinid?: any;
  oritaxoutid?: any;

  imageData: string;

  datid?: string;
  datsku?: string;
  datname?: string;
  datdesc?: string;
  datsuom?: any;
  datpuom?: any;
  datbarcode?: string;
  datlprice?: number;
  datbprice?: number;
  datcost?: number;
  datisstock?: string;
  datmin?: number;
  datmax?: number;
  categoryid?: any;
  brandid?: any;
  partnerid?: any;
  taxinid?: any;
  taxoutid?: any;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;

  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  partners?: Partner[];
  taxs?: Tax[];
  uoms?: Uom[];

  a = 0; b = 0;
  isUpdated = 'update';
  log = 0;

  //Table
  qops?: Qop[]; 
  displayedColumns: string[] = 
  ['warehouse', 'partner', 'qty', 'cost'];
  dataSource = new MatTableDataSource<Qop>();

  //Dialog Data
  clickedRows = null; 

  //Upload File
  fileName: string;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private _snackBar: MatSnackBar,
    private uploadService: FileUploadService,
    private productService: ProductService,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private uomService: UomService,
    private partnerService: PartnerService,
    private taxService: TaxService,
    private qopService: QopService,
    private stockmoveService: StockmoveService,
    private globals: Globals,
    private logService: LogService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.checkData(this.data);
    } else{
      this.isNew = true;
      this.isChecked = true;
      this.datisstock = 'true';
      this.statusActive = 'true';
      this.datdesc = "";
      this.datsku = "";
      this.datname = "";
    }
    this.isCG = this.globals.cost_general;
    this.imageInfos = this.uploadService.getFiles();
    this.retrieveProduct();
    this.checkRole();
    
    this.imageInfos = this.uploadService.getFiles();
  }

  onValueChange(file: File[]) {
    console.log("File changed!");
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
    this.retrieveLog();
  }

  checkData(id: any){
    this.productService.get(id)
      .subscribe(prod => {
        this.datid = prod.id;
        this.datsku = prod.sku;
        this.orisku = prod.sku;
        this.datname = prod.name;
        this.oriname = prod.name;
        this.datdesc = prod.description;
        this.oridesc = prod.description;
        this.datbarcode = prod.barcode;
        this.oribarc = prod.barcode;
        this.datlprice = prod.listprice;
        this.orilprice = prod.listprice;
        this.datbprice = prod.botprice;
        this.oribprice = prod.botprice;
        this.datcost = prod.cost;
        this.oricost = prod.cost;
        this.datmin = prod.min;
        this.orimin = prod.min;
        this.datmax = prod.max;
        this.orimax = prod.max;
        this.oriimage = prod.image;
        if (prod.active == true){
          this.statusActive = 'true';
          this.isChecked = true;
          this.a = 0;
        } else {
          this.statusActive = 'false';
          this.isChecked = false;
          this.a = 1;
        }
        if (prod.isStock == true){
          this.datisstock = 'true';
          this.isStock = true;
        }else{
          this.datisstock = 'false';
          this.isStock = false;
        }
        if(prod.category) {
          this.categoryid = prod.category._id;
          this.oricategoryid = prod.category._id;
        }
        if(prod.brand) {
          this.brandid = prod.brand._id;
          this.oribrandid = prod.brand._id;
        }
        if(prod.supplier) {
          this.partnerid = prod.supplier._id;
          this.oripartnerid = prod.supplier._id;
        }
        this.datsuom = prod.suom._id;
        this.datpuom = prod.puom._id;
        this.orisuom = prod.suom._id;
        this.oripuom = prod.suom._id;
        if(prod.taxin) {
          this.taxinid = prod.taxin._id;
          this.oritaxinid = prod.taxin._id;
        }
        if(prod.taxout) {
          this.taxoutid = prod.taxout._id;
          this.oritaxoutid = prod.taxout._id;
        }
    });
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

  onStockChange(vals: string) {
    this.datisstock = vals;
    if (this.datisstock == 'true'){
      this.isStock = true;
    }else{
      this.isStock = false;
    }
  }

  retrieveProduct(): void {
    this.productCatService.findAllActive()
      .subscribe(dataPC => {
        this.productcats = dataPC;
      });
    this.brandService.findAllActive()
      .subscribe(dataB => {
        this.brands = dataB;
      });
    this.taxService.getAll()
      .subscribe(tax => {
        this.taxs = tax;
      });
    this.uomService.getAll()
      .subscribe(uom => {
        this.uoms = uom;
      })
    this.qopService.findByProduct(this.data)
      .subscribe(dataQop => {
        this.dataSource.data = dataQop;
      })
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
      })
    this.stockmoveService.getProd(this.datid)
      .subscribe(sm => {
        if(sm.length>0) this.isDis = true;
      })
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe(logPR => {
          logPR = logPR.filter(dataPR => dataPR.product === this.data);
          this.log = logPR.length;
        })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  checkImage(): void {
    if (this.selectedFiles){

    }else {
      this.checkBigger();
    }
  }

  checkBigger(): void {
    if(Number(this.datbprice) > Number(this.datlprice)){
      this.bbigger = true;
    }else{
      if (this.isNew){
        this.createData();
      }else{
        this.updateData();
      }
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.fileName = file.name;
          this.message.push(msg);
          this.imageInfos = this.uploadService.getFiles();
        },
        error: (err: any) => {
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  updateData(): void {
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.categoryid || this.categoryid == null
      || !this.datsuom || this.datsuom == null
      || !this.datpuom || this.datpuom == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if(!this.fileName){this.fileName = this.oriimage!};
      if(this.a+this.b==4){this.isUpdated = 'deactivate'};
      if(this.a+this.b==3){this.isUpdated = 'activate'};
      if(this.datsku != this.orisku){
        this.isUpdated = this.isUpdated + ", from " 
        + this.orisku + " to " + this.datsku;
      }
      if (this.datname != this.oriname){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oriname + " to " + this.datname;
      }
      if (this.datdesc != this.oridesc){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oridesc + " to " + this.datdesc;
      }
      if (this.datbarcode != this.oribarc){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oribarc + " to " + this.datbarcode;
      }
      if (this.datlprice != this.orilprice){
        this.isUpdated = this.isUpdated + ", from " 
        + this.orilprice + " to " + this.datlprice;
      }
      if (this.datbprice != this.oribprice){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oribprice + " to " + this.datbprice;
      }
      if (this.datcost != this.oricost){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oricost + " to " + this.datcost;
      }
      if (this.categoryid != this.oricategoryid){
        this.isUpdated = this.isUpdated + ", Kategori diganti";
      }
      if (this.brandid != this.oribrandid){
        this.isUpdated = this.isUpdated + ", Merk diganti";
      }
      if (this.partnerid != this.oripartnerid){
        this.isUpdated = this.isUpdated + ", Supplier diganti";
      }
      if (this.datsuom != this.orisuom){
        this.isUpdated = this.isUpdated + ", Satuan Jual diganti";
      }
      if (this.datpuom != this.oripuom){
        this.isUpdated = this.isUpdated + ", Satuan Beli diganti";
      }
      if (this.taxinid != this.oritaxinid){
        this.isUpdated = this.isUpdated + ", Pajak Masukan diganti";
      }
      if (this.taxoutid != this.oritaxoutid){
        this.isUpdated = this.isUpdated + ", Pajak Keluaran diganti";
      }
      if (this.datmin != this.orimin){
        this.isUpdated = "Min:" + this.isUpdated + ", from " 
        + this.orimin + " to " + this.datmin;
      }
      if (this.datmax != this.orimax){
        this.isUpdated = "Max:" + this.isUpdated + ", from " 
        + this.orimax + " to " + this.datmax;
      }
      if (this.fileName != this.oriimage){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oriimage + " to " + this.fileName;
      }
      const dataProd = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        suom: this.datsuom,
        puom: this.datpuom,
        cost: this.datcost,
        isStock: this.isStock,
        category: this.categoryid,
        taxin: this.taxinid,
        taxout: this.taxoutid,
        image: this.fileName,
        brand: this.brandid,
        min: this.datmin,
        max: this.datmax,
        supplier: this.partnerid,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid
      };
      this.productService.update(this.data, dataProd)
        .subscribe(res => {
          this.closeDialog();
        });
    }
  }

  createData(): void {
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.categoryid || this.categoryid == null){
      this._snackBar.open("Field (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        suom: this.datsuom,
        puom: this.datpuom,
        cost: this.datcost,
        isStock: this.isStock,
        category: this.categoryid,
        brand: this.brandid,
        taxin: this.taxinid,
        taxout: this.taxoutid,
        image: 'default.png',
        qoh: 0,
        min: this.datmin,
        max: this.datmax,
        supplier: this.partnerid,
        active: this.isChecked,
        user: this.globals.userid
      };
      this.productService.create(data)
        .subscribe(res => {
          this.closeDialog();
        });
    }
  }
}