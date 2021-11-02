import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})


export class CustomerService {
  public readonly API_ENDPOINT: string = 'http://localhost:2017/';
  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get(this.API_ENDPOINT + '/get/customerDetails');

    // return new Promise((resolve) => {
    //   resolve([
    //     {
    //       "customerId": "0696f27b-b9e2-49e3-8a7a-b76e25f4c472",
    //       "customerName": "Test",
    //       "emailId": "test123@gmail.com",
    //       "mobileNumber": "9876543210",
    //       "phoneNumber": "5498221170",
    //       "address": "Badi Patan Devi Mandir",
    //       "district": "Patna",
    //       "state": "Bihar",
    //       "pincode": 800017
    //     }
    //   ])
    // });
  }

  saveCustomer(reqObj: any) {
    return this.http.post(this.API_ENDPOINT + (reqObj.customerId ? '/update/' : '/add/') + 'customerDetails', reqObj);
  }

  deleteCustomer(customerId: any) {
    return this.http.delete(this.API_ENDPOINT + '/remove/customerDetails?customerId=' + customerId);
  }

  fetchStatesandDistricts(pincode: string) {
    if (pincode.length === 6) {
      let stateArray: any = [],
        districtArray: any = [];
      this.http.get(
        'https://api.postalpincode.in/pincode/' + pincode
      ).subscribe(
        (data: any) => {
          if (data && data[0].Status === 'Success') {
            stateArray = _.uniq(data[0].PostOffice, function (x) {
              return x.State;
            });

            districtArray = _.uniq(data[0].PostOffice, function (x) {
              return x.District;
            });
          }
          return {
            states: stateArray,
            districts: districtArray,
          };
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
