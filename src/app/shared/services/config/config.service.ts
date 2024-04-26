import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

export interface IBreadcrumbItem {
  route: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private breadcrumbSubject = new BehaviorSubject<IBreadcrumbItem[]>([]);
  private pageTitleSubject = new BehaviorSubject<string>('');
  private imageSubject = new Subject<string>();

  breadcrumb$ = this.breadcrumbSubject.asObservable();
  pageTitle$ = this.pageTitleSubject.asObservable();
  image$ = this.imageSubject.asObservable();

  setBreadcrumb(items: IBreadcrumbItem[]): void {
    this.breadcrumbSubject.next(items);
  }

  setPageTitle(title: string): void {
    this.pageTitleSubject.next(title);
  }

  uploadImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      this.imageSubject.next(imageUrl);
    };

    reader.readAsDataURL(file);
  }
}
