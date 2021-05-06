import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
  ExecutorDeal,
  ExecutorFineRequest,
  ExecutorSalaryRequest,
  ExecutorSumResponse,
  RewardByPeriodRequest,
} from 'src/app/core/models/user';
import { ExecutorsService } from '../executors.service';

@Component({
  selector: 'app-executor-reward-history',
  templateUrl: './executor-reward-history.component.html',
  styleUrls: ['./executor-reward-history.component.css'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})

export class ExecutorRewardHistoryComponent implements OnInit, OnDestroy {
  @Input() userId: number;
  private unsubscribe = new Subject<void>();
  public rewardPeriodForm: FormGroup;
  public salaryForm: FormGroup;
  public cashSalaryForm: FormGroup;
  public fineForm: FormGroup;
  public executorReward: ExecutorSumResponse;
  public executorDeals: ExecutorDeal[];
  constructor(
    private fb: FormBuilder,
    private executorService: ExecutorsService,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    this.rewardPeriodForm = this.fb.group({
      range: '',
    });
    this.salaryForm = this.fb.group({
      comment: [null, Validators.required],
      count: [null, [Validators.required, Validators.min(1)]],
    });
    this.cashSalaryForm = this.fb.group({
      comment: [null, Validators.required],
      count: [null, [Validators.required, Validators.min(1)]],
    });
    this.fineForm = this.fb.group({
      comment: [null, Validators.required],
      count: [null, [Validators.required, Validators.min(1)]],
    });

    this.rewardPeriodForm.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap((value) => {
          return this.getRewardByPeriod()
        })
      )
      .subscribe((data) => {
        this.executorReward = data;
        this.executorDeals = [
          ...this.executorReward.penalty,
          ...this.executorReward.salary,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.rewardPeriodForm
      .get('range')
      .setValue(firstDayOfMonth);
  }
  private _calculateLastDayInMonth(month: number, year: number): Date {
    return new Date(year, month + 1, 0);
  }
  private _calculateFirstDayInMonth(month: number, year: number): Date {
    return new Date(year, month, 1);
  }
  public getRewardByPeriod(): Observable<any> {
    const formValue = this.rewardPeriodForm.value;
    if (!formValue.range) {
      return;
    }
    const sendingData: RewardByPeriodRequest = {
      userId: this.userId,
      startDate: this.transformDate(this._calculateFirstDayInMonth(formValue.range.getMonth(), formValue.range.getFullYear()), 'yyyy-MM-dd'),
      endDate: this.transformDate(this._calculateLastDayInMonth(formValue.range.getMonth(), formValue.range.getFullYear()), 'yyyy-MM-dd'),
    };
    return this.executorService.getRewardByPeriod(sendingData);
  }

  public submitSalary(): void {
    if (this.salaryForm.invalid) {
      return;
    }
    const formValue = this.salaryForm.value;

    const sendingData: ExecutorSalaryRequest = {
      point: formValue.count,
      comment: formValue.comment,
      user_id: this.userId,
    };
    this.executorService
      .giveUserSalarys(sendingData)
      .pipe(takeUntil(this.unsubscribe)
      ).subscribe(() => {
        this.setCurrentMonth()
      });
  }

  public submitFine(): void {
    if (this.fineForm.invalid) {
      return;
    }
    const formValue = this.fineForm.value;
    if (!formValue.count) {
      return;
    }
    const sendingData: ExecutorFineRequest = {
      point: formValue.count,
      text: formValue.comment,
      user_id: this.userId,
      suborder_id: null
    };
    this.executorService
      .fineUser(sendingData)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.setCurrentMonth()
      });
  }
  setCurrentMonth() {
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.rewardPeriodForm
      .get('range')
      .setValue(firstDayOfMonth);
  }
  private transformDate(date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
