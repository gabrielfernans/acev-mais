import {
  GenderEnum,
  MaritalStatusEnum,
  MemberEntryCategoryEnum,
  MemberTypeEnum,
  IMinistryMinimal,
  IAddress,
} from '@app/shared';

export interface IMember {
  id: string;
  name: string;
  memberType: MemberTypeEnum;
  gender: GenderEnum;
  maritalStatus: MaritalStatusEnum;
  birthDate: string;
  email: string;
  phone: string;
  entryCategory: MemberEntryCategoryEnum;
  isAgrupeLeader: boolean;
  isAgrupeApprentice: boolean;
  isArchived?: boolean;
  ministries: IMinistryMinimal[];
  photoUrl?: string;
  entryDate?: string;
  address?: IAddress;
  idAgrupe?: string;
  agrupeName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMemberMinimal {
  id: string;
  email: string;
  name: string;
  isAgrupeLeader: boolean;
  isAgrupeApprentice: boolean;
  photoUrl: string;
  initials?: string;
}
