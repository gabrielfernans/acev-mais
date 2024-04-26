import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgrupeContainerComponent } from './containers/agrupe-container/agrupe-container.component';
import { AgrupesContainerComponent } from './containers/agrupes-container/agrupes-container.component';
import { AgrupeFormContainerComponent } from './containers/agrupe-form-container/agrupe-form-container.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AgrupesContainerComponent,
      },
      {
        path: 'add',
        component: AgrupeFormContainerComponent,
      },
      {
        path: ':id',
        component: AgrupeContainerComponent,
      },
      {
        path: ':id/manage',
        component: AgrupeFormContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgrupesRoutingModule {}
