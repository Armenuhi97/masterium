import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MetricsService } from 'src/app/core/api-services/metrics.service';
import { Metrics } from 'src/app/core/models/metrics';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public metrics: Metrics;
  public isCollapsed: boolean = true;

  constructor(
    private _metricsService: MetricsService
  ) { }

  ngOnInit(): void {
    this._getMetrics();
  }

  private _getMetrics(): void {
    timer(0, 10000)
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap(() => this._metricsService.getMetrics())
      )
      .subscribe(res => {
        this.metrics = res;
      });
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
