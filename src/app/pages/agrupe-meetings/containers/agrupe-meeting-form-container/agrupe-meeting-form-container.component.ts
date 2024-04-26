import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AGRUPE_MEETINGS_BREADCRUMB,
  AgrupeMeetingService,
  AgrupeService,
  ConfigService,
  FeedbackEnum,
  IAgrupe,
  IAgrupeMeeting,
  IAgrupeMeetingRequestParams,
  ILesson,
  IMember,
  ISeries,
  LessonService,
  MemberService,
  SeriesService,
  SERVER_ERROR_FEEDBACK_DESCRIPTION,
} from '@app/shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { debounceTime, finalize, forkJoin, Subject, switchMap } from 'rxjs';

const AGRUPE_MEETING_UPDATED_SUCCESSFULLY_MESSAGE =
  'O relatório de agrupe foi atualizado com sucesso.';
const AGRUPE_MEETING_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O relatório de agrupe foi atualizado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const AGRUPE_MEETING_CREATED_SUCCESSFULLY_MESSAGE =
  'O relatório de agrupe foi cadastrado com sucesso.';
const AGRUPE_MEETING_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE =
  'O relatório de agrupe foi cadastrado com sucesso. Porém não foi possível anexar a imagem, tente inseri-la novamente.';

const SERVER_ERROR = 'Não foi possível recuperar informações deste relatório de agrupe.';

@Component({
  selector: 'app-agrupe-meeting-form-container',
  templateUrl: './agrupe-meeting-form-container.component.html',
  styleUrls: ['./agrupe-meeting-form-container.component.scss'],
})
export class AgrupeMeetingFormContainerComponent implements OnInit {
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  isLoadingMember: boolean = false;
  isManagement: boolean = false;
  series!: ISeries[];
  lessons!: ILesson[];
  agrupes!: IAgrupe[];
  searchMembers$ = new Subject<string>();
  foundMembers: IMember[] = [];

  agrupeMeeting!: IAgrupeMeeting;

  constructor(
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private agrupeService: AgrupeService,
    private memberService: MemberService,
    private seriesService: SeriesService,
    private agrupeMeetingService: AgrupeMeetingService,
    private configService: ConfigService,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.searchMembers();
    this.getData();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isManagement = true;
        this.getAgrupeMeeting(id);
        return;
      }
      this.setConfigs();
    });
  }

  getData(): void {
    forkJoin({
      series: this.seriesService.getSeries(),
      agrupes: this.agrupeService.getAgrupes(),
    }).subscribe({
      next: ({ series, agrupes }) => {
        this.series = series;
        this.agrupes = agrupes;
        this.isLoading = false;
      },
      error: () => {
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
        this.router.navigate(['/agrupe-meetings']);
      },
    });
  }

  getAgrupeMeeting(id: string): void {
    this.agrupeMeetingService
      .getAgrupeMeetingById(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (agrupeMeeting: IAgrupeMeeting) => {
          this.agrupeMeeting = agrupeMeeting;
          this.setConfigs();
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR);
          this.router.navigate(['/agrupe-meetings']);
        },
      });
  }

  searchMembers(): void {
    this.searchMembers$
      .pipe(debounceTime(500))
      .pipe(switchMap((query: string) => this.memberService.searchMembers(query)))
      .subscribe((members: IMember[]) => {
        this.foundMembers = members;
        this.isLoadingMember = false;
      });
  }

  onMemberSearch(query: string): void {
    this.isLoadingMember = true;
    this.searchMembers$.next(query);
  }

  submit(data: { params: IAgrupeMeetingRequestParams; photo?: File }): void {
    if (this.isManagement) {
      this.updateAgrupeMeeting(data);
      return;
    }
    this.addAgrupeMeeting(data);
  }

  addAgrupeMeeting(data: { params: IAgrupeMeetingRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.agrupeMeetingService.addAgrupeMeeting(params).subscribe({
      next: (agrupeMeeting: IAgrupeMeeting) => {
        if (photo) {
          this.addPhoto(agrupeMeeting.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(
          FeedbackEnum.SUCCESS,
          AGRUPE_MEETING_CREATED_SUCCESSFULLY_MESSAGE,
        );
        this.router.navigate(['/agrupe-meetings']);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  updateAgrupeMeeting(data: { params: IAgrupeMeetingRequestParams; photo?: File }): void {
    const { params, photo } = data;

    this.isSubmitting = true;
    this.agrupeMeetingService.updateAgrupeMeeting(this.agrupeMeeting.id!, params).subscribe({
      next: (agrupeMeeting: IAgrupeMeeting) => {
        if (photo) {
          this.addPhoto(agrupeMeeting.id!, photo);
          return;
        }
        this.isSubmitting = false;
        this.notification.success(
          FeedbackEnum.SUCCESS,
          AGRUPE_MEETING_UPDATED_SUCCESSFULLY_MESSAGE,
        );
        this.router.navigate(['/agrupe-meetings']);
      },
      error: () => {
        this.isSubmitting = false;
        this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
      },
    });
  }

  addPhoto(agrupeMeetingId: string, photo: File): void {
    const formData = new FormData();
    formData.append('photo', photo);

    this.agrupeMeetingService
      .addAgrupeMeetingPhoto(agrupeMeetingId, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.router.navigate(['/agrupe-meetings']);
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            this.isManagement
              ? AGRUPE_MEETING_UPDATED_SUCCESSFULLY_MESSAGE
              : AGRUPE_MEETING_CREATED_SUCCESSFULLY_MESSAGE,
          );
        },
        error: () => {
          this.notification.warning(
            FeedbackEnum.WARNING,
            this.isManagement
              ? AGRUPE_MEETING_UPDATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE
              : AGRUPE_MEETING_CREATED_SUCCESSFULLY_WITHOUT_PHOTO_MESSAGE,
          );
        },
      });
  }

  deleteAgrupeMeeting(id: string): void {
    this.isLoading = true;
    this.agrupeMeetingService
      .removeAgrupeMeeting(id)
      .pipe(
        finalize(() => {
          this.modal.closeAll();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.notification.success(
            FeedbackEnum.SUCCESS,
            `Relatório de agrupe excluído com sucesso.`,
          );
          this.router.navigate(['/agrupe-meetings']);
        },
        error: () => {
          this.notification.error(FeedbackEnum.ERROR, SERVER_ERROR_FEEDBACK_DESCRIPTION);
        },
      });
  }

  openDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: `Tem certeza que deseja excluir este relatório?`,
      nzContent: `<b>O relatório será excluído permanentemente.</b>`,
      nzOkText: `Excluir`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteAgrupeMeeting(this.agrupeMeeting.id!),
      nzCancelText: 'Cancelar',
    });
  }

  private setConfigs(): void {
    const title = this.isManagement ? 'Gerenciar relatório' : 'Cadastrar relatório';

    const breadcrumb = this.isManagement
      ? [{ route: `/agrupe-meetings/${this.agrupeMeeting.id}/manage`, title: 'Gerenciar' }]
      : [{ route: '/agrupe-meetings/add', title: 'Cadastrar' }];

    this.configService.setPageTitle(title);
    this.configService.setBreadcrumb([AGRUPE_MEETINGS_BREADCRUMB, ...breadcrumb]);
  }
}
