import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberContainerComponent } from './containers/member-container/member-container.component';
import { MembersContainerComponent } from './containers/members-container/members-container.component';
import { MemberFormContainerComponent } from './containers/member-form-container/member-form-container.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MembersContainerComponent,
      },
      {
        path: 'add',
        component: MemberFormContainerComponent,
      },
      {
        path: ':id',
        component: MemberContainerComponent,
      },
      {
        path: ':id/manage',
        component: MemberFormContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
