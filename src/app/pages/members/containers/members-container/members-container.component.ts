import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, debounceTime, finalize, switchMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  ConfigService,
  FeedbackEnum,
  IMember,
  IMemberFilterParams,
  IMemberPaginationParams,
  MEMBERS_BREADCRUMB,
  MemberService,
  PagedResponse,
  PermissionService,
  TokenService,
} from '@app/shared';

const SERVER_ERROR = 'Não foi possível recuperar a lista de membros.';

@Component({
  selector: 'app-members-container',
  templateUrl: './members-container.component.html',
})
export class MembersContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  pageIndex: number = 1;
  pageTotal!: number;
  members!: IMember[];
  searchMembers$ = new Subject<{
    pagination: IMemberPaginationParams;
    filters: IMemberFilterParams;
  }>();

  constructor(
    private memberService: MemberService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.setConfigs();
    this.getMembers();
  }

  getMembers(): void {
    this.isLoading = true;

    this.searchMembers$
      .pipe(debounceTime(500))
      .pipe(
        switchMap((data: { pagination: IMemberPaginationParams; filters: IMemberFilterParams }) =>
          this.memberService.getMembers(data.pagination, data.filters),
        ),
      )
      .subscribe({
        next: (response: PagedResponse<IMember>) => {
          this.pageTotal = response.totalElements;
          this.members = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.members = [];
          this.isLoading = false;
        },
      });
  }

  onMemberSearch(data: {
    pagination: IMemberPaginationParams;
    filters: IMemberFilterParams;
  }): void {
    this.isLoading = true;
    this.searchMembers$.next(data);
  }

  private setConfigs(): void {
    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle('Membros');
    this.configService.setBreadcrumb([MEMBERS_BREADCRUMB]);
  }
}
