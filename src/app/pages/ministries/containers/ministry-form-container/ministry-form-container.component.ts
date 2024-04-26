import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MINISTRIES_BREADCRUMB,
  MinistryService,
  ConfigService,
  FeedbackEnum,
  IMinistry,
  IMinistryRequestParams,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  TokenService,
  PermissionService,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

const MINISTRY_UPDATED_SUCCESSFULLY_MESSAGE = 'O ministério foi atualizado com sucesso.';
const MINISTRY_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O ministério foi atualizado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const MINISTRY_CREATED_SUCCESSFULLY_MESSAGE = 'O ministério foi cadastrado com sucesso.';
const MINISTRY_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O ministério foi cadastrado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERVER_ERROR = 'Não foi possível recuperar informações deste ministério.';

@Component({
  selector: 'app-ministry-form-container',
  templateUrl: './ministry-form-container.component.html',
  styleUrls: ['./ministry-form-container.component.scss'],
})
export class MinistryFormContainerComponent implements OnInit {
  isManageable!: boolean;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  isManagement: boolean = false;

  ministry!: IMinistry;

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private ministryService: MinistryService,
    private configService: ConfigService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isManagement = true;
        this.getMinistry(id);
        return;
      }
      this.setConfigs();
    });
  }

  getMinistry(id: string): void {
    this.isLoading = true;
    this.ministryService
      .getMinistryById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (ministry: IMinistry) => {
          this.ministry = ministry;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/ministries']);
        },
      });
  }

  submit(data: { params: IMinistryRequestParams; photo?: File }): void {
    if (this.isManagement) {
      this.updateMinistry(data);
      return;
    }
    this.addMinistry(data);
  }

  addMinistry(data: { params: IMinistryRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.ministryService.addMinistry(params).subscribe({
      next: (ministry: IMinistry) => {
        if (photo) {
          this.addPhoto(ministry.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, MINISTRY_CREATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/ministries', ministry.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  updateMinistry(data: { params: IMinistryRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.ministryService.updateMinistry(this.ministry.id!, params).subscribe({
      next: (ministry: IMinistry) => {
        if (photo) {
          this.addPhoto(ministry.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, MINISTRY_UPDATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/ministries', ministry.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addPhoto(ministryId: string, photo: File): void {
    const formData = new FormData();
    formData.append('photo', photo);

    this.ministryService
      .addMinistryPhoto(ministryId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/ministries', ministryId]);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? MINISTRY_UPDATED_SUCCESSFULLY_MESSAGE
              : MINISTRY_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? MINISTRY_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE
              : MINISTRY_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE,
          );
        },
      });
  }

  archiveMinistry(id: string, archive: boolean): void {
    this.isLoading = true;
    this.ministryService[archive ? 'archiveMinistry' : 'restoreMinistry'](id)
      .pipe(
        finalize(() => {
          this.modal.closeAll();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            `Ministério ${archive ? 'arquivado' : 'desarquivado'} com sucesso.`,
          );
          this.router.navigate(['/ministries', id]);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openArchiveConfirm(archive: boolean): void {
    this.modal.confirm({
      nzTitle: `Tem certeza que deseja ${archive ? 'arquivar' : 'desarquivar'} este ministério?`,
      nzContent: `<b>O ministério ${this.ministry.name} será ${archive ? 'arquivado' : 'desarquivado'}.</b>`,
      nzOkText: `${archive ? 'Arquivar' : 'Desarquivar'}`,
      nzOkType: 'primary',
      nzOkDanger: archive,
      nzOnOk: () => this.archiveMinistry(this.ministry.id!, archive),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const title = this.isManagement ? 'Gerenciar ministério' : 'Cadastrar ministério';

    const breadcrumb = this.isManagement
      ? [
          { route: `/ministries/${this.ministry.id}`, title: `${this.ministry.name}` },
          { route: `/ministries/${this.ministry.id}/manage`, title: 'Gerenciar' },
        ]
      : [{ route: '/ministries/add', title: 'Cadastrar' }];

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([MINISTRIES_BREADCRUMB, ...breadcrumb]);
  }
}
