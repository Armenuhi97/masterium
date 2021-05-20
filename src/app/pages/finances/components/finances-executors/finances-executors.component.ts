import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FinancesService } from 'src/app/core/api-services/finances.service';
import { ExecutorFinancesDetails } from 'src/app/core/models/finances';
import { ExecutorSumResponse } from 'src/app/core/models/user';

@Component({
  selector: 'app-finances-executors',
  templateUrl: './finances-executors.component.html',
  styleUrls: ['./finances-executors.component.css'],
  providers: [DatePipe]
})
export class FinancesExecutorsComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public range: Date[];
  public executorStatistics$: Observable<ExecutorSumResponse[]>;
  public executorDetails: ExecutorFinancesDetails;
  public activeExecutorStatistics: ExecutorSumResponse;
  public pageSize: number = 10;
  public totalCount: number;
  public pageIndex: number = 1;
  public isExecutorDetailVisible: boolean = false;
  constructor(
    private _financesService: FinancesService,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void { }

  private _getExecutorStatistics(range: Date[]): void {
    this.executorStatistics$ = this._financesService.getExecutorsStatistic(this.pageIndex, [
      this._datePipe.transform(range[0], 'yyyy-MM-dd'),
      this._datePipe.transform(range[1], 'yyyy-MM-dd')
    ]).pipe(map(response => {
      this.totalCount = response.count;
      return response.results;
    }));
  }

  private _transformDate(date, format: string): string {
    return this._datePipe.transform(date, 'yyyy-MM-dd');
  }

  private _getExecutorsDetails(id: number): void {
    this._financesService.getExecutorDetails(id, [
      this._datePipe.transform(this.range[0], 'yyyy-MM-dd'),
      this._datePipe.transform(this.range[1], 'yyyy-MM-dd')
    ])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(res => {
        this.executorDetails = res;
        this.isExecutorDetailVisible = true;
      });
  }

  public onRangeChange(result: Date[]): void {
    this._getExecutorStatistics(result);
  }

  public pageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this._getExecutorStatistics(this.range);
  }

  public openExecutorsDetails(executor: ExecutorSumResponse): void {
    this.activeExecutorStatistics = executor;
    this._getExecutorsDetails(executor.executor_details.user);
  }


  public closeDetailsView(): void {
    this.isExecutorDetailVisible = false;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
