import { IMemberMinimal } from '@app/shared';

export interface IMinistry {
  id?: string;
  name: string;
  description: string;
  members: IMemberMinimal[];
  apprentices: IMemberMinimal[];
  leaders: IMemberMinimal[];
  photoUrl?: string;
  isArchived?: boolean;
  foundation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMinistryMinimal {
  id: string;
  name: string;
}
