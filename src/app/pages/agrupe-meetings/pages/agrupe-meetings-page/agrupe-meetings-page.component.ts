import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AgrupeCategoryEnum,
  AgrupeCategoryLabelEnum,
  IAgrupe,
  IAgrupeMeeting,
  IAgrupeMeetingFilterParams,
  IAgrupeMeetingPaginationParams,
  IMemberMinimal,
  IUser,
  PermissionService,
  getRandomGradient,
} from '@app/shared';

@Component({
  selector: 'app-agrupe-meetings-page',
  templateUrl: './agrupe-meetings-page.component.html',
  styleUrls: ['./agrupe-meetings-page.component.scss'],
})
export class AgrupeMeetingsPageComponent implements OnInit {
  @Input() loggedUser!: IUser;
  @Input() agrupeMeetings!: IAgrupeMeeting[];
  @Input() pageTotal!: number;
  @Input() pageIndex!: number;
  @Output() getAgrupeMeetings = new EventEmitter<{
    pagination: IAgrupeMeetingPaginationParams;
    filters: IAgrupeMeetingFilterParams;
  }>();

  agrupeMeetingsMetadata!: {
    backgroundColor: string;
    backgroundImage: string;
    tagName: AgrupeCategoryLabelEnum;
  }[];

  searchValue: string | null = null;
  pageSize: number = 10;
  showParticipantsModal = false;
  activeAgrupeMeeting!: IAgrupeMeeting;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setMetadata();
  }

  onChangeParams() {
    const pagination: IAgrupeMeetingPaginationParams = {
      size: this.pageSize,
      page: this.pageIndex - 1,
    };

    const filters: IAgrupeMeetingFilterParams = {};

    this.getAgrupeMeetings.emit({ pagination, filters });
  }

  getAgrupeTagName(category: AgrupeCategoryEnum): AgrupeCategoryLabelEnum {
    return AgrupeCategoryLabelEnum[category];
  }

  getAvatarText(frequenter: IMemberMinimal, agrupe: IAgrupe): string {
    if (!frequenter.photoUrl) {
      return frequenter.name.charAt(0).toUpperCase();
    } else if (agrupe.frequenters.length > 3 && agrupe.frequenters.indexOf(frequenter) === 2) {
      return `+${agrupe.frequenters.length - 3}`;
    } else {
      return '';
    }
  }

  redirectToAgrupe(agrupe: IAgrupe): void {
    this.router.navigate(['agrupes', agrupe.id]);
  }

  openParticipantsModal(agrupeMeeting: IAgrupeMeeting): void {
    this.activeAgrupeMeeting = agrupeMeeting;
    this.showParticipantsModal = true;
  }

  openFile(url: string): void {
    if (!url) return;
    window.open(url, '_blank');
  }

  editMeeting(agrupeMeeting: IAgrupeMeeting): void {
    this.router.navigate([`agrupe-meetings/${agrupeMeeting.id}/manage`]);
  }

  canManage(agrupeMeeting: IAgrupeMeeting): boolean {
    return PermissionService.checkUserPermission(this.loggedUser, agrupeMeeting.agrupe);
  }

  private setMetadata(): void {
    this.agrupeMeetingsMetadata = this.agrupeMeetings.map((agrupeMeeting) => {
      const { backgroundColor, backgroundImage } = getRandomGradient();

      return {
        backgroundColor,
        backgroundImage,
        tagName: AgrupeCategoryLabelEnum[agrupeMeeting.agrupe.category],
      };
    });
  }
}
