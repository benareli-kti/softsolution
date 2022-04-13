import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';

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

  //Data
  indexes: Array<any> = [];
  brands?: Brand[];

  //XLSX
  message!: string;
  datas!: any;
  converted!: string;
  type!: string;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private brandService: BrandService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    //if (this.data) console.log(this.data);
    /*if (this.data.active == true){
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }*/
    //this.currDescription = this.data.description;
    this.datas = [{data: "Sample1"},{data: "Sample2"}]
    this.checkRole();
    this.getAllData();
  }

  getAllData(): void {
    this.brandService.findAllActive()
      .subscribe(brand => {
        this.brands = brand;
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
      this.datas = XLSX.utils.sheet_to_json(ws);
      console.log(this.datas);
    }
  }

  startBrand(): void {
    let index = this.brands!.findIndex(a => a.description === this.datas[this.checker].description);
    if(index!=-1) this.indexes.push(this.checker + 1);
    this.checkers();  
  }

  checkers(): void {
    this.checker = this.checker+1;
    if(this.checker == this.datas.length) {
      this.checker = 0;
      if(this.indexes.length>0){
        console.log(this.indexes);
        this.message = "Line " + this.indexes + " existed";
      }else{
        this.insertManyBrand();
      }
    }
    else this.startBrand();
  }

  insertManyBrand(): void {
    this.brandService.createMany(this.globals.userid, this.datas)
      .subscribe(dat => {
        this.closeDialog();
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if(this.data=="brand") this.startBrand();
  }
}
