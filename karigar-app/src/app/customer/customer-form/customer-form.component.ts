import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'underscore';
import { MaterialDialog } from '../../modal/mat-dialog.component';
import { CustomerService } from "../../service/customer-service";

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
  @ViewChild('customerForm', { static: false })
  customerForm!: NgForm;
  stateArray: any[] = [];
  districtArray: any[] = [];
  isLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MaterialDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void { }

  saveCustomer() {
    if (this.customerForm.form.valid) {
      this.customerService.saveCustomer(this.data.selectedCustomer).subscribe((response: any) => {

      })

    } else {
      _.each(Object.keys(this.customerForm.form.controls), (control: any) => {
        this.customerForm.form.controls[control].markAsTouched();
      });
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
