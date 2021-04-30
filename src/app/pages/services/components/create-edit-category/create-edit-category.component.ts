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
        color: this.activeCategory.color,
        icon: this.activeCategory.icon,
        russian: this.activeCategory?.name_ru,
        english: this.activeCategory?.name_en,
        georgian: this.activeCategory?.name_ge,
        russianDescription: this.activeCategory?.description_ru,
        englishDescription: this.activeCategory?.description_en,
        georgianDescription: this.activeCategory?.description_ge,
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
