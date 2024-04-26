import { Component, Input, OnInit } from '@angular/core';
import { IMinistry, IMemberMinimal, getRandomGradient } from '@app/shared';

@Component({
  selector: 'app-ministries-page',
  templateUrl: './ministries-page.component.html',
  styleUrls: ['./ministries-page.component.scss'],
})
export class MinistriesPageComponent implements OnInit {
  @Input() ministries!: IMinistry[];

  ministriesMetadata!: {
    backgroundColor: string;
    backgroundImage: string;
  }[];

  searchValue: string | null = null;

  ngOnInit(): void {
    this.setMetadata();
  }

  getAvatarText(member: IMemberMinimal, ministry: IMinistry): string {
    if (!member.photoUrl) {
      return member.name.charAt(0).toUpperCase();
    } else if (ministry.members.length > 3 && ministry.members.indexOf(member) === 2) {
      return `+${ministry.members.length - 3}`;
    } else {
      return '';
    }
  }

  private setMetadata(): void {
    this.ministriesMetadata = this.ministries.map(() => {
      const { backgroundColor, backgroundImage } = getRandomGradient();

      return {
        backgroundColor,
        backgroundImage,
      };
    });
  }
}
