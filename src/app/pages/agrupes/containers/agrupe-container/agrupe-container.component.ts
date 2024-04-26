import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, debounceTime, finalize, switchMap } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AGRUPES_BREADCRUMB,
  AgrupeService,
  ConfigService,
  ExternalService,
  FeedbackEnum,
  IGeocodeAddress,
  IMember,
  MemberRoleEnum,
  MemberService,
  PermissionService,
  TokenService,
  getFormattedPageTitle,
  getInitials,
} from '@app/shared';
import { IAgrupe } from '@app/shared/models/agrupe';
import { NzModalService } from 'ng-zorro-antd/modal';

const SERVER_HANDLE_SUCCESS = 'Alteração realizada com sucesso.';
const SERVER_ERROR = 'Não foi possível recuperar informações deste agrupe.';

@Component({
  selector: 'app-agrupe-container',
  templateUrl: './agrupe-container.component.html',
})
export class AgrupeContainerComponent implements OnInit {
  isManageable!: boolean;
  isModalOpen: boolean = false;
  isLoading!: boolean;
  isLoadingAddress!: boolean;
  isLoadingMember!: boolean;
  agrupe!: IAgrupe;
  agrupeId!: string;
  coordinates!: IGeocodeAddress;
  searchMembers$ = new Subject<string>();
  foundMembers: IMember[] = [];

  constructor(
    private agrupeService: AgrupeService,
    private memberService: MemberService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private externalService: ExternalService,
    private modal: NzModalService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.agrupeId = params['id'];
      this.getAgrupe();
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

  getAgrupe(): void {
    this.isLoading = true;

    this.agrupeService
      .getAgrupeById(this.agrupeId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (agrupe: IAgrupe) => {
          this.setAgrupe(agrupe);
          this.setConfigs();
          if (agrupe.address) {
            this.getCoordinates();
            return;
          }
          this.coordinates = { results: [] };
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/agrupes']);
        },
      });
  }

  getCoordinates(): void {
    const { street, number, neighborhood, city } = this.agrupe.address!;

    const address = `${street}, ${number}, ${neighborhood}, ${city}`;

    this.isLoadingAddress = true;

    this.externalService
      .getGeocodeCoordinates(address)
      .pipe(finalize(() => (this.isLoadingAddress = false)))
      .subscribe({
        next: (coordinates: IGeocodeAddress) => {
          this.coordinates = coordinates;
        },
      });
  }

  addMemberRole(memberId: string, role: MemberRoleEnum = MemberRoleEnum.MEMBER): void {
    this.isLoadingMember = true;

    this.agrupeService
      .addAgrupePerson(this.agrupe.id!, memberId, role)
      .pipe(
        finalize(() => {
          this.isLoadingMember = false;
          this.modal.closeAll();
        }),
      )
      .subscribe({
        next: () => {
          this.getAgrupe();
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

    this.agrupeService
      .removeAgrupePerson(this.agrupe.id!, memberId, role)
      .pipe(
        finalize(() => {
          this.isLoadingMember = false;
          this.modal.closeAll();
        }),
      )
      .subscribe({
        next: () => {
          this.getAgrupe();
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
        ${role === MemberRoleEnum.MEMBER ? 'agrupe' : role === MemberRoleEnum.APPRENTICE ? 'cargo de aprendiz' : 'cargo de líder'}.</b>`,
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

  private setAgrupe(agrupe: IAgrupe): void {
    this.agrupe = {
      ...agrupe,
      leaders: agrupe.leaders.map((leader) => {
        return {
          ...leader,
          initials: getInitials(leader.name),
        };
      }),
      apprentices: agrupe.apprentices.map((apprentice) => {
        return {
          ...apprentice,
          initials: getInitials(apprentice.name),
        };
      }),
    };
  }

  private setConfigs(): void {
    const { id, name } = this.agrupe;

    this.isManageable = PermissionService.checkUserPermission(
      this.tokenService.getLoggedUser(),
      this.agrupe,
    );
    this.titleService.setTitle(getFormattedPageTitle(name));
    this.configService.setPageTitle(name);
    this.configService.setBreadcrumb([AGRUPES_BREADCRUMB, { title: name, route: id! }]);
  }
}
