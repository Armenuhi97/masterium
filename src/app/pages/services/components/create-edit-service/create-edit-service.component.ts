import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Measurment } from 'src/app/core/models/measurment';
import { ServiceResponse } from 'src/app/core/models/services';
import { UtilsService } from 'src/app/core/services/utils.service';
import { getBase64 } from 'src/app/core/utilities/base64';

@Component({
  selector: 'app-create-edit-service',
  templateUrl: './create-edit-service.component.html',
  styleUrls: ['./create-edit-service.component.css']
})
export class CreateEditServiceComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() service: ServiceResponse;
  @Input() isEdit: boolean;
  unsubscribe$ = new Subject();
  validateForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      russian: ['', [Validators.required]],
      english: ['', [Validators.required]],
      georgian: ['', [Validators.required]],
      russianDescription: ['', [Validators.required]],
      englishDescription: ['', [Validators.required]],
      georgianDescription: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      showingImage: ['']
    });
    if (this.isEdit) {
      this.validateForm.patchValue({
        russian: this.service.name_ru,
        english: this.service.name_en,
        georgian: this.service.name_ge,
        russianDescription: this.service.description_ru,
        englishDescription: this.service.description_en,
        georgianDescription: this.service.description_ge,
        icon: this.service.icon,
        showingImage: this.service.icon
      });
    }
  }

  async handleChange(info: NzUploadChangeParam) {
    this.validateForm.get('icon').setValue(info.file.originFileObj);
    // tslint:disable-next-line: no-non-null-assertion
    const base64Image = await getBase64(info.file.originFileObj!);
    this.validateForm.get('showingImage').setValue(base64Image);
  }
  closeModal(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.validateForm.valid) {
      this.save.emit(this.validateForm.value);
    } else {
      alert('HOP');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
