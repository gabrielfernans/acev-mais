import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

const components = [NzFormModule, NzInputModule, NzButtonModule, NzNotificationModule];

@NgModule({
  imports: [LoginRoutingModule, FormsModule, ReactiveFormsModule, ...components],
  declarations: [LoginComponent, LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
