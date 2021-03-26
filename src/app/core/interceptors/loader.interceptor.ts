import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {LoaderService} from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private urlsToNotUse: Array<string>;
  private count = 0;

  constructor(private loaderService: LoaderService) {
      this.urlsToNotUse = [
      'services/search-service/.+',
      'products/search-product/.+',
      'chat/.+'
    ];
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isValidRequestForInterceptor(req.url)) {
      if (this.count === 0) {
        this.loaderService.setHttpProgressStatus(true);
      }
      this.count++;
      return next.handle(req).pipe(
        finalize(() => {
          this.count--;
          if (this.count === 0) {
            this.loaderService.setHttpProgressStatus(false);
          }
        }));
    }
    return next.handle(req);
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    const positionIndicator = 'ge/';
    const position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      const destination = requestUrl.substr(position + positionIndicator.length);
      for (const address of this.urlsToNotUse) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
}
