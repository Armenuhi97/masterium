import {AfterViewInit, Component, Renderer2} from '@angular/core';
import {LoaderService} from './core/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  isCollapsed = false;
  loading = false;
  constructor(private loaderService: LoaderService, private renderer: Renderer2) { }

  // tslint:disable-next-line:typedef
  ngAfterViewInit() {
    this.loaderService.httpProgress().subscribe((status: boolean) => {
      if (status) {
        this.renderer.addClass(document.body, 'cursor-loader');
        this.loading = true;
      } else {
        this.renderer.removeClass(document.body, 'cursor-loader');
        this.loading = false;
      }
    });
  }
}
