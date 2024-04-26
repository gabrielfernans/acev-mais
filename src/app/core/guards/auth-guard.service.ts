import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RoutePermissionEnum, TokenService } from '@app/shared';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const routePermissions: RoutePermissionEnum[] =
      (route.data?.['permission'] as RoutePermissionEnum[]) || [];

    if (this.tokenService.isLoggedIn()) {
      if (routePermissions.includes(RoutePermissionEnum.PUBLIC)) {
        this.router.navigate(['/dashboard']);
        return false;
      }
    } else {
      if (!routePermissions.includes(RoutePermissionEnum.PUBLIC)) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }

    return true;
  }
}
