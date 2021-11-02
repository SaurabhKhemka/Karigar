import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import * as $ from 'jquery';
import { TableUtil } from '../core/tableUtils';
import { CustomerService } from "../service/customer-service";
import { InventoryService } from "../service/inventory.service";


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
    'netWeight',
    'beadWeight',
    'a',
    'b',
    'c',
    'd',
    'e',
    'karigarName',
    'excelNo'
  ];
  filterData = {
    fromDate: null,
    toDate: null,
    customerId: null,
    type: null
  };
  dataSource: any;
  isLoading: boolean = false;
  customers: any;

  constructor(private customerService: CustomerService, private inventoryService: InventoryService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchAllCustomers();
  }

  fetchAllCustomers() {
    this.customerService.getCustomers().subscribe((response: any) => {
      this.customers = response;
    },
      (error) => console.log(error)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterResults() {
    if (!this.filterData.type || !this.filterData.customerId) {
      this.snackBar.open("Please select type and customer", '', {
        duration: 2000,
      });
    } else {
      this.inventoryService.getCustomerOrdersPurchasesWithinDateRange(this.filterData).subscribe((response: any) => {
        this.dataSource = new MatTableDataSource(response);
      },
        (error) => console.log(error)
      );
    }
  }

  exportTable() {
    //TableUtil.exportTableToExcel('ExampleMaterialTable');
    this.exportExcel('ExampleMaterialTable', 'ExampleMaterialTable');
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

  exportNormalTable() {
    TableUtil.exportTableToExcel('ExampleNormalTable');
  }

}
