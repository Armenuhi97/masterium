import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ServiceResponse, Subcategory, SubserviceResponse, SubserviceType} from '../../../../core/models/services';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ServicesService} from '../../services.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Measurment} from '../../../../core/models/measurment';
import {UtilsService} from '../../../../core/services/utils.service';

@Component({
  selector: 'app-create-edit-subservice',
  templateUrl: './create-edit-subservice.component.html',
  styleUrls: ['./create-edit-subservice.component.css']
})
export class CreateEditSubserviceComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() subservices: SubserviceResponse[];
  @Input() isEdit: boolean;
  measurementTypes: Measurment[] = [];
  validateForm: FormGroup;
  unsubscribe$ = new Subject();
  subserviceTypes: SubserviceType[] = [];
  listOfSelectedValue = [];
  items: FormArray;
  constructor(
    public formBuilder: FormBuilder,
    public servicesService: ServicesService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.getMeasurments();
    this.initForm();
    this.getSubserviceTypes();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  bindState(): void {
    if (this.isEdit) {
      this.items = this.validateForm.get('items') as FormArray;
      this.subservices.forEach(subservice => {
        this.items = this.validateForm.get('items') as FormArray;
        const subserviceTypeIndex =
          this.subserviceTypes.findIndex(el => el.subservice_type.id === subservice.subservice.subservice_type.id);
        this.listOfSelectedValue.push(subservice.subservice.subservice_type.id);
        this.listOfSelectedValue = [...this.listOfSelectedValue];
        this.items.push(
          this.createItem(
            subservice.subservice.subservice_type.id,
            this.subserviceTypes[subserviceTypeIndex].title[0].value,
            subservice.subservice.price,
            subservice.subservice.measurement_type.id,
            subservice.subservice.guarantee_day_count
          )
        );
      });
    }
  }

  getSubserviceTypes(): void {
    this.servicesService.getSubserviceTypes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.subserviceTypes = res;
        this.bindState();
      });
  }

  getMeasurments(): void {
    this.utilsService.getMeasurments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.measurementTypes = res;
      });
  }

  createItem(id: number, name: string, price?: number, measurementType?: number, guaranteeDays?: number): FormGroup {
    return this.formBuilder.group({
      id: [id],
      name: [name],
      price: [price || '', [Validators.required, Validators.min(0)]],
      measurementType: [measurementType || '', Validators.required],
      guaranteeDays: [guaranteeDays || '', [Validators.required, Validators.min(0)]]
    });
  }

  addOrDeleteItem(selectedTypes: number[]): void {
    this.items = this.validateForm.get('items') as FormArray;
    const existingIds = this.items.value.map(v => v.id);
    const newId = selectedTypes.filter(x => !existingIds.includes(x));
    const oldId = selectedTypes.filter(x => existingIds.includes(x));
    if (newId[0]) {
      const index = this.subserviceTypes.findIndex(el => el.subservice_type.id === newId[0]);
      this.items.push(this.createItem(newId[0], this.subserviceTypes[index].title[0].value));
    } else {
      for (let i = 0; i < existingIds.length; i++) {
        const element = existingIds[i];
        if (!selectedTypes.includes(element)){
          this.items.removeAt(i);
          return;
        }
      }
      // const index = this.items.value.findIndex(el => el.id === oldId[0]);
    }
  }

  onSave(): void {
    if (this.validateForm.valid) {
      this.save.emit(this.validateForm.value);
    } else {
      alert('HOP');
    }
  }
  closeModal(): void {
    this.close.emit();
  }
  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
