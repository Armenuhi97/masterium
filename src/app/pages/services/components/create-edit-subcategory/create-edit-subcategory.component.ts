import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Subcategory } from '../../../../core/models/services';

@Component({
  selector: 'app-create-edit-subcategory',
  templateUrl: './create-edit-subcategory.component.html',
  styleUrls: ['./create-edit-subcategory.component.css']
})
export class CreateEditSubcategoryComponent implements OnInit {

  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() activeSubcategory: Subcategory;
  @Input() isEdit: boolean;
  validateForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      icon: ['', [Validators.required]],
      russian: ['', [Validators.required]],
      english: ['', [Validators.required]],
      georgian: ['', [Validators.required]],
      isPopular: [false]
    });

    if (this.isEdit) {
      this.validateForm.patchValue({
        icon: this.activeSubcategory.subcategory.icon,
        russian: this.activeSubcategory.title[0]?.value,
        english: this.activeSubcategory.title[1]?.value,
        georgian: this.activeSubcategory.title[2]?.value,
        isPopular: this.activeSubcategory.subcategory.is_popular
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  // tslint:disable-next-line:typedef
  handleChange(info: NzUploadChangeParam) {
    this.validateForm.get('icon').setValue(info.file.originFileObj);
  }

  onSave(): void {
    if (this.validateForm.valid) {
      this.save.emit(this.validateForm.value);
    } else {
      alert('HOP');
    }
  }

}
