import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfigService,
  FeedbackEnum,
  ILesson,
  ISeries,
  LessonService,
  PermissionService,
  SERIES_BREADCRUMB,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  SeriesService,
  TokenService,
  getFormattedPageTitle,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';

const SERVER_ERROR = 'Não foi possível recuperar informações desta série.';

@Component({
  selector: 'app-serie-container',
  templateUrl: './serie-container.component.html',
})
export class SerieContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  serie!: ISeries;
  serieId!: string;

  constructor(
    private seriesService: SeriesService,
    private lessonService: LessonService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.serieId = params['idSerie'];
      this.getSeries();
    });
  }

  getSeries(): void {
    this.isLoading = true;

    this.seriesService
      .getSeriesById(this.serieId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (serie: ISeries) => {
          this.serie = serie;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/series']);
        },
      });
  }

  deleteLesson(id: string): void {
    this.isLoading = true;
    this.lessonService
      .deleteLesson(id)
      .pipe(
        finalize(() => {
          this.modal.closeAll();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(FeedbackEnum.SUCCESS, 'Estudo excluido com sucesso.');
          this.getSeries();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openDeleteLessonConfirm(lesson: ILesson): void {
    this.modal.confirm({
      nzTitle: 'Tem certeza que deseja excluir este estudo?',
      nzContent: `<b">O "${lesson.title}" será excluido. Esta alteração é irreversível.</b>`,
      nzOkText: 'Excluir',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteLesson(lesson.id),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const { id, title } = this.serie;

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.titleService.setTitle(getFormattedPageTitle(title));
    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([SERIES_BREADCRUMB, { title, route: id! }]);
  }
}
