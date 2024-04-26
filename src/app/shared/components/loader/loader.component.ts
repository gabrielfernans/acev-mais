import { NzSpinModule } from 'ng-zorro-antd/spin';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-loader',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {}
