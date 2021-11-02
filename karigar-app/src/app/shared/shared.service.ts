import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  authenticateUser(userName: string, password: string) {
    return this.httpClient.get('assets/json/login.json');
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }
}
