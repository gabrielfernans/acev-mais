import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NgxFileDropModule } from 'ngx-file-drop';

import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FeedbackComponent,
  LoaderComponent,
  LocationComponent,
  PhonePipe,
  StatsCardComponent,
  TagComponent,
} from '@app/shared';

import { MemberContainerComponent } from './containers/member-container/member-container.component';
import { MembersContainerComponent } from './containers/members-container/members-container.component';
import { MemberFormContainerComponent } from './containers/member-form-container/member-form-container.component';
import { MembersRoutingModule } from './members-routing.module';
import { MemberFormPageComponent } from './pages/member-form-page/member-form-page.component';
import { MemberPageComponent } from './pages/member-page/member-page.component';
import { MembersPageComponent } from './pages/members-page/members-page.component';

const components = [
  NzButtonModule,
  NzTableModule,
  NzDividerModule,
  NzInputModule,
  NzIconModule,
  NzRadioModule,
  NzTagModule,
  NzMenuModule,
  NzFormModule,
  NzSelectModule,
  NzDatePickerModule,
  NzCardModule,
  NzModalModule,
  NzStepsModule,
  NzUploadModule,
  NzAvatarModule,
  NzDropDownModule,
  NzEmptyModule,
  LoaderComponent,
  FeedbackComponent,
  TagComponent,
  StatsCardComponent,
  LocationComponent,
  TagComponent,
  NzSwitchModule,
  NzPageHeaderModule,
];

const directives = [NgxMaskDirective];

const pipes = [PhonePipe];

@NgModule({
  declarations: [
    MemberPageComponent,
    MembersPageComponent,
    MemberFormPageComponent,
    MemberContainerComponent,
    MembersContainerComponent,
    MemberFormContainerComponent,
  ],
  exports: [],
  providers: [DecimalPipe, provideNgxMask()],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ...components,
    ...pipes,
    ...directives,
  ],
})
export class MembersModule {}
