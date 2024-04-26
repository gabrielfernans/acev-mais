import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzUploadModule } from 'ng-zorro-antd/upload';
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

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { MinistriesRoutingModule } from './ministries-routing.module';

import { NgxFileDropModule } from 'ngx-file-drop';
import { MinistriesContainerComponent } from './containers/ministries-container/ministries-container.component';
import { MinistriesPageComponent } from './pages/ministries-page/ministries-page.component';
import { MinistryContainerComponent } from './containers/ministry-container/ministry-container.component';
import { MinistryPageComponent } from './pages/ministry-page/ministry-page.component';
import { MinistryFormPageComponent } from './pages/ministry-form-page/ministry-form-page.component';
import { MinistryFormContainerComponent } from './containers';

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
];

const directives = [NgxMaskDirective];

@NgModule({
  declarations: [
    MinistriesContainerComponent,
    MinistriesPageComponent,
    MinistryContainerComponent,
    MinistryPageComponent,
    MinistryFormPageComponent,
    MinistryFormContainerComponent,
  ],
  exports: [],
  providers: [DecimalPipe, provideNgxMask()],
  imports: [
    CommonModule,
    MinistriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ...components,
    ...directives,
  ],
})
export class MinistriesModule {}
