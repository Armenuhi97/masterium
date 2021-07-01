import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Disput } from 'src/app/core/models/disput.model';
import { DisputService } from '../disput.service';

@Component({
  selector: 'app-disput-detail',
  templateUrl: './disput-detail.component.html',
  styleUrls: ['./disput-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DisputDetailComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject();
  private _id: number;
  isVisible = false;
  public loading = false;
  public disput: Disput;
  public effect = 'scrollx';
  commentControl = new FormControl(null, Validators.required)
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _disputService: DisputService,
    private _router: Router
  ) {
    this._id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this._getDisputById(this._id);
  }

  ngOnInit(): void { }

  private _getDisputById(id: number): void {
    this._disputService.getDisputById(id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(disput => {
        this.disput = disput;
      });
  }
  closeModal() {
    this.isVisible = false;
  }
  openModal() {
    this.isVisible = true;

  }
  saveComment() {
    if (this.commentControl.valid) {
      this.closeDisput()
    }
  }
  public closeDisput(): void {
    this._disputService
      .closeDisput(this.disput.id, this.commentControl.value)
      .pipe(
        takeUntil(this._unsubscribe$),
      )
      .subscribe(() => {
        this._router.navigate(['/dashboard/disput']);
      });
  }


  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
