import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { environment } from 'src/environments/environment';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US, ru_RU } from 'ng-zorro-antd/i18n';
import {SharedModule} from './core/shared/shared.module';
import {LoaderInterceptor} from './core/interceptors/loader.interceptor';
import ru from '@angular/common/locales/ru';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [

   {
     provide: 'BASE_URL',
     useValue: environment.API_URL,
     multi: true
   },
   {
     provide: HTTP_INTERCEPTORS,
     useClass: ApiInterceptor,
     multi: true
   },
   {
     provide: HTTP_INTERCEPTORS,
     useClass: LoaderInterceptor,
     multi: true
   },
   { provide: NZ_I18N, useValue: en_US },
  ]
    ,
  bootstrap: [AppComponent]
})
export class AppModule { }
