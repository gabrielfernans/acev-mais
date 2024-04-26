import { Component, OnInit } from '@angular/core';
import {
  ConfigService,
  DASHBOARD_BREADCRUMB,
  DashboardService,
  FeedbackEnum,
  getServerFeedback,
  IDashboard,
  IServerFeedback,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';
import Chart from 'chart.js/auto';

interface IDashboardCard {
  title: string;
  value: number | string;
  icon: string;
  iconColor: string;
  iconBackground: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading: boolean = true;
  cards!: IDashboardCard[];
  serverError!: boolean;
  serverFeedback!: IServerFeedback;
  dashboard!: IDashboard;
  membersInAgrupesChart!: any;
  membersInMinistriesChart!: any;

  constructor(
    private configService: ConfigService,
    private notification: NzNotificationService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit() {
    this.setConfigs();
    this.getMetrics();
  }

  getMetrics(): void {
    this.dashboardService
      .getMetrics()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.serverFeedback = getServerFeedback(this.serverError);
        }),
      )
      .subscribe({
        next: (dashboard: IDashboard) => {
          this.dashboard = dashboard;
          this.setCards();
          this.createCharts();
        },
        error: () => {
          this.serverError = true;
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  private createCharts() {
    this.setMemberInAgrupesChart();
    this.setMemberInMinistriesChart();
  }

  private setMemberInAgrupesChart(): void {
    const { membersInAgrupes, congregantsInAgrupes, members, congregants } = this.dashboard;
    this.membersInAgrupesChart = new Chart('membersInAgrupesChart', {
      type: 'doughnut',
      data: {
        labels: ['Membros', 'Congregados', 'Sem agrupe'],
        datasets: [
          {
            data: [
              membersInAgrupes,
              congregantsInAgrupes,
              members + congregants - (membersInAgrupes + congregantsInAgrupes),
            ],
            backgroundColor: [
              this.cards[0].iconColor,
              this.cards[2].iconColor,
              this.cards[3].iconBackground,
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            text: 'Participantes de agrupe',
          },
        },
        responsive: true,
      },
    });
  }

  private setMemberInMinistriesChart(): void {
    const { membersInMinistries, members } = this.dashboard;
    this.membersInMinistriesChart = new Chart('membersInMinistriesChart', {
      type: 'doughnut',
      data: {
        labels: ['Membros', 'Sem ministério'],
        datasets: [
          {
            data: [membersInMinistries, members - membersInMinistries],
            backgroundColor: [this.cards[0].iconColor, this.cards[3].iconBackground],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            text: 'Participantes de ministério',
          },
        },
        responsive: true,
      },
    });
  }

  private setCards(): void {
    this.cards = [
      {
        title: 'Membros',
        value: this.dashboard.members || '-',
        icon: 'team',
        iconBackground: '#d5e6f8',
        iconColor: '#00a4c6',
      },
      {
        title: 'Congregados',
        value: this.dashboard.congregants || '-',
        icon: 'usergroup-add',
        iconBackground: '#fdefcb',
        iconColor: '#ff8749',
      },
      {
        title: 'Agrupes',
        value: this.dashboard.agrupes || '-',
        icon: 'home',
        iconBackground: '#efcdff',
        iconColor: '#9f15dc',
      },
      {
        title: 'Ministérios',
        value: this.dashboard.ministries || '-',
        icon: 'bank',
        iconBackground: '#ffcdce',
        iconColor: '#f40f0e',
      },
    ];
  }

  private setConfigs(): void {
    this.configService.setPageTitle('Dashboard');
    this.configService.setBreadcrumb([DASHBOARD_BREADCRUMB]);
  }
}
