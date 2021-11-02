import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from "../shared/shared.service";

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

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    localStorage.clear();
  }

  login(): void {
    localStorage.clear();
    if (this.loginForm.form.valid) {
      this.isLoading = true;
      this.sharedService
        .authenticateUser(
          this.loginObj.username,
          window.btoa(this.loginObj.password)
        )
        .subscribe(
          (data: any) => {
            if (data.success) {
              localStorage.setItem(
                'userDetails',
                JSON.stringify({
                  name: data.name,
                  id: data.id,
                  role: data.role,
                })
              );
              this.router.navigate(['home']);
            } else {
              alert('Invalid credentials.');
            }
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = true;

            console.log(error);
          }
        );
    } else {
      this.loginForm.form.controls.username.markAsTouched();
      this.loginForm.form.controls.password.markAsTouched();
    }
  }
}
