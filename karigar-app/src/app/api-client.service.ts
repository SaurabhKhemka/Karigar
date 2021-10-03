import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private REST_API_SERVER = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  fetchStatesandDistricts(pincode: string) {
    return this.httpClient.get(
      'https://api.postalpincode.in/pincode/' + pincode
    );
  }
}
