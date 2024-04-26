import { Component, OnInit } from '@angular/core';
import {
  ConfigService,
  FeedbackEnum,
  IMinistry,
  IServerFeedback,
  MINISTRIES_BREADCRUMB,
  MinistryService,
  PermissionService,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  TokenService,
  getServerFeedback,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ministries-container',
  templateUrl: './ministries-container.component.html',
  styleUrls: ['./ministries-container.component.scss'],
})
export class MinistriesContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  serverError!: boolean;
  serverFeedback!: IServerFeedback;

  ministries: IMinistry[] = [];

  constructor(
    private ministryService: MinistryService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.setConfigs();
    this.getMinistries();
  }

  getMinistries(): void {
    this.isLoading = true;

    this.ministryService
      .getMinistries()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.serverFeedback = getServerFeedback(this.serverError);
        }),
      )
      .subscribe({
        next: (ministries: IMinistry[]) => {
          this.ministries = ministries;
        },
        error: () => {
          this.serverError = true;
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  private setConfigs(): void {
    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle('Ministérios');
    this.configService.setBreadcrumb([MINISTRIES_BREADCRUMB]);
  }
}
