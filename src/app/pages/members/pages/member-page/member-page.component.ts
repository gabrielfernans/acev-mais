import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GenderEnum,
  GenderLabelEnum,
  IGeocodeAddress,
  IMember,
  MaritalStatusEnum,
  MaritalStatusLabelEnum,
  MemberEntryCategoryEnum,
  MemberTypeEnum,
  PHONE_MASK,
  applyPhoneMask,
} from '@app/shared';

interface IMemberTag {
  color: string;
  title: string;
}

interface IMemberMenu {
  title: string;
  value: MemberMenuItem;
  icon: string;
}

interface IMemberData {
  label: string;
  value: string;
}

type MemberMenuItem = 'profile' | 'address' | 'ministries' | 'agrupe';

@Component({
  selector: 'app-member-page',
  templateUrl: './member-page.component.html',
  styleUrls: ['./member-page.component.scss'],
})
export class MemberPageComponent implements OnInit {
  @Input() isManageable!: boolean;
  @Input() member!: IMember;
  @Input() coordinates!: IGeocodeAddress;
  @Input() isLoadingAddress!: boolean;

  phoneMask = PHONE_MASK;

  menus!: IMemberMenu[];
  memberTags!: IMemberTag[];
  memberProfile!: IMemberData[];
  memberContact!: IMemberData[];

  addressView!: string;

  activeMenu: MemberMenuItem = 'profile';

  constructor(private router: Router) {
    this.menus = [
      {
        title: 'Perfil',
        value: 'profile',
        icon: 'user',
      },
      {
        title: 'Endereço',
        value: 'address',
        icon: 'global',
      },
      {
        title: 'Ministérios',
        value: 'ministries',
        icon: 'team',
      },
      {
        title: 'Agrupe',
        value: 'agrupe',
        icon: 'home',
      },
    ];
  }

  ngOnInit(): void {
    this.setMemberTags();
    this.setMemberData();
  }

  onChangeMenu(menuItem: MemberMenuItem): void {
    this.activeMenu = menuItem;
  }

  manageMember(): void {
    this.router.navigate([`members/${this.member.id}/manage`]);
  }

  private setMemberData(): void {
    this.memberProfile = [];
    this.memberContact = [];

    let street, number, complement, neighborhood, city, state, postalCode;

    if (this.member.address) {
      ({ street, number, complement, neighborhood, city, state, postalCode } = this.member.address);
    }

    this.addressView = `${street}, ${number},${complement ? ` ${complement},` : ''} ${neighborhood} <br /> ${city}/${state} - ${postalCode}`;

    this.memberProfile.push(
      {
        label: 'Nome',
        value: this.member.name,
      },
      {
        label: 'Data de nascimento',
        value: formatDate(this.member.birthDate, 'dd/MM/yyyy', 'pt'),
      },
      {
        label: 'Gênero',
        value: GenderLabelEnum[this.member.gender],
      },
      {
        label: 'Estado civil',
        value: MaritalStatusLabelEnum[this.member.maritalStatus],
      },
    );

    this.memberContact.push(
      {
        label: 'E-mail',
        value: this.member.email || 'Não possui',
      },
      {
        label: 'Contato',
        value: applyPhoneMask(this.member.phone) || 'Não possui',
      },
    );
  }

  private setMemberTags(): void {
    this.memberTags = [];

    this.memberTags.push(
      this.member.memberType === MemberTypeEnum.MEMBER
        ? { title: 'Membro', color: 'var(--custom-primary-teal)' }
        : { title: 'Congregado', color: 'var(--custom-primary-color-text)' },
    );

    this.memberTags.push(
      this.member.idAgrupe
        ? { title: this.member.agrupeName!, color: 'var(--custom-secondary-color-text)' }
        : { title: 'Sem agrupe', color: 'var(--custom-primary-color-text)' },
    );

    if (this.member.isArchived) {
      this.memberTags.push({
        title: 'Membro arquivado',
        color: 'var(--custom-primary-color-text)',
      });
    }
  }
}
