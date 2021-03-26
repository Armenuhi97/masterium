import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { FinancesService } from 'src/app/core/api-services/finances.service';
import { zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FinancesDebetList } from 'src/app/core/models/finances';
@Component({
  selector: 'app-debit-dept',
  templateUrl: './debit-dept.component.html',
  styleUrls: ['./debit-dept.component.css']
})
export class DebitDeptComponent implements OnInit, OnDestroy {
  private _unsubscribe$: Subject<void> = new Subject<void>();
  private _getClientsDebet: FinancesDebetList[];
  private _getExecutorsDebet: FinancesDebetList[];
  public showingDebets: FinancesDebetList[];
  public type = 'executor';
  constructor(
    private _financesService: FinancesService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this._financesService.getClientsDebet(),
      this._financesService.getExecutorsDebet()
    ])
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((data) => {
        this._getClientsDebet = data[0];
        this._getExecutorsDebet = data[1];
        this.showingDebets = this._getExecutorsDebet;
      });
  }

  public changeType(type: 'executor' | 'client'): void {
    if (type === 'executor') {
      this.showingDebets = this._getExecutorsDebet;
    } else {
      this.showingDebets = this._getClientsDebet;
    }
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

}
