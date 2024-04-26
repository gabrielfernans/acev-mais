import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService, getGreeting, IBreadcrumbItem, TokenService } from '@app/shared';

interface ISidebarMenuItem {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  pageTitle!: string;
  userGreeting!: string;
  breadcrumbs: IBreadcrumbItem[] = [];
  menus: ISidebarMenuItem[] = [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'area-chart',
    },
    {
      title: 'Membros',
      route: '/members',
      icon: 'team',
    },
    {
      title: 'Agrupes',
      route: '/agrupes',
      icon: 'home',
    },
    {
      title: 'Ministérios',
      route: '/ministries',
      icon: 'bank',
    },
    {
      title: 'Estudos',
      route: '/series',
      icon: 'book',
    },
    {
      title: 'Relatório de agrupes',
      route: '/agrupe-meetings',
      icon: 'coffee',
    },
  ];

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
  ) {
    const userName = this.tokenService.getLoggedUser().name.split(' ')[0];
    this.userGreeting = `${getGreeting()}, ${userName}`;
  }

  ngOnInit() {
    this.configService.breadcrumb$.subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
      this.cdr.detectChanges();
    });

    this.configService.pageTitle$.subscribe((pageTitle) => {
      this.pageTitle = pageTitle;
    });
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
