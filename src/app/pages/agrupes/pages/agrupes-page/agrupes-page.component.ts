import { Component, Input, OnInit } from '@angular/core';
import {
  AgrupeCategoryEnum,
  AgrupeCategoryLabelEnum,
  IAgrupe,
  IMemberMinimal,
  getRandomGradient,
} from '@app/shared';

@Component({
  selector: 'app-agrupes-page',
  templateUrl: './agrupes-page.component.html',
  styleUrls: ['./agrupes-page.component.scss'],
})
export class AgrupesPageComponent implements OnInit {
  @Input() agrupes!: IAgrupe[];

  agrupesMetadata!: {
    backgroundColor: string;
    backgroundImage: string;
    tagName: AgrupeCategoryLabelEnum;
  }[];

  searchValue: string | null = null;

  ngOnInit(): void {
    this.setMetadata();
  }

  getAgrupeTagName(category: AgrupeCategoryEnum): AgrupeCategoryLabelEnum {
    return AgrupeCategoryLabelEnum[category];
  }

  getAvatarText(frequenter: IMemberMinimal, agrupe: IAgrupe): string {
    if (!frequenter.photoUrl) {
      return frequenter.name.charAt(0).toUpperCase();
    } else if (agrupe.frequenters.length > 3 && agrupe.frequenters.indexOf(frequenter) === 2) {
      return `+${agrupe.frequenters.length - 3}`;
    } else {
      return '';
    }
  }

  private setMetadata(): void {
    this.agrupesMetadata = this.agrupes.map((agrupe) => {
      const { backgroundColor, backgroundImage } = getRandomGradient();

      return {
        backgroundColor,
        backgroundImage,
        tagName: AgrupeCategoryLabelEnum[agrupe.category],
      };
    });
  }
}
