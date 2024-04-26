import { AgrupeCategoryEnum, IAddress, IMemberMinimal, WeekdayEnum } from '@app/shared';

export interface IAgrupe {
  id?: string;
  name: string;
  category: AgrupeCategoryEnum;
  dayOfMeeting: WeekdayEnum;
  description: string;
  meetingsCount: number;
  photoUrl?: string;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  address?: IAddress;
  frequenters: IMemberMinimal[];
  apprentices: IMemberMinimal[];
  leaders: IMemberMinimal[];
}
