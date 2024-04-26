import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DATE_MASK, FeedbackEnum, ISeries, ISeriesRequestParams } from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-series-form-page',
  templateUrl: './series-form-page.component.html',
  styleUrls: ['./series-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SeriesFormPageComponent implements OnInit {
  @Input() series!: ISeries;
  @Input() isManageable!: boolean;
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Output() submit = new EventEmitter<{ params: ISeriesRequestParams; photo?: File }>();
  @Output() deleteSeries = new EventEmitter();

  current = 0;
  dateMask = DATE_MASK;
  formInfo: FormGroup;

  avatarUrl!: string;
  selectedImage: File | null = null;

  constructor(private notificationService: NzNotificationService) {
    this.formInfo = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl(''),
      period: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (this.series) this.formInfo.patchValue(this.series);
    if (this.series?.photoUrl) this.avatarUrl = this.series.photoUrl;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  onSubmit(): void {
    const params: ISeriesRequestParams = {
      title: this.title.value,
      author: this.author.value,
      period: this.period.value,
    };

    this.selectedImage
      ? this.submit.emit({ params, photo: this.selectedImage })
      : this.submit.emit({ params });
  }

  onDelete(): void {
    this.deleteSeries.emit();
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

  get title(): AbstractControl {
    return this.formInfo.get('title')!;
  }

  get author(): AbstractControl {
    return this.formInfo.get('author')!;
  }

  get period(): AbstractControl {
    return this.formInfo.get('period')!;
  }
}
