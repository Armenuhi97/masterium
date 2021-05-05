import { DatePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";
import { ClosedHoursResponce } from "src/app/core/models/closed-hours";
import { ServerResponce } from "src/app/core/models/server-responce";
import { ServicesService } from "../../services.service";

@Component({
    selector: 'app-subservice-closed-hours',
    templateUrl: 'subservice-closed-hours.component.html',
    styleUrls: ['subservice-closed-hours.component.scss'],
    providers: [DatePipe]
})
export class SubserviceClosedHoursComponent {
    validateForm: FormGroup;
    unsubscribe$ = new Subject();
    subOrderId: number
    suborderClosedHoursList = [];
    public total: number;
    pageIndex: number = 1;
    pageSize: number = 10;
    @Output() close = new EventEmitter<void>();
    // @Output() edit = new EventEmitter<void>();
    // @Output() delete = new EventEmitter<void>();
    @Input('id')
    set setId($event) {
        if ($event) {
            this.subOrderId = $event
            this.getClosedHoursList().pipe(takeUntil(this.unsubscribe$)).subscribe()
        }
    }
    constructor(private servicesService: ServicesService,
        private _datePipe: DatePipe,
        private _fb: FormBuilder) { }

    ngOnInit() {
        this.initForm()
    }

    getClosedHoursList() {
        return this.servicesService.getSubserviceClosedHours(this.subOrderId, this.pageIndex).pipe(map((data: ServerResponce<any>) => {
            this.suborderClosedHoursList = data.results;
            this.total = data.count;

            console.log(data);

        }))
    }
    closeModal() {
        this.validateForm.reset();
        this.close.emit()
    }
    addClosedHours() {
        if (this.validateForm.valid) {

            console.log(this.validateForm.value);
            let sendObject: ClosedHoursResponce = {
                subservice: this.subOrderId,
                start: this._datePipe.transform(this.validateForm.value.date[0], 'yyyy-MM-dd HH:mm'),
                end: this._datePipe.transform(this.validateForm.value.date[1], 'yyyy-MM-dd HH:mm')
            }
            this.servicesService.addClosedHours(sendObject).pipe(
                takeUntil(this.unsubscribe$),
                switchMap(() => {
                    this.validateForm.reset()
                    return this.getClosedHoursList()
                })
            ).subscribe()
        }
        // this._datePipe.transform(range[0], 'yyyy-MM-dd'),
        // this._datePipe.transform(range[1], 'yyyy-MM-dd')
    }
    deleteClosedHours(id: number, index: number) {
        this.servicesService.deleteClosedHours(id).pipe(
            takeUntil((this.unsubscribe$))
        ).subscribe(() => {
            this.suborderClosedHoursList.splice(index, 1)
        })
    }
    initForm() {
        this.validateForm = this._fb.group({
            date: [null, Validators.required]
        })
    }
    pageIndexChange($event) {
        this.pageIndex = $event;
        this.getClosedHoursList().pipe(takeUntil(this.unsubscribe$)).subscribe()
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    // @Input() title: string;
    // @Input() description: string;
    // @Input() specialistsCount: number;
    // @Input() workloadPercent: number;
    // @Input() colorOne: any;
    // @Input() colorTwo: any;
    // @Input() gradientDegree: any;
}