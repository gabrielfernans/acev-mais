import { Component, Input, OnInit } from '@angular/core';
import { ISeries, getRandomGradient } from '@app/shared';

@Component({
  selector: 'app-series-page',
  templateUrl: './series-page.component.html',
  styleUrls: ['./series-page.component.scss'],
})
export class SeriesPageComponent implements OnInit {
  @Input() series!: ISeries[];

  seriesMetadata!: {
    backgroundColor: string;
    backgroundImage: string;
  }[];

  searchValue: string | null = null;

  ngOnInit(): void {
    this.setMetadata();
  }

  private setMetadata(): void {
    this.seriesMetadata = this.series.map(() => {
      const { backgroundColor, backgroundImage } = getRandomGradient();

      return {
        backgroundColor,
        backgroundImage,
      };
    });
  }
}
