import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SeriesService,
  ConfigService,
  FeedbackEnum,
  ISeries,
  ISeriesRequestParams,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  SERIES_BREADCRUMB,
  TokenService,
  PermissionService,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

const SERIES_UPDATED_SUCCESSFULLY_MESSAGE = 'A série foi atualizada com sucesso.';
const SERIES_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'A série foi atualizada com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERIES_CREATED_SUCCESSFULLY_MESSAGE = 'A série foi cadastrada com sucesso.';
const SERIES_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'A série foi cadastrada com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERVER_ERROR = 'Não foi possível recuperar informações desta série.';

@Component({
  selector: 'app-series-form-container',
  templateUrl: './series-form-container.component.html',
  styleUrls: ['./series-form-container.component.scss'],
})
export class SeriesFormContainerComponent implements OnInit {
  isManageable!: boolean;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  isManagement: boolean = false;

  series!: ISeries;

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private seriesService: SeriesService,
    private configService: ConfigService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('idSerie');

      if (id) {
        this.isManagement = true;
        this.getSeries(id);
        return;
      }
      this.setConfigs();
    });
  }

  getSeries(id: string): void {
    this.isLoading = true;
    this.seriesService
      .getSeriesById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (series: ISeries) => {
          this.series = series;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/series']);
        },
      });
  }

  submit(data: { params: ISeriesRequestParams; photo?: File }): void {
    if (this.isManagement) {
      this.updateSeries(data);
      return;
    }
    this.addSeries(data);
  }

  addSeries(data: { params: ISeriesRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.seriesService.addSeries(params).subscribe({
      next: (series: ISeries) => {
        if (photo) {
          this.addPhoto(series.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, SERIES_CREATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/series', series.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  updateSeries(data: { params: ISeriesRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.seriesService.updateSeries(this.series.id!, params).subscribe({
      next: (series: ISeries) => {
        if (photo) {
          this.addPhoto(series.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, SERIES_UPDATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/series', series.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addPhoto(seriesId: string, photo: File): void {
    const formData = new FormData();
    formData.append('photo', photo);

    this.seriesService
      .addSeriesPhoto(seriesId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/series', seriesId]);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? SERIES_UPDATED_SUCCESSFULLY_MESSAGE
              : SERIES_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? SERIES_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE
              : SERIES_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE,
          );
        },
      });
  }

  deleteSeries(id: string): void {
    this.isLoading = true;
    this.seriesService
      .deleteSeries(id)
      .pipe(
        finalize(() => {
          this.modal.closeAll();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(FeedbackEnum.SUCCESS, 'Série excluida com sucesso.');
          this.router.navigate(['/series']);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Tem certeza que deseja excluir esta série?',
      nzContent: `<b">A série "${this.series.title}" será excluido. Esta alteração é irreversível.</b>`,
      nzOkText: 'Excluir',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteSeries(this.series.id!),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const title = this.isManagement ? 'Gerenciar série' : 'Cadastrar série';

    const breadcrumb = this.isManagement
      ? [
          { route: `/series/${this.series.id}`, title: `${this.series.title}` },
          { route: `/series/${this.series.id}/manage`, title: 'Gerenciar' },
        ]
      : [{ route: '/series/add', title: 'Cadastrar' }];

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([SERIES_BREADCRUMB, ...breadcrumb]);
  }
}
