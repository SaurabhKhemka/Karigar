import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import * as $ from 'jquery';
import { CustomerService } from "../service/customer-service";
import { InventoryService } from "../service/inventory.service";
import { SharedService } from "../shared/shared.service";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  displayedColumns: string[] = [
    'sheetName',
    'serialNo',
    'grossWeight',
    'beadWeight',
    'netWeight',
    'a',
    'b',
    'c',
    'd',
    'karigarName',
    'excelNo',
    'productType',
    'huId',
    'itemId'
  ];
  filterData = {
    fromDate: null,
    toDate: null,
    customerId: '',
    type: ''
  };
  dataSource: any;
  isLoading: boolean = false;
  customers: any = [];
  userDetails: any;
  isAdmin: boolean = false;

  constructor(private customerService: CustomerService, private inventoryService: InventoryService, private snackBar: MatSnackBar, private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.sharedService.getUserDetails();
    this.isAdmin = this.userDetails.role === 'admin';
    if (this.isAdmin) {
      this.fetchAllCustomers();
    } else {
      this.filterData.customerId = this.userDetails.id;
      this.filterData.type = 'sale';
      this.displayedColumns = [
        'sheetName',
        'serialNo',
        'grossWeight',
        'beadWeight',
        'netWeight',
        'itemId'
      ];
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

  filterResults() {
    if (this.filterData.type === "inventory") {
      this.isLoading = true;
      this.inventoryService.getAllProducts().subscribe((response: any) => {
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
    } else {
      if (!this.filterData.type || !this.filterData.customerId) {
        this.snackBar.open("Please select type and customer", '', {
          duration: 2000,
        });
      } else {
        this.isLoading = true;
        this.inventoryService.getCustomerOrdersPurchasesWithinDateRange(this.filterData).subscribe((response: any) => {
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
    }
  }

  exportTable() {
    //TableUtil.exportTableToExcel('ExampleMaterialTable');
    this.exportExcel('SearchResults', 'SearchResults');
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
