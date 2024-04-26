import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  IMinistry,
  IMemberMinimal,
  IMember,
  ListingType,
  MemberRoleEnum,
  PHONE_MASK,
} from '@app/shared';

interface IMinistryCard {
  color: string;
  backgroundColor: string;
  title: string;
  value: string | number;
  icon: string;
}

interface IMinistryMenu {
  title: string;
  value: MinistryMenuItem;
  icon: string;
}

type MinistryMenuItem = 'members';

interface IColumnItem {
  name: string;
  key: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-ministry-page',
  templateUrl: './ministry-page.component.html',
  styleUrls: ['./ministry-page.component.scss'],
})
export class MinistryPageComponent implements OnInit {
  @Input() isManageable!: boolean;
  @Input() ministry!: IMinistry;
  @Input() foundMembers!: IMember[];
  @Input() isModalOpen!: boolean;
  @Input() isLoadingMember!: boolean;
  @Output() memberRoleChange = new EventEmitter<{
    action: 'add' | 'remove';
    memberId: string;
    role: MemberRoleEnum;
    danger?: boolean;
  }>();
  @Output() memberSearch = new EventEmitter<string>();
  @Output() memberAdd = new EventEmitter<string>();
  @Output() modalChange = new EventEmitter();

  menus!: IMinistryMenu[];
  phoneMask = PHONE_MASK;

  addressView!: string;
  ministryCards!: IMinistryCard[];
  leadership!: IMemberMinimal[];

  activeMenu: MinistryMenuItem = 'members';

  tableColumns: IColumnItem[] = [];
  tableListingType: ListingType = 'list';

  apprenticeRole = MemberRoleEnum.APPRENTICE;
  leaderRole = MemberRoleEnum.LEADER;

  selectedUser?: string;

  constructor(private router: Router) {
    this.menus = [
      {
        title: 'Membros',
        value: 'members',
        icon: 'team',
      },
    ];
  }

  ngOnInit(): void {
    this.setColumns();
    this.setMinistryCards();
    this.setMinistryData();
  }

  onChangeMenu(menuItem: MinistryMenuItem): void {
    this.activeMenu = menuItem;
  }

  onSearchMembers(query: string): void {
    if (!query || query === '') return;
    this.memberSearch.emit(query);
  }

  manageMinistry(): void {
    this.router.navigate([`ministries/${this.ministry.id}/manage`]);
  }

  addMember(): void {
    this.memberAdd.emit(this.selectedUser!);
  }

  removeMember(member: IMemberMinimal): void {
    this.memberRoleChange.emit({
      action: 'remove',
      memberId: member.id,
      role: MemberRoleEnum.MEMBER,
      danger: true,
    });
  }

  addMemberRole(member: IMemberMinimal, role: MemberRoleEnum): void {
    this.memberRoleChange.emit({
      action: 'add',
      memberId: member.id,
      role,
    });
  }

  removeMemberRole(member: IMemberMinimal, role: MemberRoleEnum): void {
    this.memberRoleChange.emit({
      action: 'remove',
      memberId: member.id,
      role,
    });
  }

  changeModal(): void {
    this.modalChange.emit();
  }

  isMemberAlreadyAdded(memberId: string): boolean {
    return this.ministry.members.some((member) => member.id === memberId);
  }

  isMemberLeader(memberId: string): boolean {
    return this.ministry.leaders.findIndex((member) => member.id === memberId) !== -1;
  }

  isMemberApprentice(memberId: string): boolean {
    return this.ministry.apprentices.findIndex((member) => member.id === memberId) !== -1;
  }

  private setMinistryData(): void {
    const { apprentices, leaders } = this.ministry;

    this.leadership = [...apprentices, ...leaders];
  }

  private setMinistryCards(): void {
    this.ministryCards = [
      {
        title: 'Membros',
        value: this.ministry.members.length,
        icon: 'team',
        color: '#00a4c6',
        backgroundColor: '#d5e6f8',
      },
    ];
  }

  private setColumns(): void {
    this.tableColumns = [
      { name: 'Nome', key: 'name' },
      { name: 'Função', key: 'role', align: 'center' },
    ];
    if (this.isManageable) {
      this.tableColumns.push({ name: 'Ações', key: 'actions', align: 'center' });
    }
  }
}
