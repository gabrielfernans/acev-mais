import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, FeedbackEnum, IAuthResponse, TokenService } from '@app/shared';

const LOGIN_SUCCESS = 'Login realizado com sucesso';
const LOGIN_ERROR = 'Não foi possível realizar o login. Verifique suas credenciais.';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  validateForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private notification: NzNotificationService,
    private router: Router,
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  submitForm(): void {
    const { email, password } = this.validateForm.value;

    this.isLoading = true;

    this.authService
      .login(email, password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: IAuthResponse) => {
          this.notification.success(FeedbackEnum.SUCCESS, LOGIN_SUCCESS);
          this.tokenService.setToken(response.token);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, LOGIN_ERROR);
        },
      });
  }
}
