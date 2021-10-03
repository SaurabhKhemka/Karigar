import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';
import { ApiClientService } from '../api-client.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  selectedCustomer = {
    id: '',
    name: '',
    email: '',
    phone: '',
    mobile: '',
    address: '',
    pincode: '',
    state: '',
    city: '',
  };

  showSpinner: boolean = false;

  @ViewChild('customerForm', { static: false })
  customerForm!: NgForm;
  stateArray: any[] = [];
  districtArray: any[] = [];

  customers: any[] = [];
  constructor(private apiClient: ApiClientService) {}

  ngOnInit(): void {
    this.customers = [
      {
        id: 1,
        name: 'agarwal',
        email: 'wewqeqwe',
        phone: '456432145',
        mobile: '345632213',
        address: 'ewewqewq',
        state: 'ewwewqewq',
        city: 'ewrewrewr',
        pincode: 'ewwqewqe',
      },
      {
        id: 2,
        name: 'agarwal',
        email: 'wewqeqwe',
        phone: '456432145',
        mobile: '345632213',
        address: 'ewewqewq',
        state: 'ewwewqewq',
        city: 'ewrewrewr',
        pincode: 'ewwqewqe',
      },
    ];
  }

  fetchStatesandDistricts(pincode: string) {
    if (this.customerForm.form.controls.pincode.valid) {
      this.apiClient.fetchStatesandDistricts(pincode).subscribe((data: any) => {
        console.log(data);
        if (data && data[0].Status === 'Success') {
          this.stateArray = _.uniq(data[0].PostOffice, function (x) {
            return x.State;
          });

          this.districtArray = _.uniq(data[0].PostOffice, function (x) {
            return x.District;
          });
        } else {
          alert('nothing found');
        }
      });
    }
  }

  updateCustomer() {
    if (this.customerForm.form.valid) {

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
