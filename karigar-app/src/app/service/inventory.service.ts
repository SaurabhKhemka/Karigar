import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  public readonly API_ENDPOINT: string = 'https://www.userdomain.com/';
  constructor(private http: HttpClient) { }

  uploadFile(data: any) {
    return this.http.post(
      '/cphm/lab/generalLabTestFile/individual/' +
      '' +
      '/labTestId/' +
      '' +
      '/attachFile',
      data
    );
  }

  addNewRows(reqObj: any) {
    return this.http.post(this.API_ENDPOINT + '/inventory/addNewRows', reqObj)
  }

  getSheetName() {
    return this.http.get(this.API_ENDPOINT + '/inventory/getSheetName');

    // return new Promise((resolve) => {
    //   resolve(["1", "2"])
    // });
  }

  getProducts(sheetName: string) {
    return this.http.get(this.API_ENDPOINT + '/inventory/getSheetItem?sheetName=' + sheetName);

    // return new Promise((resolve) => {
    //   resolve([
    //     {
    //       "sheetName": "2",
    //       "serialNo": "1",
    //       "grossWeight": "5.1",
    //       "netWeight": "6.1",
    //       "beadWeight": "4.1",
    //       "a": "1",
    //       "b": "2",
    //       "c": "3",
    //       "e": "5",
    //       "karigarName": "mausom",
    //       "excelNo": "test1"
    //     }
    //   ])
    // });
  }

  getCustomerOrdersPurchasesWithinDateRange(reqObj: any) {
    reqObj.fromDate = reqObj.fromDate ? reqObj.fromDate.toString().split("-").reverse().join("-") : null;
    reqObj.toDate = reqObj.toDate ? reqObj.toDate.toString().split("-").reverse().join("-") : null;
    return this.http.post(this.API_ENDPOINT + 'inventory/' + (reqObj.type === "sale" ? 'getCustomerPurchasesWithinDateRange' : 'getCustomerOrdersWithinDateRange'), reqObj);

    // return new Promise((resolve) => {
    //   resolve([
    //     {
    //       "sheetName": "2",
    //       "serialNo": "1",
    //       "grossWeight": "5.1",
    //       "netWeight": "6.1",
    //       "beadWeight": "4.1",
    //       "a": "1",
    //       "b": "2",
    //       "c": "3",
    //       "e": "5",
    //       "karigarName": "mausom",
    //       "excelNo": "test1"
    //     }
    //   ])
    // });
  }

  getInventoryItem(itemId: string) {
    return this.http.get(this.API_ENDPOINT + "inventory/getInventoryItem?itemId=" + itemId);
  }

  getOrderItem(itemId: string) {
    return this.http.get(this.API_ENDPOINT + "inventory/getOrderItem?itemId=" + itemId);
  }

  order(reqObj: any) {
    return this.http.post(this.API_ENDPOINT + '/inventory/order', reqObj);
  }

  sell(reqObj: any) {
    return this.http.post(this.API_ENDPOINT + '/inventory/sell', reqObj);
  }

  return(reqObj: any) {
    return this.http.post(this.API_ENDPOINT + '/inventory/return', reqObj);
  }

  getCustomerOrders(customerId: string) {
    return this.http.get(this.API_ENDPOINT + 'inventory/getCustomerOrders?customerId=' + customerId);
  }

  getCustomerPurchases(customerId: string) {
    return this.http.get(this.API_ENDPOINT + 'inventory/getCustomerPurchases?customerId=' + customerId);
  }
}
