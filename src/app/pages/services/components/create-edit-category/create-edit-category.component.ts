import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzUploadChangeParam} from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-create-edit-category',
  templateUrl: './create-edit-category.component.html',
  styleUrls: ['./create-edit-category.component.css']
})
export class CreateEditCategoryComponent implements OnInit {
  // tslint:disable-next-line:no-output-native
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Input() activeCategory: any;
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
      // gradient_degree: ['', [Validators.required]],
      color: ['', [Validators.required]],
      // color_two: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      russian: ['', Validators.required],
      english: ['', Validators.required],
      georgian: ['', Validators.required],
      russianDescription: ['', Validators.required],
      englishDescription: ['', Validators.required],
      georgianDescription: ['', Validators.required]
    });

    if (this.isEdit) {
      this.validateForm.patchValue({
        color: this.activeCategory.category.color,
        icon: this.activeCategory.category.icon,
        russian: this.activeCategory?.title[0]?.value,
        english: this.activeCategory?.title[1]?.value,
        georgian: this.activeCategory?.title[2]?.value,
        russianDescription: this.activeCategory?.description[0]?.value,
        englishDescription: this.activeCategory?.description[1]?.value,
        georgianDescription: this.activeCategory?.description[2]?.value,
      });
    }
  }

  closeModal(): void {
    this.close.emit();
  }
  public changeColorPicker(controlName: string, event): void {
    this.validateForm.get(controlName).setValue(event)
  }
  // tslint:disable-next-line:typedef
  handleChange(info: NzUploadChangeParam) {
    this.validateForm.get('icon').setValue(info.file.originFileObj);
  }


  onSave(): void {
    if (this.validateForm.valid){
      this.save.emit(this.validateForm.value);
    } else {
      alert('HOP');
    }
  }
}
