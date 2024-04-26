import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LessonService,
  ConfigService,
  FeedbackEnum,
  ILesson,
  ILessonRequestParams,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  SERIES_BREADCRUMB,
  SeriesService,
  ISeries,
  TokenService,
  PermissionService,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

const LESSON_UPDATED_SUCCESSFULLY_MESSAGE = 'O estudo foi atualizado com sucesso.';
const LESSON_CREATED_SUCCESSFULLY_MESSAGE = 'O estudo foi cadastrado com sucesso.';

const LESSON_UPDATED_SUCCESSFULLY_WITHOUT_FILE_MESSAGE =
  'O estudo foi atualizado com sucesso. Porém não foi possível anexar o PDF, tente inseri-lo novamente, se o erro persistir, comunique a equipe de tecnologia.';
const LESSON_CREATED_SUCCESSFULLY_WITHOUT_FILE_MESSAGE =
  'O estudo foi cadastrado com sucesso. Porém não foi possível anexar o PDF, tente inseri-lo novamente, se o erro persistir, comunique a equipe de tecnologia.';

const SERVER_ERROR =
  'Não foi possível recuperar informações deste estudo, se o erro persistir, comunique a equipe de tecnologia.';

@Component({
  selector: 'app-lesson-form-container',
  templateUrl: './lesson-form-container.component.html',
  styleUrls: ['./lesson-form-container.component.scss'],
})
export class LessonFormContainerComponent implements OnInit {
  isManageable!: boolean;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  isManagement: boolean = false;

  lesson!: ILesson;
  idSerie!: string;
  nameSeries: string = '...';

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private lessonService: LessonService,
    private configService: ConfigService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idLesson = params.get('idLesson');
      const idSerie = params.get('idSerie');

      this.getSeries(idSerie!);

      if (idLesson) {
        this.isManagement = true;
        this.getLesson(idLesson);
        return;
      }
      this.setConfigs();
    });
  }

  getLesson(id: string): void {
    this.isLoading = true;
    this.lessonService
      .getLessonById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (lesson: ILesson) => {
          this.lesson = lesson;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/series', this.idSerie]);
        },
      });
  }

  getSeries(id: string): void {
    this.idSerie = id;

    this.seriesService.getSeriesById(id).subscribe({
      next: (series: ISeries) => {
        this.nameSeries = series.title;
        this.setConfigs();
      },
    });
  }

  submit(data: { params: ILessonRequestParams; file: File }): void {
    if (this.isManagement) {
      this.updateLesson(data);
      return;
    }
    this.addLesson(data);
  }

  addLesson(data: { params: ILessonRequestParams; file: File }): void {
    const { params, file } = data;

    this.isSubmitting = true;
    this.lessonService.addLesson(params).subscribe({
      next: (lesson: ILesson) => {
        this.addFile(lesson.id!, file);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  updateLesson(data: { params: ILessonRequestParams; file: File }): void {
    const { params, file } = data;

    this.isSubmitting = true;
    this.lessonService.updateLesson(this.lesson.id!, params).subscribe({
      next: (lesson: ILesson) => {
        this.addFile(lesson.id!, file);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addFile(lessonId: string, file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.lessonService
      .addLessonFile(lessonId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/series', this.idSerie]);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? LESSON_UPDATED_SUCCESSFULLY_MESSAGE
              : LESSON_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? LESSON_UPDATED_SUCCESSFULLY_WITHOUT_FILE_MESSAGE
              : LESSON_CREATED_SUCCESSFULLY_WITHOUT_FILE_MESSAGE,
          );
        },
      });
  }

  deleteLesson(): void {
    const { id } = this.lesson;

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
          this.router.navigate(['/series', this.idSerie]);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Tem certeza que deseja excluir este estudo?',
      nzContent: `<b">O "${this.lesson.title}" será excluido. Esta alteração é irreversível.</b>`,
      nzOkText: 'Excluir',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteLesson(),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const title = this.isManagement ? 'Gerenciar estudo' : 'Cadastrar estudo';

    const serieBreadcrumb = [
      SERIES_BREADCRUMB,
      {
        route: `/series/${this.idSerie}`,
        title: `${this.lesson ? this.lesson.seriesName : this.nameSeries}`,
      },
    ];

    const breadcrumb = this.isManagement
      ? [
          { route: `/lesson/${this.lesson.id}`, title: `${this.lesson.title}` },
          { route: `/lesson/${this.lesson.id}/manage`, title: 'Gerenciar estudo' },
        ]
      : [{ route: '/lesson/add', title: 'Cadastrar estudo' }];

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([...serieBreadcrumb, ...breadcrumb]);
  }
}
