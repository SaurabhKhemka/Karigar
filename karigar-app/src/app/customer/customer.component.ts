import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'underscore';
import { MaterialDialog } from '../modal/mat-dialog.component';
import { CustomerService } from "../service/customer-service";
import { CustomerFormComponent } from './customer-form/customer-form.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = [
    'customerName',
    'emailId',
    'phoneNumber',
    'mobileNumber',
    'address',
    'state',
    'district',
    'pincode',
    'action',
  ];
  dataSource: any;
  isLoading: boolean = false;
  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchAllCustomers();
  }

  fetchAllCustomers() {
    this.customerService.getCustomers().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
    },
      (error) => console.log(error)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCustomer(customer: any) {
    const c = _.clone(customer);
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '500px',
      data: {
        title: c.customerId ? 'Update Customer Details' : 'Add Customer Details',
        selectedCustomer: c,
        noButton: 'Cancel',
        yesButton: 'SAVE',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.fetchAllCustomers();
    });
  }

  deleteCustomer(customer: any) {
    const dialogRef = this.dialog.open(MaterialDialog, {
      width: '500px',
      data: {
        title: 'Delete Customer Details',
        content: 'Are you sure you want to delete customer?',
        noButton: 'Cancel',
        yesButton: 'YES',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.customerService.deleteCustomer(customer.customerId).subscribe(
          (data: any) => {
            if (data) {
              this.fetchAllCustomers();
            }
          },
          (error) => console.log(error)
        );
      }
    });
  }
}
