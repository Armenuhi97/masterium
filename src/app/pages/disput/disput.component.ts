import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DisputService } from './disput.service';
import { Messages } from '../../core/models/messages';
import { FormControl, FormGroup } from '@angular/forms';
import { Disput, DisputList, DisputStatus } from 'src/app/core/models/disput.model';

@Component({
    selector: 'app-disput',
    templateUrl: './disput.component.html',
    styleUrls: ['./disput.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
})
export class DisputComponent implements OnInit, OnDestroy {
    private _unsubscribe$ = new Subject();
    public pageSize = 10;
    public total: number;
    public disputs: DisputList[] = [];
    public pageIndex = 1;
    public editingPromotionIndex: number;
    public validateForm: FormGroup;
    public disputStatuses: DisputStatus[] = [];
    public statusFilterControl: FormControl = new FormControl('');
    constructor(
        private _disputService: DisputService,
    ) { }

    ngOnInit(): void {
        forkJoin([
            this._disputService.getDisputStatuses(),
            this._disputService.getAllDisputs(0, this.statusFilterControl.value),
        ])
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((res) => {
                this.disputStatuses = res[0];
                this.total = res[1].count;
                this.disputs = res[1].results;
            });
        this.handleDisputStatusChange();
    }

    public getAllDisputs(): void {
        const offset = (this.pageIndex - 1) * this.pageSize;
        this._disputService.getAllDisputs(offset, this.statusFilterControl.value)
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(res => {
                this.total = res.count;
                this.disputs = res.results;
            });
    }

    public handleDisputStatusChange(): void {
        this.statusFilterControl.valueChanges
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe(() => {
                this.getAllDisputs();
            });
    }

    public nzPageIndexChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.getAllDisputs();
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }
}
