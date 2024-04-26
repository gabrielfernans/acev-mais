import { UserRoleEnum } from '@app/shared';

export interface IUser {
  name: string;
  email: string;
  personId: string;
  roles: UserRoleEnum[];
}
