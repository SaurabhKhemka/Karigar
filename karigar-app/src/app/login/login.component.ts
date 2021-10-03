import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Constants } from '../constants/credentials';

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

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    sessionStorage.clear();
  }

  login(): void {
    if (this.loginForm.form.valid) {
      const foundUser: any = Constants.CREDENTIALS.find((cred) => {
        return cred.user === this.loginObj.username;
      });

      if (foundUser.password === this.loginObj.password) {
        sessionStorage.setItem('isUserType', foundUser.role);
        this.router.navigate(['home']);
      } else {
        sessionStorage.clear();
        alert('Invalid credentials');
      }
    } else {
      this.loginForm.form.controls.username.markAsTouched();
      this.loginForm.form.controls.password.markAsTouched();
    }
  }
}
