import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, debounceTime, finalize, switchMap } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfigService,
  FeedbackEnum,
  IMember,
  IMinistry,
  MINISTRIES_BREADCRUMB,
  MemberRoleEnum,
  MemberService,
  MinistryService,
  PermissionService,
  TokenService,
  getFormattedPageTitle,
  getInitials,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';

const SERVER_HANDLE_SUCCESS = 'Alteração realizada com sucesso.';
const SERVER_ERROR = 'Não foi possível recuperar informações deste ministério.';

@Component({
  selector: 'app-ministry-container',
  templateUrl: './ministry-container.component.html',
})
export class MinistryContainerComponent implements OnInit {
  isManageable!: boolean;
  isModalOpen: boolean = false;
  isLoading!: boolean;
  isLoadingMember!: boolean;
  ministry!: IMinistry;
  ministryId!: string;
  searchMembers$ = new Subject<string>();
  foundMembers: IMember[] = [];

  constructor(
    private ministryService: MinistryService,
    private memberService: MemberService,
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
      this.ministryId = params['id'];
      this.getMinistry();
      this.searchMembers();
    });
  }

  searchMembers(): void {
    this.searchMembers$
      .pipe(debounceTime(500))
      .pipe(switchMap((query: string) => this.memberService.searchMembers(query)))
      .subscribe((members: IMember[]) => {
        this.foundMembers = members;
        this.isLoadingMember = false;
      });
  }

  onMemberSearch(query: string): void {
    this.isLoadingMember = true;
    this.searchMembers$.next(query);
  }

  getMinistry(): void {
    this.isLoading = true;

    this.ministryService
      .getMinistryById(this.ministryId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (ministry: IMinistry) => {
          this.setMinistry(ministry);
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/ministries']);
        },
      });
  }

  addMemberRole(memberId: string, role: MemberRoleEnum = MemberRoleEnum.MEMBER): void {
    this.isLoadingMember = true;

    this.ministryService
      .addMinistryPerson(this.ministry.id!, memberId, role)
      .pipe(
        finalize(() => {
          this.isLoadingMember = false;
          this.modal.closeAll();
        }),
      )
      .subscribe({
        next: () => {
          this.getMinistry();
          this.modal.closeAll();
          this.isModalOpen = false;
          this.notification.success(FeedbackEnum.SUCCESS, SERVER_HANDLE_SUCCESS);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
        },
      });
  }

  removeMemberRole(memberId: string, role: MemberRoleEnum): void {
    this.isLoadingMember = true;

    this.ministryService
      .removeMinistryPerson(this.ministry.id!, memberId, role)
      .pipe(
        finalize(() => {
          this.isLoadingMember = false;
          this.modal.closeAll();
        }),
      )
      .subscribe({
        next: () => {
          this.getMinistry();
          this.notification.success(FeedbackEnum.SUCCESS, SERVER_HANDLE_SUCCESS);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
        },
      });
  }

  handleMemberRole(data: {
    action: 'add' | 'remove';
    memberId: string;
    role: MemberRoleEnum;
    danger?: boolean;
  }): void {
    const { action, memberId, role, danger } = data;

    this.modal.confirm({
      nzTitle: `Tem certeza que deseja prosseguir? `,
      nzContent: `<b">Este membro será 
        ${action === 'add' ? 'adicionado ao' : 'removido do'} 
        ${role === MemberRoleEnum.MEMBER ? 'ministério' : role === MemberRoleEnum.APPRENTICE ? 'cargo de aprendiz' : 'cargo de líder'}.</b>`,
      nzOkText: 'Confirmar',
      nzOkType: 'primary',
      nzOkDanger: danger ? danger : false,
      nzOkLoading: this.isLoadingMember,
      nzOnOk: () =>
        new Promise<void>((resolve) => {
          if (action === 'add') {
            this.addMemberRole(memberId, role);
          } else {
            this.removeMemberRole(memberId, role);
          }

          const subscription = this.modal.afterAllClose.subscribe(() => {
            subscription.unsubscribe();
            resolve();
          });
        }),
      nzCancelText: 'Cancelar',
    });
  }

  private setMinistry(ministry: IMinistry): void {
    this.ministry = {
      ...ministry,
      leaders: ministry.leaders.map((leader) => {
        return {
          ...leader,
          initials: getInitials(leader.name),
        };
      }),
      apprentices: ministry.apprentices.map((apprentice) => {
        return {
          ...apprentice,
          initials: getInitials(apprentice.name),
        };
      }),
    };
  }

  private setConfigs(): void {
    const { id, name } = this.ministry;

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.titleService.setTitle(getFormattedPageTitle(name));
    this.configService.setPageTitle(name);
    this.configService.setBreadcrumb([MINISTRIES_BREADCRUMB, { title: name, route: id! }]);
  }
}
