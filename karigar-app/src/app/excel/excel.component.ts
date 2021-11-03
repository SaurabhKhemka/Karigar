import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import * as $ from 'jquery';
import { InventoryService } from "../service/inventory.service";
import { SharedService } from "../shared/shared.service";

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss'],
})
export class ExcelComponent implements OnInit {
  fileContent: any;

  displayedColumns: string[] = [
    'sheetName',
    'serialNo',
    'grossWeight',
    'netWeight',
    'beadWeight',
    'a',
    'b',
    'c',
    'd',
    'e',
    'karigarName',
    'excelNo',
    'itemId'
  ];
  dataSource: any;
  isLoading: boolean = false;
  sheets: any;
  filterData = {
    sheetName: null
  }
  userDetails: any;
  selectedFileForUpload: any;
  fd: any;
  constructor(
    private inventoryService: InventoryService, private snackBar: MatSnackBar, private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.sharedService.getUserDetails();
    this.getSheets();
  }

  chooseFile(event: any) {
    if (window['FileReader'] && window['Blob']) {
      const file = event.target.files[0];

      const fileReader = new FileReader(),
        self = this;
      // fileReader.readAsDataURL(file);
      fileReader.onloadend = function (e) {
        self.displayUploadedFile(fileReader, file);
      };
      fileReader.readAsArrayBuffer(file);

      this.fd = new FormData();
      this.fd.append('file', file);

    }


  }

  displayUploadedFile(reader: any, file: any) {
    this.selectedFileForUpload = file.name;
    reader.readAsDataURL(file);
    reader.onloadend = this.setFileContent.bind(this);
  }

  setFileContent(event: any) {
    this.fileContent = event.target.result.replace(
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,',
      ''
    );
  }

  uploadFile() {
    this.isLoading = true;
    const fileDetails = {
      fileName: this.selectedFileForUpload,
      fileContent: this.fileContent,
    };
    this.inventoryService.uploadFile(this.fd).subscribe(
      (response) => {
        this.selectedFileForUpload = null;
        this.getSheets();
      },
      (err) => {
        this.isLoading = false;
        this.snackBar.open("Server Error", '', {
          duration: 2000,
        });
      }
    );
  }

  getSheets() {
    this.isLoading = true;
    this.inventoryService.getSheetName().subscribe((response: any) => {
      this.sheets = response;
      this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
        this.snackBar.open("Server Error", '', {
          duration: 2000,
        });
      }
    );
  }

  onSheetChange(event: any) {
    this.isLoading = true;
    this.inventoryService.getProducts(event.value).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.isLoading = false;
    },
      (error) => {
        this.isLoading = false;
        this.snackBar.open("Server Error", '', {
          duration: 2000,
        });
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportTable() {
    //TableUtil.exportTableToExcel('ExampleMaterialTable');
    this.exportExcel('ProductsList', 'ProductsList');
  }

  exportExcel(id: string, name: string) {
    //<table> id and filename
    var today = new Date();
    var date =
      ('0' + today.getDate()).slice(-2) +
      '-' +
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '-' +
      today.getFullYear();

    var file_name = name + '_' + date + '.xls'; //filename with current date, change if needed
    var meta =
      '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
    var html: any = $('#' + id).clone();

    html.find('.remove').remove(); //add the 'remove' class on elements you do not want to show in the excel

    html.find('br').attr('style', 'mso-data-placement:same-cell'); //make line breaks show in single cell
    html = '<table>' + html.html() + '</table>';

    var uri =
      'data:application/vnd.ms-excel,' + encodeURIComponent(meta + html);
    var a = $('<a>', { href: uri, download: file_name });
    $(a)[0].click();
  }
}
