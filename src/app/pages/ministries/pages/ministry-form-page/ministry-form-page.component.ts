import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DATE_MASK, FeedbackEnum, IMinistry, IMinistryRequestParams } from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-ministry-form-page',
  templateUrl: './ministry-form-page.component.html',
  styleUrls: ['./ministry-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MinistryFormPageComponent implements OnInit {
  @Input() ministry!: IMinistry;
  @Input() isManageable!: boolean;
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Output() submit = new EventEmitter<{ params: IMinistryRequestParams; photo?: File }>();
  @Output() archiveMinistry = new EventEmitter();

  current = 0;
  dateMask = DATE_MASK;
  formInfo: FormGroup;

  avatarUrl!: string;
  selectedImage: File | null = null;

  constructor(private notificationService: NzNotificationService) {
    this.formInfo = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      foundation: new FormControl(''),
    });
  }

  ngOnInit(): void {
    if (this.ministry) this.formInfo.patchValue(this.ministry);
    if (this.ministry?.photoUrl) this.avatarUrl = this.ministry.photoUrl;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  onSubmit(): void {
    const params: IMinistryRequestParams = {
      name: this.name.value,
      description: this.description.value,
      foundation: this.foundation.value,
    };

    this.selectedImage
      ? this.submit.emit({ params, photo: this.selectedImage })
      : this.submit.emit({ params });
  }

  onArchive(): void {
    this.archiveMinistry.emit(!this.ministry.isArchived);
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

  get name(): AbstractControl {
    return this.formInfo.get('name')!;
  }

  get description(): AbstractControl {
    return this.formInfo.get('description')!;
  }

  get foundation(): AbstractControl {
    return this.formInfo.get('foundation')!;
  }
}
