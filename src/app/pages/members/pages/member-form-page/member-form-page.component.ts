import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DATE_MASK,
  FeedbackEnum,
  IMember,
  IMemberRequestParams,
  IAddressViaCep,
  GenderEnum,
  MaritalStatusEnum,
  MemberTypeEnum,
  ExternalService,
  STATES,
  ENTRY_CATEGORIES,
  MARITAL_STATUSES,
  GENDERS,
  PHONE_MASK,
  getConvertedDate,
  formatDateToForm,
} from '@app/shared';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-member-form-page',
  templateUrl: './member-form-page.component.html',
  styleUrls: ['./member-form-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MemberFormPageComponent implements OnInit {
  @Input() member!: IMember;
  @Input() isManageable!: boolean;
  @Input() isManagement!: boolean;
  @Input() isSubmitting!: boolean;
  @Output() submit = new EventEmitter<{ params: IMemberRequestParams; photo?: File }>();
  @Output() archiveMember = new EventEmitter();

  current: number = 0;

  phoneMask: string = PHONE_MASK;
  dateMask: string = DATE_MASK;

  states = STATES;
  entryCategories = ENTRY_CATEGORIES;
  maritalStatuses = MARITAL_STATUSES;
  genders = GENDERS;

  formInfo: FormGroup;
  formAdditionalInfo: FormGroup;
  formAddress: FormGroup;

  avatarUrl!: string;
  selectedImage: File | null = null;

  constructor(
    private notificationService: NzNotificationService,
    private externalService: ExternalService,
  ) {
    this.formInfo = new FormGroup({
      name: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      maritalStatus: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
    });

    this.formAdditionalInfo = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      memberType: new FormControl('', [Validators.required]),
      entryDate: new FormControl(''),
      entryCategory: new FormControl('', [Validators.required]),
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
    if (this.member) {
      this.formInfo.patchValue({
        name: this.member.name,
        gender: this.member.gender,
        maritalStatus: this.member.maritalStatus,
        birthDate: formatDateToForm(this.member.birthDate),
      });

      this.formAdditionalInfo.patchValue({
        email: this.member.email,
        phone: this.member.phone,
        memberType: this.member.memberType,
        entryDate: this.member.entryDate ? formatDateToForm(this.member.entryDate) : null,
        entryCategory: this.member.entryCategory,
      });

      if (this.member.address) this.formAddress.patchValue(this.member.address);
      if (this.member.photoUrl) this.avatarUrl = this.member.photoUrl;
    }
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.current += 1;
  }

  onSubmit(): void {
    const params: IMemberRequestParams = {
      name: this.name.value,
      gender: this.gender.value as GenderEnum,
      maritalStatus: this.maritalStatus.value as MaritalStatusEnum,
      birthDate: getConvertedDate(this.birthDate.value),
      memberType: this.memberType.value as MemberTypeEnum,
      email: this.email.value,
      phone: this.phone.value,
      entryCategory: this.entryCategory.value,
      entryDate: this.entryDate.value ? getConvertedDate(this.entryDate.value) : '',
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

  onArchive(): void {
    this.archiveMember.emit(!this.member.isArchived);
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
      state: address.uf,
    });
  }

  get name(): AbstractControl {
    return this.formInfo.get('name')!;
  }

  get memberType(): AbstractControl {
    return this.formAdditionalInfo.get('memberType')!;
  }

  get gender(): AbstractControl {
    return this.formInfo.get('gender')!;
  }

  get maritalStatus(): AbstractControl {
    return this.formInfo.get('maritalStatus')!;
  }

  get birthDate(): AbstractControl {
    return this.formInfo.get('birthDate')!;
  }

  get email(): AbstractControl {
    return this.formAdditionalInfo.get('email')!;
  }

  get phone(): AbstractControl {
    return this.formAdditionalInfo.get('phone')!;
  }

  get entryCategory(): AbstractControl {
    return this.formAdditionalInfo.get('entryCategory')!;
  }

  get entryDate(): AbstractControl {
    return this.formAdditionalInfo.get('entryDate')!;
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
