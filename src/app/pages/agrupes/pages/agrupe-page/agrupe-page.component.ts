import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AgrupeCategoryLabelEnum,
  IAgrupe,
  IMemberMinimal,
  IGeocodeAddress,
  IMember,
  ListingType,
  MemberRoleEnum,
  PHONE_MASK,
  WeekdayLabelEnum,
} from '@app/shared';

interface IAgrupeCard {
  color: string;
  backgroundColor: string;
  title: string;
  value: string | number;
  icon: string;
}

interface IAgrupeMenu {
  title: string;
  value: AgrupeMenuItem;
  icon: string;
}

interface IAgrupeView {
  name: string;
  category: string;
  dayOfMeeting: string;
  description: string;
}

type AgrupeMenuItem = 'address' | 'members' | 'meetings';

interface IColumnItem {
  name: string;
  key: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-agrupe-page',
  templateUrl: './agrupe-page.component.html',
  styleUrls: ['./agrupe-page.component.scss'],
})
export class AgrupePageComponent implements OnInit {
  @Input() agrupe!: IAgrupe;
  @Input() foundMembers!: IMember[];
  @Input() coordinates!: IGeocodeAddress;
  @Input() isModalOpen!: boolean;
  @Input() isManageable!: boolean;
  @Input() isLoadingAddress!: boolean;
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

  menus!: IAgrupeMenu[];
  phoneMask = PHONE_MASK;

  addressView!: string;
  agrupeView!: IAgrupeView;
  agrupeCards!: IAgrupeCard[];
  leadership!: IMemberMinimal[];

  activeMenu: AgrupeMenuItem = 'members';

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
      // {
      //   title: 'Encontros',
      //   value: 'meetings',
      //   icon: 'book',
      // },
      {
        title: 'Endereço',
        value: 'address',
        icon: 'global',
      },
    ];
  }

  ngOnInit(): void {
    this.setColumns();
    this.setAgrupeCards();
    this.setAgrupeData();
  }

  onChangeMenu(menuItem: AgrupeMenuItem): void {
    this.activeMenu = menuItem;
  }

  onSearchMembers(query: string): void {
    if (!query || query === '') return;
    this.memberSearch.emit(query);
  }

  manageAgrupe(): void {
    this.router.navigate([`agrupes/${this.agrupe.id}/manage`]);
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
    return this.agrupe.frequenters.some((member) => member.id === memberId);
  }

  private setAgrupeData(): void {
    let street, number, complement, neighborhood, city, state, postalCode;

    const { name, description, leaders, apprentices } = this.agrupe;

    if (this.agrupe.address) {
      ({ street, number, complement, neighborhood, city, state, postalCode } = this.agrupe.address);
    }

    this.addressView = `${street}, ${number},${complement ? ` ${complement},` : ''} ${neighborhood} <br /> ${city}/${state} - ${postalCode}`;

    this.leadership = [...apprentices, ...leaders];

    this.agrupeView = {
      category: `Agrupe de ${AgrupeCategoryLabelEnum[this.agrupe.category]}`,
      name,
      description,
      dayOfMeeting: `Encontros no(a) ${WeekdayLabelEnum[this.agrupe.dayOfMeeting]}`,
    };
  }

  private setAgrupeCards(): void {
    this.agrupeCards = [
      {
        title: 'Membros',
        value: this.agrupe.frequenters.length,
        icon: 'team',
        color: '#00a4c6',
        backgroundColor: '#d5e6f8',
      },
      // {
      //   title: 'Convidados',
      //   value: 0,
      //   icon: 'usergroup-add',
      //   color: '#ff8749',
      //   backgroundColor: '#fdefcb',
      // },
      {
        title: 'Reuniões',
        value: this.agrupe.meetingsCount,
        icon: 'usergroup-add',
        color: '#9f15dc',
        backgroundColor: '#efcdff',
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
