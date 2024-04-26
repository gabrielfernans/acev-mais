import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AGRUPE_CATEGORIES,
  DATE_MASK,
  ExternalService,
  FeedbackEnum,
  IAddressViaCep,
  IAgrupe,
  IAgrupeRequestParams,
  STATES,
  StateLabelEnum,
  WEEKDAYS,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-agrupe-form-page',
  templateUrl: './agrupe-form-page.component.html',
  styleUrls: ['./agrupe-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgrupeFormPageComponent implements OnInit {
  @Input() agrupe!: IAgrupe;
  @Input() isManageable!: boolean;
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Output() submit = new EventEmitter<{ params: IAgrupeRequestParams; photo?: File }>();
  @Output() archiveAgrupe = new EventEmitter();

  current = 0;

  dateMask = DATE_MASK;
  states = STATES;
  categories = AGRUPE_CATEGORIES;
  weekdays = WEEKDAYS;

  formInfo: FormGroup;
  formAddress: FormGroup;

  avatarUrl!: string;
  selectedImage: File | null = null;

  constructor(
    private externalService: ExternalService,
    private notificationService: NzNotificationService,
  ) {
    this.formInfo = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      dayOfMeeting: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    this.formAddress = new FormGroup({
      street: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      complement: new FormControl(''),
      neighborhood: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      postalCode: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.agrupe) this.formInfo.patchValue(this.agrupe);
    if (this.agrupe.address) this.formAddress.patchValue(this.agrupe.address!);
    if (this.agrupe.photoUrl) this.avatarUrl = this.agrupe.photoUrl;
  }

  onPostalCodeBlur(): void {
    const postalCode = this.formAddress.get('postalCode')?.value;

    if (postalCode) {
      this.externalService.getViaCepAddress(postalCode).subscribe(
        (address) => {
          this.fillFormWithAddressData(address);
        },
        (error) => {
          console.error('Error fetching address from ViaCep:', error);
        },
      );
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  onSubmit(): void {
    const params: IAgrupeRequestParams = {
      name: this.name.value,
      category: this.category.value,
      dayOfMeeting: this.dayOfMeeting.value,
      description: this.description.value,
      address: {
        street: this.street.value,
        number: this.number.value,
        complement: this.complement.value,
        neighborhood: this.neighborhood.value,
        city: this.city.value,
        state: this.state.value,
        postalCode: this.postalCode.value,
      },
    };

    this.selectedImage
      ? this.submit.emit({ params, photo: this.selectedImage })
      : this.submit.emit({ params });
  }

  onArchive(): void {
    this.archiveAgrupe.emit(!this.agrupe.isArchived);
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

  private fillFormWithAddressData(address: IAddressViaCep): void {
    this.formAddress.patchValue({
      street: address.logradouro,
      neighborhood: address.bairro,
      city: address.localidade,
      state: StateLabelEnum[address.uf],
    });
  }

  get name(): AbstractControl {
    return this.formInfo.get('name')!;
  }

  get category(): AbstractControl {
    return this.formInfo.get('category')!;
  }

  get dayOfMeeting(): AbstractControl {
    return this.formInfo.get('dayOfMeeting')!;
  }

  get description(): AbstractControl {
    return this.formInfo.get('description')!;
  }

  get street(): AbstractControl {
    return this.formAddress.get('street')!;
  }

  get number(): AbstractControl {
    return this.formAddress.get('number')!;
  }

  get complement(): AbstractControl {
    return this.formAddress.get('complement')!;
  }

  get neighborhood(): AbstractControl {
    return this.formAddress.get('neighborhood')!;
  }

  get city(): AbstractControl {
    return this.formAddress.get('city')!;
  }

  get state(): AbstractControl {
    return this.formAddress.get('state')!;
  }

  get postalCode(): AbstractControl {
    return this.formAddress.get('postalCode')!;
  }
}
