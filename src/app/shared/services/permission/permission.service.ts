import { UserRoleEnum } from '@app/shared/enums';
import { IAgrupe, IMinistry, IUser } from '@app/shared/models';

export class PermissionService {
  static checkUserPermission(user: IUser, entity?: IAgrupe | IMinistry): boolean {
    // Verifica se o usuário tem permissão de ADMIN, PASTORAL_TEAM ou SECRETARIAT
    if (
      user.roles.includes(UserRoleEnum.ADMIN) ||
      user.roles.includes(UserRoleEnum.PASTORAL_TEAM) ||
      user.roles.includes(UserRoleEnum.SECRETARIAT)
    ) {
      return true;
    }

    // Verifica se o usuário é um líder ou aprendiz em qualquer um dos objetos do array managers
    if (entity) {
      if (
        (entity.leaders && entity.leaders.some((leader) => leader.id === user.personId)) ||
        (entity.apprentices &&
          entity.apprentices.some((apprentice) => apprentice.id === user.personId))
      ) {
        return true;
      }
    }

    return false;
  }
}
