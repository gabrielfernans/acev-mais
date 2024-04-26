import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { getFormattedPageTitle } from '@app/shared';

import { AuthGuard, AuthLayoutComponent, MainLayoutComponent } from './core';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  {
    path: 'login',
    title: getFormattedPageTitle('Login'),
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    data: {
      permission: ['PUBLIC'],
    },
  },
  {
    path: 'dashboard',
    title: getFormattedPageTitle('Dashboard'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
  {
    path: 'members',
    title: getFormattedPageTitle('Membros'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/members/members.module').then((m) => m.MembersModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
  {
    path: 'agrupes',
    title: getFormattedPageTitle('Agrupes'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/agrupes/agrupes.module').then((m) => m.AgrupesModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
  {
    path: 'agrupe-meetings',
    title: getFormattedPageTitle('Relatórios de agrupe'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/agrupe-meetings/agrupe-meetings.module').then((m) => m.AgrupeMeetingsModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
  {
    path: 'ministries',
    title: getFormattedPageTitle('Ministérios'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/ministries/ministries.module').then((m) => m.MinistriesModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
  {
    path: 'series',
    title: getFormattedPageTitle('Séries'),
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/studies/studies.module').then((m) => m.StudiesModule),
    data: {
      permission: ['PRIVATE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
