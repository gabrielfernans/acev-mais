import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ILesson, ISeries, ListingType, PHONE_MASK } from '@app/shared';

interface ISerieCard {
  color: string;
  backgroundColor: string;
  title: string;
  value: string | number;
  icon: string;
}

interface ISerieMenu {
  title: string;
  value: SerieMenuItem;
  icon: string;
}

type SerieMenuItem = 'lessons';

interface IColumnItem {
  name: string;
  key: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-serie-page',
  templateUrl: './serie-page.component.html',
  styleUrls: ['./serie-page.component.scss'],
})
export class SeriePageComponent implements OnInit {
  @Input() serie!: ISeries;
  @Input() isManageable!: boolean;
  @Output() onDeleteLesson = new EventEmitter<ILesson>();

  menus!: ISerieMenu[];
  phoneMask = PHONE_MASK;

  serieCards!: ISerieCard[];

  activeMenu: SerieMenuItem = 'lessons';

  tableColumns: IColumnItem[] = [];
  tableListingType: ListingType = 'list';

  constructor(private router: Router) {
    this.menus = [
      {
        title: 'Estudos',
        value: 'lessons',
        icon: 'book',
      },
    ];
  }

  ngOnInit(): void {
    this.setColumns();
    this.setSerieCards();
  }

  onChangeMenu(menuItem: SerieMenuItem): void {
    this.activeMenu = menuItem;
  }

  manageSerie(): void {
    this.router.navigate([`series/${this.serie.id}/manage`]);
  }

  addLesson(): void {
    this.router.navigate([`series/${this.serie.id}/lessons/add`]);
  }

  viewLesson(lesson: ILesson): void {
    const { pdfUrl } = lesson;
    window.open(pdfUrl, '_blank');
  }

  deleteLesson(lesson: ILesson): void {
    this.onDeleteLesson.emit(lesson);
  }

  private setSerieCards(): void {
    this.serieCards = [
      {
        title: 'Estudos',
        value: this.serie.lessons.length,
        icon: 'book',
        color: '#00a4c6',
        backgroundColor: '#d5e6f8',
      },
    ];
  }

  private setColumns(): void {
    this.tableColumns = [
      { name: 'Nome', key: 'name' },
      { name: 'Revisão', key: 'revision', align: 'center' },
    ];

    if (this.isManageable) {
      this.tableColumns.push({ name: 'Ações', key: 'actions', align: 'center' });
    }
  }
}
