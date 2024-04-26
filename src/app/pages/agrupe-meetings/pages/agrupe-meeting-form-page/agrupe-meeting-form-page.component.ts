import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DATE_MASK,
  FeedbackEnum,
  formatDateToForm,
  getConvertedDate,
  IAgrupe,
  IAgrupeMeeting,
  IAgrupeMeetingRequestParams,
  IMember,
  IMemberMinimal,
  ISeries,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-agrupe-meeting-form-page',
  templateUrl: './agrupe-meeting-form-page.component.html',
  styleUrls: ['./agrupe-meeting-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgrupeMeetingFormPageComponent implements OnInit {
  @Input() agrupeMeeting!: IAgrupeMeeting;
  @Input() agrupes!: IAgrupe[];
  @Input() series!: ISeries[];
  @Input() foundMembers!: IMember[];
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Input() isLoadingMember!: boolean;
  @Output() memberSearch = new EventEmitter<string>();
  @Output() submit = new EventEmitter<{ params: IAgrupeMeetingRequestParams; photo?: File }>();
  @Output() deleteAgrupeMeeting = new EventEmitter();

  current = 0;

  dateMask = DATE_MASK;
  formInfo: FormGroup;

  avatarUrl!: string;
  selectedImage: File | null = null;

  participants: (IMember | IMemberMinimal)[] = [];
  guests: string[] = [];
  guestName: string = '';

  constructor(private notificationService: NzNotificationService) {
    this.formInfo = new FormGroup({
      idAgrupe: new FormControl('', [Validators.required]),
      selectedSeries: new FormControl(null, [Validators.required]),
      idLesson: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      customLesson: new FormControl(false, [Validators.required]),
      customLessonTitle: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (this.agrupeMeeting) {
      this.formInfo.patchValue({
        idAgrupe: this.agrupeMeeting.agrupe.id,
        selectedSeries: this.agrupeMeeting.lesson?.idSeries,
        idLesson: this.agrupeMeeting.lesson?.id,
        date: formatDateToForm(this.agrupeMeeting.date),
        customLesson: this.agrupeMeeting.customLesson,
        customLessonTitle: this.agrupeMeeting.customLessonTitle,
      });

      this.participants = this.agrupeMeeting.participants;
      this.guests = this.agrupeMeeting.guests;
    }
    if (this.agrupeMeeting?.photoUrl) this.avatarUrl = this.agrupeMeeting.photoUrl;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  addGuest(): void {
    const guestName = this.guestName.trim();

    if (guestName && guestName !== '') {
      this.guests.push(guestName);
      this.guestName = '';
    }
  }

  removeGuest(index: number): void {
    this.guests.splice(index, 1);
  }

  onSubmit(): void {
    const params: IAgrupeMeetingRequestParams = {
      idAgrupe: this.idAgrupe.value,
      idLesson: this.customLesson.value ? null : this.idLesson.value,
      date: getConvertedDate(this.date.value),
      customLesson: this.customLesson.value,
      customLessonTitle: this.customLesson.value ? this.customLessonTitle.value : null,
      guests: this.guests,
      idParticipants: this.participants.map((item: IMember | IMemberMinimal) => item.id),
    };

    this.selectedImage
      ? this.submit.emit({ params, photo: this.selectedImage })
      : this.submit.emit({ params });
  }

  onDelete(): void {
    this.deleteAgrupeMeeting.emit();
  }

  onDrop(files: NgxFileDropEntry[]): void {
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (files.length === 1 && files[0].fileEntry.isFile) {
      const fileEntry = files[0].fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) => {
        if (acceptedImageTypes.includes(file.type) && file.size <= 2 * 1024 * 1024) {
          this.selectedImage = file;

          const reader = new FileReader();
          reader.onload = (event: any) => (this.avatarUrl = event.target.result);
          reader.readAsDataURL(file);

          return;
        }
        this.notificationService.error(
          FeedbackEnum.WARNING,
          'Por favor, selecione uma imagem válida (JPEG, PNG ou GIF) e com tamanho máximo de 2MB.',
        );
      });

      return;
    }
    this.notificationService.error(
      FeedbackEnum.WARNING,
      'Por favor, selecione exatamente uma imagem.',
    );
  }

  onSearchMembers(query: string): void {
    if (!query || query === '') return;
    this.memberSearch.emit(query);
  }

  removeMember(member: IMember | IMemberMinimal): void {
    const index = this.participants.findIndex(
      (participant: IMember | IMemberMinimal) => participant.id === member.id,
    );
    if (index !== -1) {
      this.participants.splice(index, 1);
    }
  }

  // Método para verificar se um membro já foi adicionado à lista de participantes
  isMemberAlreadyAdded(memberId: string): boolean {
    return this.participants.some((member: IMember | IMemberMinimal) => member.id === memberId);
  }

  isDisabled(): boolean {
    if (this.current === 0) {
      return this.customLesson.value
        ? this.idAgrupe.invalid || this.date.invalid || !this.customLessonTitle.value
        : this.formInfo.invalid;
    } else if (this.current === 1) {
      return this.participants.length === 0;
    }
    return false;
  }

  get idLesson(): AbstractControl {
    return this.formInfo.get('idLesson')!;
  }

  get selectedSeries(): AbstractControl {
    return this.formInfo.get('selectedSeries')!;
  }

  get idAgrupe(): AbstractControl {
    return this.formInfo.get('idAgrupe')!;
  }

  get date(): AbstractControl {
    return this.formInfo.get('date')!;
  }

  get customLesson(): AbstractControl {
    return this.formInfo.get('customLesson')!;
  }

  get customLessonTitle(): AbstractControl {
    return this.formInfo.get('customLessonTitle')!;
  }
}
