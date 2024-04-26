import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AgrupeMeetingFormContainerComponent,
  AgrupeMeetingsContainerComponent,
} from './containers';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AgrupeMeetingsContainerComponent,
      },
      {
        path: 'add',
        component: AgrupeMeetingFormContainerComponent,
      },
      {
        path: ':id/manage',
        component: AgrupeMeetingFormContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgrupeMeetingsRoutingModule {}
