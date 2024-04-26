import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import {
  AGRUPE_MEETINGS_BREADCRUMB,
  AgrupeMeetingService,
  AgrupeService,
  ConfigService,
  FeedbackEnum,
  IAgrupe,
  IAgrupeMeeting,
  IAgrupeMeetingFilterParams,
  IAgrupeMeetingPaginationParams,
  IServerFeedback,
  IUser,
  PagedResponse,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  TokenService,
  getServerFeedback,
} from '@app/shared';

@Component({
  selector: 'app-agrupe-meetings-container',
  templateUrl: './agrupe-meetings-container.component.html',
  styleUrls: ['./agrupe-meetings-container.component.scss'],
})
export class AgrupeMeetingsContainerComponent implements OnInit {
  loggedUser!: IUser;
  isLoading!: boolean;
  serverError!: boolean;
  serverFeedback!: IServerFeedback;
  pageIndex: number = 1;
  pageTotal!: number;

  selectedAgrupe!: string;
  agrupes!: IAgrupe[];
  agrupeMeetings: IAgrupeMeeting[] = [];

  constructor(
    private agrupeService: AgrupeService,
    private agrupeMeetingService: AgrupeMeetingService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.setConfigs();
    this.getAgrupes();
    this.getAgrupeMeetings({ pagination: { size: 10, page: 0 }, filters: {} });
  }

  getAgrupes(): void {
    this.agrupeService.getAgrupes().subscribe({
      next: (agrupes: IAgrupe[]) => {
        this.agrupes = agrupes;
      },
      error: () => {
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  getAgrupeMeetings(data: {
    pagination: IAgrupeMeetingPaginationParams;
    filters: IAgrupeMeetingFilterParams;
  }): void {
    let { pagination, filters } = data;

    if (this.selectedAgrupe) {
      filters = { ...filters, idAgrupe: this.selectedAgrupe };
    }

    this.isLoading = true;
    this.agrupeMeetingService
      .getAgrupeMeetings(pagination, filters)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.serverFeedback = getServerFeedback(this.serverError);
        }),
      )
      .subscribe({
        next: (response: PagedResponse<IAgrupeMeeting>) => {
          this.agrupeMeetings = response.data;
          this.pageTotal = response.totalElements;
        },
        error: () => {
          this.serverError = true;
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  onChangeFilter(): void {
    this.getAgrupeMeetings({ pagination: { size: 10, page: 0 }, filters: {} });
  }

  private setConfigs(): void {
    this.loggedUser = this.tokenService.getLoggedUser();
    this.configService.setPageTitle(AGRUPE_MEETINGS_BREADCRUMB.title);
    this.configService.setBreadcrumb([AGRUPE_MEETINGS_BREADCRUMB]);
  }
}
