import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  public loading$ = new BehaviorSubject<boolean>(false);

  show(): void {
    if (this.activeRequests === 0) {
      this.loading$.next(true);
    }
    this.activeRequests++;
  }

  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loading$.next(false);
    }
  }
}