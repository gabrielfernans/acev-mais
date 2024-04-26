import { Component, OnInit } from '@angular/core';
import {
  ConfigService,
  FeedbackEnum,
  ISeries,
  IServerFeedback,
  PermissionService,
  SERIES_BREADCRUMB,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  SeriesService,
  TokenService,
  getServerFeedback,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-series-container',
  templateUrl: './series-container.component.html',
  styleUrls: ['./series-container.component.scss'],
})
export class SeriesContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  serverError!: boolean;
  serverFeedback!: IServerFeedback;

  series: ISeries[] = [];

  constructor(
    private seriesService: SeriesService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.setConfigs();
    this.getSeries();
  }

  getSeries(): void {
    this.isLoading = true;

    this.seriesService
      .getSeries()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.serverFeedback = getServerFeedback(this.serverError);
        }),
      )
      .subscribe({
        next: (series: ISeries[]) => {
          this.series = series;
        },
        error: () => {
          this.serverError = true;
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  private setConfigs(): void {
    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle('Séries');
    this.configService.setBreadcrumb([SERIES_BREADCRUMB]);
  }
}
