import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from '@angular/material/table';
import * as $ from 'jquery';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { MaterialDialog } from "../modal/mat-dialog.component";
import { CustomerService } from "../service/customer-service";
import { InventoryService } from "../service/inventory.service";
import { SharedService } from "../shared/shared.service";

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
})
export class ScanComponent implements OnInit {
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner!: BarcodeScannerLivestreamComponent;

  barcodeValue = '';
  scannedProducts: any[] = [];

  filterData = {
    customerId: null,
    keyword: null
  };

  dataSource: any;
  displayedColumns: string[] = [
    'index',
    'customerName',
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
    'itemId',
    'action',
  ];
  customers: any = [];
  selectedIndex = 0;
  isLoading: boolean = false;
  userDetails: any;
  isAdmin: boolean = false;

  constructor(private customerService: CustomerService, private inventoryService: InventoryService, private dialog: MatDialog, private snackBar: MatSnackBar, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.userDetails = this.sharedService.getUserDetails();
    this.isAdmin = this.userDetails.role === 'admin';
    if (this.isAdmin) {
      this.fetchAllCustomers();
    }
  }

  fetchAllCustomers() {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe((response: any) => {
      this.customers = response;
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

  onTabChanged(event: any) {
    this.scannedProducts = [];
    this.dataSource.data = [];
    this.dataSource._updateChangeSubscription();
    this.filterData.customerId = null;
    this.filterData.keyword = null;
  }

  startScan() {
    if (this.selectedIndex === 0 && !this.filterData.customerId) {
      this.snackBar.open("Please select a customer", '', {
        duration: 2000,
      });
    } else {
      this.barcodeScanner.start();
    }
  }

  stopScan() {
    this.barcodeScanner.stop();
  }

  onValueChanges(result: any) {
    const self = this;
    let request: any;
    if (this.isAdmin) {
      switch (this.selectedIndex) {
        case 0:
          request = this.inventoryService.getInventoryItem(result.codeResult.code)
          break;
        case 1:
          request = this.inventoryService.getOrderItem(result.codeResult.code)
          break;
        case 2:
          request = this.inventoryService.getOrderItem(result.codeResult.code)
          break;
        default: break;
      }
    } else {
      request = this.inventoryService.getOrderItem(result.codeResult.code)
    }

    this.isLoading = true;
    request['subscribe']((response: any) => {
      response[0].customerId = response[0].customerId || self.filterData.customerId;
      response[0].customerName = self.customers.find((c: any) => c.customerId === response[0].customerId).customerName;
      if (this.isAdmin) {
        switch (self.selectedIndex) {
          case 0:
            response[0].orderDate = self.getTodayDate();
            break;
          case 1:
            response[0].sellDate = self.getTodayDate();
            break;
          case 2:
            response[0].returnDate = self.getTodayDate();
            break;
          default: break;
        }
      } else {
        response[0].sellDate = self.getTodayDate();
      }

      self.scannedProducts.push(response[0]);
      self.dataSource = new MatTableDataSource(self.scannedProducts);
      self.barcodeScanner.stop();
      self.isLoading = false;
    },
      (error: any) => {
        self.isLoading = false;
        self.snackBar.open("Please scan the product again", '', {
          duration: 2000,
        });
        self.barcodeScanner.stop();
      }
    );
  }

  onStarted(started: any) {
    console.log(started);
  }

  removeScannedProduct(index: any) {
    const dialogRef = this.dialog.open(MaterialDialog, {
      width: '500px',
      data: {
        title: 'Remove Scanned Product',
        content: 'Are you sure you want to remove this product?',
        noButton: 'Cancel',
        yesButton: 'YES',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  submitScannedProducts() {
    const self = this;
    let request: any;
    if (this.isAdmin) {
      switch (this.selectedIndex) {
        case 0:
          request = this.inventoryService.order(this.scannedProducts)
          break;
        case 1:
          request = this.inventoryService.sell(this.scannedProducts)
          break;
        case 2:
          request = this.inventoryService.return(this.scannedProducts)
          break;
        default: break;
      }
    } else {
      request = this.inventoryService.sell(this.scannedProducts)
    }

    self.isLoading = false;
    request['subscribe']((response: any) => {
      self.scannedProducts = [];
      self.dataSource.data = [];
      self.dataSource._updateChangeSubscription();
      self.isLoading = false;
    },
      (error: any) => {
        self.isLoading = false;
        self.snackBar.open("Server Error", '', {
          duration: 2000,
        });
      }
    );
  }

  getTodayDate() {
    const today = new Date();
    let dd: any = today.getDate(),
      mm: any = today.getMonth() + 1,
      yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return dd + '-' + mm + '-' + yyyy;
  }

  exportTable() {
    //TableUtil.exportTableToExcel('ExampleMaterialTable');
    this.exportExcel('ScannedProducts', 'ScannedProducts');
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
