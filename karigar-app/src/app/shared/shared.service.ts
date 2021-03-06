import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  getUserRole() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}').role;
  }
}
