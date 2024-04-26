import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../../shared/services/permission/permission.service';
import {
  AGRUPES_BREADCRUMB,
  AgrupeService,
  ConfigService,
  FeedbackEnum,
  IAgrupe,
  IServerFeedback,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
  TokenService,
  getServerFeedback,
} from '@app/shared';

@Component({
  selector: 'app-agrupes-container',
  templateUrl: './agrupes-container.component.html',
  styleUrls: ['./agrupes-container.component.scss'],
})
export class AgrupesContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  serverError!: boolean;
  serverFeedback!: IServerFeedback;

  agrupes: IAgrupe[] = [];

  constructor(
    private agrupeService: AgrupeService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.setConfigs();
    this.getAgrupes();
  }

  getAgrupes(): void {
    this.isLoading = true;

    this.agrupeService
      .getAgrupes()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.serverFeedback = getServerFeedback(this.serverError);
        }),
      )
      .subscribe({
        next: (agrupes: IAgrupe[]) => {
          this.agrupes = agrupes;
        },
        error: () => {
          this.serverError = true;
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  private setConfigs(): void {
    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.configService.setPageTitle('Agrupes');
    this.configService.setBreadcrumb([AGRUPES_BREADCRUMB]);
  }
}
