import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MEMBERS_BREADCRUMB,
  MemberService,
  ConfigService,
  FeedbackEnum,
  IMember,
  IMemberRequestParams,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  PermissionService,
  TokenService,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

const MEMBER_UPDATED_SUCCESSFULLY_MESSAGE = 'O membro foi atualizado com sucesso.';
const MEMBER_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O membro foi atualizado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const MEMBER_CREATED_SUCCESSFULLY_MESSAGE = 'O membro foi cadastrado com sucesso.';
const MEMBER_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O membro foi cadastrado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERVER_ERROR = 'Não foi possível recuperar informações deste membro.';
const SERVER_ERROR_DUPLICATED = 'Já existe um usuário cadastrado com este e-mail';

@Component({
  selector: 'app-member-form-container',
  templateUrl: './member-form-container.component.html',
  styleUrls: ['./member-form-container.component.scss'],
})
export class MemberFormContainerComponent implements OnInit {
  isManageable!: boolean;
  isSubmitting: boolean = false;
  isLoading: boolean = false;
  isManagement: boolean = false;

  member!: IMember;

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private configService: ConfigService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isManagement = true;
        this.getMember(id);
        return;
      }
      this.setConfigs();
    });
  }

  getMember(id: string): void {
    this.isLoading = true;

    this.memberService
      .getMemberById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (member: IMember) => {
          this.member = member;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/members']);
        },
      });
  }

  submit(data: { params: IMemberRequestParams; photo?: File }): void {
    if (this.isManagement) {
      this.updateMember(data);
      return;
    }
    this.addMember(data);
  }

  addMember(data: { params: IMemberRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.memberService.addMember(params).subscribe({
      next: (member: IMember) => {
        if (photo) {
          this.addPhoto(member.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, MEMBER_CREATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/members', member.id!]);
      },
      error: (e: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.notification.error(
          FeedbackEnum.ERROR,
          e.status === 409 ? SERVER_ERROR_DUPLICATED : SERVER_ERROR_FEEDBACK_DESCRIPTION,
        );
      },
    });
  }

  updateMember(data: { params: IMemberRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.memberService.updateMember(this.member.id!, params).subscribe({
      next: (member: IMember) => {
        if (photo) {
          this.addPhoto(member.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(FeedbackEnum.SUCCESS, MEMBER_UPDATED_SUCCESSFULLY_MESSAGE);
        this.router.navigate(['/members', member.id!]);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addPhoto(memberId: string, photo: File): void {
    const formData = new FormData();
    formData.append('photo', photo);

    this.memberService
      .addMemberPhoto(memberId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/members', memberId]);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? MEMBER_UPDATED_SUCCESSFULLY_MESSAGE
              : MEMBER_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? MEMBER_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE
              : MEMBER_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE,
          );
        },
      });
  }

  archiveMember(id: string, archive: boolean): void {
    this.isLoading = true;
    this.memberService[archive ? 'archiveMember' : 'restoreMember'](id)
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
            `Membro ${archive ? 'arquivado' : 'desarquivado'} com sucesso.`,
          );
          this.router.navigate(['/members', id]);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openArchiveConfirm(archive: boolean): void {
    this.modal.confirm({
      nzTitle: `Tem certeza que deseja ${archive ? 'arquivar' : 'desarquivar'} este membro?`,
      nzContent: `<b>O membro ${this.member.name} será ${archive ? 'arquivado' : 'desarquivado'}.</b>`,
      nzOkText: `${archive ? 'Arquivar' : 'Desarquivar'}`,
      nzOkType: 'primary',
      nzOkDanger: archive,
      nzOnOk: () => this.archiveMember(this.member.id!, archive),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    const title = this.isManagement ? 'Gerenciar membro' : 'Cadastrar membro';

    const breadcrumb = this.isManagement
      ? [
          { route: `/members/${this.member.id}`, title: `${this.member.name}` },
          { route: `/members/${this.member.id}/manage`, title: 'Gerenciar' },
        ]
      : [{ route: '/members/add', title: 'Cadastrar' }];

    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([MEMBERS_BREADCRUMB, ...breadcrumb]);
  }
}
