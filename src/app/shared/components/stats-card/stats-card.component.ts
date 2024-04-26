import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-custom-stats-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzIconModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss'],
})
export class StatsCardComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() color!: string;
  @Input() backgroundColor!: string;
  @Input() isLoading!: boolean;
}
