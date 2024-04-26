import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  SeriesContainerComponent,
  SeriesFormContainerComponent,
  SerieContainerComponent,
} from './series';
import { LessonFormContainerComponent } from './lessons';

const routes: Routes = [
  {
    path: '',
    component: SeriesContainerComponent,
  },
  {
    path: 'add',
    component: SeriesFormContainerComponent,
  },
  {
    path: ':idSerie',
    component: SerieContainerComponent,
  },
  {
    path: ':idSerie/manage',
    component: SeriesFormContainerComponent,
  },
  {
    path: ':idSerie/lessons',
    children: [
      {
        path: 'add',
        component: LessonFormContainerComponent,
      },
      {
        path: ':idLesson/manage',
        component: LessonFormContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudiesRoutingModule {}
