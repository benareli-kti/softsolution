import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User2Service } from 'src/app/services/user2.service';
import { User } from 'src/app/models/user.model';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  LogOrReg = true;

  isLoggedIn = false;
  isLoginFailed = false;

  isSuccessful = false;
  isSignUpFailed = false;

  errorMessage = '';
  roles: string[] = [];
  constructor(private authService: AuthService,
    private user2Service: User2Service,
    private tokenStorage: TokenStorageService) { }
  ngOnInit(): void {
    this.user2Service.getAll()
      .subscribe(user2 => {
        if (!user2){
          this.LogOrReg = false;
        }
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    } 
  }
  onSubmit(): void {
    if (this.LogOrReg){
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }else{

    const { username, password } = this.form;
    this.authService.register(username, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  }
  reloadPage(): void {
    window.location.reload();
  }
}
