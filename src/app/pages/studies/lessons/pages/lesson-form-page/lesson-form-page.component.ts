import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DATE_MASK, FeedbackEnum, ILesson, ILessonRequestParams } from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-lesson-form-page',
  templateUrl: './lesson-form-page.component.html',
  styleUrls: ['./lesson-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LessonFormPageComponent implements OnInit {
  @Input() lesson!: ILesson;
  @Input() idSerie!: string;
  @Input() isManageable!: boolean;
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Output() submit = new EventEmitter<{ params: ILessonRequestParams; file: File }>();
  @Output() deleteLesson = new EventEmitter();

  current = 0;
  dateMask = DATE_MASK;
  formInfo: FormGroup;

  fileUrl!: string;
  selectedFile: File | null = null;

  constructor(private notificationService: NzNotificationService) {
    this.formInfo = new FormGroup({
      title: new FormControl('', [Validators.required]),
      origin: new FormControl(''),
      adaptation: new FormControl(''),
      revision: new FormControl(''),
      greeting: new FormControl(''),
      musicSuggestions: new FormControl([]),
    });
  }

  ngOnInit(): void {
    if (this.lesson) this.formInfo.patchValue(this.lesson);
    if (this.lesson?.pdfUrl) this.fileUrl = this.lesson.pdfUrl;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  onSubmit(): void {
    const params: ILessonRequestParams = {
      idSeries: this.idSerie,
      title: this.title.value,
      origin: this.origin.value,
      adaptation: this.adaptation.value,
      revision: this.revision.value,
      greeting: '',
      musicSuggestions: this.musicSuggestions.value,
    };

    this.submit.emit({ params, file: this.selectedFile! });
  }

  onDelete(): void {
    this.deleteLesson.emit();
  }

  onDrop(files: NgxFileDropEntry[]): void {
    const acceptedFormats = ['application/pdf'];

    if (files.length === 1 && files[0].fileEntry.isFile) {
      const fileEntry = files[0].fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) => {
        if (acceptedFormats.includes(file.type) && file.size <= 4 * 1024 * 1024) {
          this.selectedFile = file;

          const reader = new FileReader();
          reader.onload = (event: any) => (this.fileUrl = event.target.result);
          reader.readAsDataURL(file);

          return;
        }
        this.notificationService.error(
          FeedbackEnum.WARNING,
          'Por favor, selecione um PDF válido e com tamanho máximo de 4MB.',
        );
      });

      return;
    }
    this.notificationService.error(FeedbackEnum.WARNING, 'Por favor, selecione exatamente um PDF.');
  }

  get title(): AbstractControl {
    return this.formInfo.get('title')!;
  }

  get origin(): AbstractControl {
    return this.formInfo.get('origin')!;
  }
  get adaptation(): AbstractControl {
    return this.formInfo.get('adaptation')!;
  }
  get revision(): AbstractControl {
    return this.formInfo.get('revision')!;
  }
  get greeting(): AbstractControl {
    return this.formInfo.get('greeting')!;
  }
  get musicSuggestions(): AbstractControl {
    return this.formInfo.get('musicSuggestions')!;
  }
}
