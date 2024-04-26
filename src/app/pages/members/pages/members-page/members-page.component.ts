import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IMember,
  IMemberFilterParams,
  IMemberPaginationParams,
  ListingType,
  Sort,
} from '@app/shared';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./members-page.component.scss'],
})
export class MembersPageComponent implements OnInit {
  @Input() isManageable!: boolean;
  @Input() isLoading!: boolean;
  @Input() members!: IMember[];
  @Input() pageTotal!: number;
  @Input() pageIndex!: number;
  @Output() memberSearch = new EventEmitter<{
    pagination: IMemberPaginationParams;
    filters: IMemberFilterParams;
  }>();

  tableColumns = [];

  pageSize: number = 10;
  tableSort: Sort = 'ASC';
  searchValue: string = '';
  showFilterModal = false;

  filterForm: FormGroup;
  filters: IMemberFilterParams = { query: '' };

  constructor(private router: Router) {
    this.filterForm = new FormGroup({
      memberType: new FormControl(null),
      entryCategory: new FormControl(null),
      gender: new FormControl(null),
      maritalStatus: new FormControl(null),
      archived: new FormControl(false),
    });
  }

  ngOnInit(): void {}

  addMember(): void {
    this.router.navigate(['/members/add']);
  }

  onSearchMembers(): void {
    const pagination: IMemberPaginationParams = {
      size: this.pageSize,
      page: this.pageIndex - 1,
      direction: this.tableSort,
    };

    const filters: IMemberFilterParams = {
      query: this.searchValue,
      ...this.getFilters(),
    };

    this.memberSearch.emit({ pagination, filters });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort } = params;

    const pagination: IMemberPaginationParams = {
      size: pageSize,
      page: pageIndex - 1,
      direction: sort[0].value === 'descend' ? 'DESC' : 'ASC',
    };

    const filters: IMemberFilterParams = {
      query: this.searchValue,
      ...this.getFilters(),
    };

    this.memberSearch.emit({ pagination, filters });
  }

  onSetFilter(): void {
    this.showFilterModal = false;
    this.onSearchMembers();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterForm.get('archived')?.setValue(false);
  }

  private getFilters(): { [key: string]: any } {
    const filters: { [key: string]: any } = {};

    Object.keys(this.filterForm.controls).forEach((key) => {
      const control = this.filterForm.get(key);
      if (control?.value !== null) {
        filters[key] = control!.value;
      }
    });

    return filters;
  }

  get memberType(): AbstractControl {
    return this.filterForm.get('memberType')!;
  }
}
