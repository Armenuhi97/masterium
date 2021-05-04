import { DatePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServerResponce } from "src/app/core/models/server-responce";
import { ServicesService } from "../../services.service";

@Component({
    selector: 'app-subservice-closed-hours',
    templateUrl: 'subservice-closed-hours.component.html',
    styleUrls: ['subservice-closed-hours.component.scss'],
    providers:[DatePipe]
})
export class SubserviceClosedHoursComponent {
    unsubscribe$ = new Subject();
    subOrderId: number
    suborderClosedHoursList = [];
    public total: number;
    pageIndex: number = 1;
    pageSize:number=10;
    // @Output() cardClicked = new EventEmitter<void>();
    // @Output() edit = new EventEmitter<void>();
    // @Output() delete = new EventEmitter<void>();
    @Input('id')
    set setId($event) {
        if ($event) {
            this.subOrderId = $event
            this.getClosedHoursList()
        }
    }
    constructor(private servicesService: ServicesService) { }
    ngOnInit() { }
    getClosedHoursList() {
        this.servicesService.getSubserviceClosedHours(this.subOrderId, this.pageIndex).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ServerResponce<any>) => {
            this.suborderClosedHoursList = data.results;
            this.total = data.count;

            console.log(data);

        })
    }
    pageIndexChange($event) {
        this.pageIndex = $event;
        this.getClosedHoursList()
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