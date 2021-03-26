import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FinancesService } from 'src/app/core/api-services/finances.service';
import { ExecutorFinancesDetails } from 'src/app/core/models/finances';
import { ExecutorFineRequest } from 'src/app/core/models/user';

@Component({
  selector: 'app-finances-executors-details',
  templateUrl: './finances-executors-details.component.html',
  styleUrls: ['./finances-executors-details.component.css']
})
export class FinancesExecutorsDetailsComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() executorDetails: ExecutorFinancesDetails;
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public fineForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _financesService: FinancesService,
  ) { }

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm(): void {
    this.fineForm = this._formBuilder.group({
      text: [null, Validators.required],
      point: [null, [Validators.required, Validators.min(1)]],
    });
  }

  public submitFine(): void {
    if (this.fineForm.invalid) {
      return;
    }
    const { point, text } = this.fineForm.value;
    const sendingData: ExecutorFineRequest = {
      point,
      text,
      user_id: this.id,
    };
    this._financesService
      .fineExecutor(sendingData)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        this.fineForm.reset();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
