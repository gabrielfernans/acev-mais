import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ConfigService,
  ExternalService,
  FeedbackEnum,
  getFormattedPageTitle,
  IGeocodeAddress,
  IMember,
  MEMBERS_BREADCRUMB,
  MemberService,
  PermissionService,
  TokenService,
} from '@app/shared';

const SERVER_ERROR = 'Não foi possível recuperar informações deste membro.';

@Component({
  selector: 'app-member-container',
  templateUrl: './member-container.component.html',
})
export class MemberContainerComponent implements OnInit {
  isManageable!: boolean;
  isLoading!: boolean;
  isLoadingAddress!: boolean;
  member!: IMember;
  memberId!: string;
  coordinates!: IGeocodeAddress;

  constructor(
    private memberService: MemberService,
    private notification: NzNotificationService,
    private configService: ConfigService,
    private externalService: ExternalService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.memberId = params['id'];
      this.getMember();
    });
  }

  getMember(): void {
    this.isLoading = true;

    this.memberService
      .getMemberById(this.memberId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (member: IMember) => {
          this.member = member;
          this.setConfigs();
          if (member.address) {
            this.getCoordinates();
            return;
          }
          this.coordinates = { results: [] };
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/members']);
        },
      });
  }

  getCoordinates(): void {
    const { street, number, neighborhood, city } = this.member.address!;

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

  private setConfigs(): void {
    const { id, name } = this.member;

    this.isManageable = PermissionService.checkUserPermission(this.tokenService.getLoggedUser());
    this.titleService.setTitle(getFormattedPageTitle(name));
    this.configService.setPageTitle(name);
    this.configService.setBreadcrumb([
      MEMBERS_BREADCRUMB,
      { title: name.split(' ')[0], route: id },
    ]);
  }
}
