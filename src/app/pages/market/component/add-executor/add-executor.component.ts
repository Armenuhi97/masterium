import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MarketProductItem } from "src/app/core/models/market";
import { User } from "src/app/core/models/user";

@Component({
    selector: 'app-add-executor',
    templateUrl: 'add-executor.component.html',
    styleUrls: ['add-executor.component.scss']
})
export class AddExecutorComponent {
    activeItem: MarketProductItem;
    @Input('activeItem')
    set setActiveItem($event: MarketProductItem) {
        this.activeItem = $event;
        if (this.activeItem) {
            this.initForm();
            this.validateForm.get('count').setValidators([Validators.max(this.activeItem.quantity), Validators.min(0), Validators.required]);
            this.validateForm.get('count').updateValueAndValidity()
        }
    }
    executors: User[] = [];
    @Input('executors')
    set setExecutor($event:User[]) {
        this.executors = $event
    }

    @Output() close = new EventEmitter()
    @Output() save = new EventEmitter()

    validateForm: FormGroup;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() { }

    serExecutorName(executor: User):string {
        return executor ? `${executor.user.first_name} ${executor.user.last_name}` : ''
    }
    initForm():void {
        this.validateForm = this._fb.group({
            executor: [null, Validators.required],
            count: [null, Validators.required]
        })
    }
    onSave():void {
        if (this.validateForm.valid)
            this.save.emit(this.validateForm.value)
    }
    closeModal():void {
        this.close.emit()
    }
}