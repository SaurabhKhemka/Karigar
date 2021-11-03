import { Component } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { SharedService } from "./shared/shared.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'karigar-app';

  constructor(private sharedService: SharedService, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    // if (!this.sharedService.getUserDetails().id) {
    //   this.router.navigate(['login']);
    //   this.snackBar.open("Please login again.", '', {
    //     duration: 2000,
    //   });
    // }
  }
}
