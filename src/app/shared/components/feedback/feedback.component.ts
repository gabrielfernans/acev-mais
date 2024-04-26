import { NzResultModule } from 'ng-zorro-antd/result';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FeedbackStatusEnum } from '@app/shared/enums';

@Component({
  selector: 'app-custom-feedback',
  standalone: true,
  imports: [CommonModule, NzResultModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  @Input() title!: string;
  @Input() subTitle?: string;
  @Input() type!: FeedbackStatusEnum;
}
