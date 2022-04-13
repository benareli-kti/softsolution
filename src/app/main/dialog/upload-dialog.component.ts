import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';

type AOA = any[][];

@Component({
  selector: 'app-brand-upload',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class UploadDialogComponent implements OnInit {
  isPM = false;
  isTM = false;
  isIM = false;
  isAdm = false;
  isRes = false;
  checker = 0;
  alerted = false;

  //Data
  indexes: Array<any> = [];
  emptys: Array<any> = [];
  brands?: Brand[];
  productcats?: Productcat[];
  warehouses?: Warehouse[];
  partners?: Partner[];

  //XLSX
  sample: string = 'Sample Data';
  data1?: AOA;
  message!: string;
  datas!: any;
  converted!: string;
  type!: string;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private warehouseService: WarehouseService,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if(this.data=="brand"){
      this.data1 = [["description"], ["brand 1"], ["brand 2"], ["brand 3"]];
    }else if(this.data=="product category"){
      this.data1 = [["catid","description"], ["ID001","category 1"], 
        ["ID002","category 2"], ["ID003","category 3"]];
    }else if(this.data=="warehouse"){
      this.data1 = [["short","name"], ["WH1","Warehouse 1"], 
        ["WH2","Warehouse 2"], ["WH3","Warehouse 3"]];
    }else if(this.data=="partner"){
      this.data1 = [["code","name"], ["CUST1","John Doe"], 
        ["CUST2","Jane Doe"]];
    }
    this.alerted = false;
    this.checkRole();
    this.getAllData();
  }

  getAllData(): void {
    this.brandService.findAllActive()
      .subscribe(brand => {
        this.brands = brand;
      })
    this.productCatService.findAllActive()
      .subscribe(prodcat => {
        this.productcats = prodcat;
      })
    this.warehouseService.findAllActive()
      .subscribe(wh => {
        this.warehouses = wh;
      })
    this.partnerService.findAllActive()
      .subscribe(partner => {
        this.partners = partner;
      })
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="trans_manager") this.isTM=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="partner_manager") this.isPM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isPM || !this.isTM || !this.isIM || !this.isAdm) this.isRes = true;
  }

  onFileChange(event: any) {
    this.sample = '';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(event.target.files[0]);
    fileReader.onload = (event) => {
      let workbook = XLSX.read(event.target?.result,{type:'binary'});
      /*let sheets = 0;
      workbook.SheetNames.every(sheet => {
        this.datas = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        sheets = sheets + 1
        if(sheets==0) {
          return true;
        }
        else return false;
      })*/
      let wsname = workbook.SheetNames[0];
      let ws: XLSX.WorkSheet = workbook.Sheets[wsname];
      this.datas = XLSX.utils.sheet_to_json(ws, {raw:true});
      this.data1 = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.datas);
    }
  }

  startSequence(): void {
    console.log(this.datas);
    if(this.data=="brand"){
      let index = this.brands!.findIndex(a => a.description === this.datas[this.checker].description);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].description==''||this.datas[this.checker].description==null) this.emptys.push(this.checker + 1);
      this.checkers();
    }else if(this.data=="product category"){
      let index = this.productcats!.findIndex(a => a.description === this.datas[this.checker].description);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].description==''||this.datas[this.checker].description==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }else if(this.data=="warehouse"){
      let index = this.warehouses!.findIndex(a => a.name === this.datas[this.checker].name);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].name==''||this.datas[this.checker].name==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }else if(this.data=="partner"){
      let index = this.partners!.findIndex(a => a.name === this.datas[this.checker].name);
      if(index!=-1) this.indexes.push(this.checker + 1);
      if(this.datas[this.checker].name==''||this.datas[this.checker].name==null) this.emptys.push(this.checker + 1);
      this.checkers();  
    }
  }

  checkers(): void {
    this.checker = this.checker+1;
    if(this.checker == this.datas.length) {
      this.checker = 0;
      if(this.indexes.length>0||this.emptys.length>0){
        this.alerted = true;
        this.message = "Line " + this.indexes + " existed!";
        if(this.emptys.length>0) this.message = this.message + "\n" + "Line " + this.emptys + " empty!";
      }else{
        this.insertMany();
      }
    }
    else {
      this.startSequence();
    }
  }

  insertMany(): void {
    this.alerted = false;
    if(this.data=="brand"){
      this.brandService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {this.closeDialog();})
    }else if(this.data=="product category"){
      this.productCatService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {this.closeDialog();})
    }else if(this.data=="warehouse"){
      this.warehouseService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {this.closeDialog();})
    }else if(this.data=="partner"){
      this.partnerService.createMany(this.globals.userid, this.datas)
        .subscribe(dat => {this.closeDialog();})
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    this.startSequence();
  }
}
