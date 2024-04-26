import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AGRUPES_BREADCRUMB,
  AgrupeService,
  ConfigService,
  FeedbackEnum,
  IAgrupe,
  IAgrupeRequestParams,
  PermissionService,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  TokenService,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

const AGRUPE_UPDATED_SUCCESSFULLY_MESSAGE = 'O agrupe foi atualizado com sucesso.';
const AGRUPE_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O agrupe foi atualizado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const AGRUPE_CREATED_SUCCESSFULLY_MESSAGE = 'O agrupe foi cadastrado com sucesso.';
const AGRUPE_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O agrupe foi cadastrado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERVER_ERROR = 'Não foi possível recuperar informações deste agrupe.';

@Component({
  selector: 'app-agrupe-form-container',
  templateUrl: './agrupe-form-container.component.html',
  styleUrls: ['./agrupe-form-container.component.scss'],
})
export class AgrupeFormContainerComponent implements OnInit {
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  isManagement: boolean = false;
  isManageable!: boolean;

  agrupe!: IAgrupe;

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private agrupeService: AgrupeService,
    private configService: ConfigService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isManagement = true;
        this.getAgrupe(id);
        return;
      }
      this.setConfigs();
    });
  }

  getAgrupe(id: string): void {
    this.isLoading = true;

    this.agrupeService
      .getAgrupeById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (agrupe: IAgrupe) => {
          this.agrupe = agrupe;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/agrupes']);
        },
      });
  }

  submit(data: { params: IAgrupeRequestParams; photo?: File }): void {
    if (this.isManagement) {
      this.updateAgrupe(data);
      return;
    }
    this.addAgrupe(data);
  }

  addAgrupe(data: { params: IAgrupeRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.agrupeService.addAgrupe(params).subscribe({
      next: (agrupe: IAgrupe) => {
        if (photo) {
          this.addPhoto(agrupe.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, AGRUPE_CREATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/agrupes', agrupe.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  updateAgrupe(data: { params: IAgrupeRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.agrupeService.updateAgrupe(this.agrupe.id!, params).subscribe({
      next: (agrupe: IAgrupe) => {
        if (photo) {
          this.addPhoto(agrupe.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, AGRUPE_UPDATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/agrupes', agrupe.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addPhoto(agrupeId: string, photo: File): void {
    const formData = new FormData();
    formData.append('photo', photo);

    this.agrupeService
      .addAgrupePhoto(agrupeId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/agrupes', agrupeId]);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? AGRUPE_UPDATED_SUCCESSFULLY_MESSAGE
              : AGRUPE_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? AGRUPE_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE
              : AGRUPE_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE,
          );
        },
      });
  }

  archiveAgrupe(id: string, archive: boolean): void {
    this.isLoading = true;
    this.agrupeService[archive ? 'archiveAgrupe' : 'restoreAgrupe'](id)
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
            `Agrupe ${archive ? 'arquivado' : 'desarquivado'} com sucesso.`,
          );
          this.router.navigate(['/agrupes', id]);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openArchiveConfirm(archive: boolean): void {
    this.modal.confirm({
      nzTitle: `Tem certeza que deseja ${archive ? 'arquivar' : 'desarquivar'} este agrupe?`,
      nzContent: `<b>O ${this.agrupe.name} será ${archive ? 'arquivado' : 'desarquivado'}.</b>`,
      nzOkText: `${archive ? 'Arquivar' : 'Desarquivar'}`,
      nzOkType: 'primary',
      nzOkDanger: archive,
      nzOnOk: () => this.archiveAgrupe(this.agrupe.id!, archive),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const title = this.isManagement ? 'Gerenciar agrupe' : 'Cadastrar agrupe';

    const breadcrumb = this.isManagement
      ? [
          { route: `/agrupes/${this.agrupe.id}`, title: `${this.agrupe.name}` },
          { route: `/agrupes/${this.agrupe.id}/manage`, title: 'Gerenciar' },
        ]
      : [{ route: '/agrupes/add', title: 'Cadastrar' }];

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([AGRUPES_BREADCRUMB, ...breadcrumb]);
  }
}
