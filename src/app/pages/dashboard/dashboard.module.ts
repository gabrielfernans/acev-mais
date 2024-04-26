import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { StatsCardComponent, TagComponent } from '@app/shared';

const components = [
  NzButtonModule,
  NzCardModule,
  NzIconModule,
  NzSkeletonModule,
  StatsCardComponent,
  TagComponent,
];

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, ...components],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {}
