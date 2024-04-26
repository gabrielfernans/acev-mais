import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MinistriesContainerComponent,
  MinistryContainerComponent,
  MinistryFormContainerComponent,
} from './containers';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MinistriesContainerComponent,
      },
      {
        path: 'add',
        component: MinistryFormContainerComponent,
      },
      {
        path: ':id',
        component: MinistryContainerComponent,
      },
      {
        path: ':id/manage',
        component: MinistryFormContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MinistriesRoutingModule {}
