import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userDetails: any = {};
  constructor(private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.userDetails = this.sharedService.getUserDetails();
  }

  navigate(type: string) {
    this.router.navigate([type]);
  }
}
