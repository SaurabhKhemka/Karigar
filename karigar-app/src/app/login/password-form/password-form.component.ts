import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from 'underscore';
import { MaterialDialog } from '../../modal/mat-dialog.component';
import { CustomerService } from "../../service/customer-service";

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {
  @ViewChild('passwordForm', { static: false })
  passwordForm!: NgForm;
  isLoading: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<MaterialDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void { }

  savePassword() {
    if (this.passwordForm.form.valid) {
      if (this.newPassword !== this.confirmPassword) {
        this.snackBar.open("Password does not match", '', {
          duration: 2000,
        });
      } else {
        this.isLoading = true;
        this.data.user.password = window.btoa(this.newPassword);
        this.customerService.saveCustomer(this.data.user).subscribe((response: any) => {
          if (response) {
            this.snackBar.open("Password saved successfully", '', {
              duration: 2000,
            });
            this.dialogRef.close();
          }
          this.isLoading = false;
        },
          (error) => {
            this.isLoading = false;
            this.snackBar.open("Server Error", '', {
              duration: 2000,
            });
          }
        );
      }
    } else {
      _.each(Object.keys(this.passwordForm.form.controls), (control: any) => {
        this.passwordForm.form.controls[control].markAsTouched();
      });
    }
  }
}
