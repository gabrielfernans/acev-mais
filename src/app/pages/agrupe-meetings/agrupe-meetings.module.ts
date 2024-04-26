import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzListModule } from 'ng-zorro-antd/list';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FeedbackComponent,
  LoaderComponent,
  LocationComponent,
  StatsCardComponent,
  TagComponent,
} from '@app/shared';

import { AgrupeMeetingsRoutingModule } from './agrupe-meetings-routing.module';

import { NgxFileDropModule } from 'ngx-file-drop';
import {
  AgrupeMeetingFormContainerComponent,
  AgrupeMeetingsContainerComponent,
} from './containers';
import { AgrupeMeetingFormPageComponent, AgrupeMeetingsPageComponent } from './pages';

const components = [
  NzButtonModule,
  NzTableModule,
  NzPaginationModule,
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
  NzSwitchModule,
  NzUploadModule,
  NzAvatarModule,
  NzListModule,
  NzDropDownModule,
  NzEmptyModule,
  LoaderComponent,
  FeedbackComponent,
  TagComponent,
  StatsCardComponent,
  LocationComponent,
];

const directives = [NgxMaskDirective];

@NgModule({
  declarations: [
    AgrupeMeetingsContainerComponent,
    AgrupeMeetingsPageComponent,
    AgrupeMeetingFormContainerComponent,
    AgrupeMeetingFormPageComponent,
  ],
  exports: [],
  providers: [DecimalPipe, provideNgxMask()],
  imports: [
    CommonModule,
    AgrupeMeetingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ...components,
    ...directives,
  ],
})
export class AgrupeMeetingsModule {}
