import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MaterialDialog } from '../modal/mat-dialog.component';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userDetails: any = {};
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.sharedService.getUserDetails();
  }

  navigate(type: string) {
    if (this.userDetails.id) {
      this.router.navigate([type]);
    }
  }

  openModal(type: string) {
    const dialogRef = this.dialog.open(MaterialDialog, {
      width: '250px',
      data: {
        title: type,
        content: 'About Karigar App',
        yesButton: 'OK',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  logout() {
    this.router.navigate(['login']);
  }
}
