import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { IconsProviderModule } from '../icons-provider.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const components = [
  NzButtonModule,
  NzLayoutModule,
  NzMenuModule,
  NzBreadCrumbModule,
  NzTableModule,
  NzIconModule,
];

@NgModule({
  declarations: [MainLayoutComponent, AuthLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    ...components,
  ],
})
export class CoreModule {}
