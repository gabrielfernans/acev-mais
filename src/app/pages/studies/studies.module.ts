import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
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

import { NgxFileDropModule } from 'ngx-file-drop';
import { StudiesRoutingModule } from './studies-routing.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { LessonFormContainerComponent, LessonFormPageComponent } from './lessons';
import {
  SeriesContainerComponent,
  SeriesPageComponent,
  SeriesFormContainerComponent,
  SeriesFormPageComponent,
  SerieContainerComponent,
  SeriePageComponent,
} from './series';

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
    LessonFormContainerComponent,
    LessonFormPageComponent,
    SeriesContainerComponent,
    SeriesPageComponent,
    SeriesFormContainerComponent,
    SeriesFormPageComponent,
    SerieContainerComponent,
    SeriePageComponent,
  ],
  exports: [],
  providers: [DecimalPipe, provideNgxMask()],
  imports: [
    CommonModule,
    StudiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    ...components,
    ...directives,
  ],
})
export class StudiesModule {}
