import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { CustomerService } from "../service/customer-service";
import { PasswordFormComponent } from "./password-form/password-form.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginObj = {
    username: '',
    password: '',
  };

  showSpinner: boolean = false;

  @ViewChild('loginForm', { static: false })
  loginForm!: NgForm;
  isLoading: boolean = false;
  isUserPasswordAvailable: boolean = false
  selectedUser: any;

  constructor(private router: Router, private customerService: CustomerService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    localStorage.clear();
  }

  validateUserName(username: string) {
    if (username === 'admin') {
      this.isUserPasswordAvailable = true;
    } else {
      this.isLoading = true;
      this.isUserPasswordAvailable = false;
      this.customerService.authenticateUser(username).subscribe((response: any) => {
        this.selectedUser = response;
        if (response.customerId) {
          if (response.password) {
            this.isUserPasswordAvailable = true;
          } else {
            const dialogRef = this.dialog.open(PasswordFormComponent, {
              width: '500px',
              data: {
                title: "Set Password",
                user: response,
                noButton: 'Cancel',
                yesButton: 'SAVE',
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                this.isUserPasswordAvailable = true;
              }
            });
          }
        } else {
          this.snackBar.open("User not found", '', {
            duration: 2000,
          });
        }
        this.isLoading = false;
      },
        (error) => {
          this.isLoading = false;
          this.isUserPasswordAvailable = false;
          this.snackBar.open("Server Error", '', {
            duration: 2000,
          });
        }
      );
    }
  }

  login(): void {
    localStorage.clear();
    if (this.loginForm.form.valid) {
      if (this.loginObj.username === 'admin') {
        if (this.loginObj.password === '1234') {
          localStorage.setItem(
            'userDetails',
            JSON.stringify({
              name: 'admin',
              id: 'admin',
              role: 'admin',
            })
          );
          this.router.navigate(['home']);
        } else {
          this.snackBar.open("Invalid credentials.", '', {
            duration: 2000,
          });
        }
      } else {
        if (this.loginObj.password === window.atob(this.selectedUser.password)) {
          localStorage.setItem(
            'userDetails',
            JSON.stringify({
              name: this.selectedUser.customerName,
              id: this.selectedUser.customerId,
              role: 'CUSTOMER',
            })
          );
          this.router.navigate(['home']);
        } else {
          this.snackBar.open("Invalid credentials.", '', {
            duration: 2000,
          });
        }
      }
    } else {
      this.loginForm.form.controls.username.markAsTouched();
      this.loginForm.form.controls.password.markAsTouched();
    }
  }
}
