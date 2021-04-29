import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import {
  EssenceType,
  EssenceTypes,
} from 'src/app/core/models/essence';
import { Messages } from 'src/app/core/models/messages';
import { EssenceItem } from '../../../core/models/utils';
import { TranslationItem } from '../../../core/models/translate';
import { MainService } from '../../../core/services/main.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-essence-list-item',
  templateUrl: './essence-list-item.component.html',
  styleUrls: ['./essence-list-item.component.scss'],
})
export class EssenceListItemComponent implements OnInit, OnDestroy {
  @Input() itemsList: EssenceItem[];
  @Input() essenceLabel: string;
  @Input() buttonLabel: string;
  @Input() inputLabel: string;
  @Input() type: EssenceTypes;
  @Output() add = new EventEmitter<{
    essenceType: string;
    essenceValue: any;
  }>();
  @Output() delete = new EventEmitter<{ type: string; id: number }>();
  @Output() edit = new EventEmitter<{
    essenceType: string;
    essenceValue: any;
    id: number;
  }>();
  validateForm: FormGroup;
  isVisible = false;
  isEditing = false;
  editingEssenceIndex: number;
  unsubscribe$ = new Subject();
  constructor(
    public formBuilder: FormBuilder,
    public message: NzMessageService,
    public mainService: MainService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  addEssence(): void {
    this.isEditing = false;
    this.editingEssenceIndex = undefined;
    this.showModal();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      essenceTitleInRussian: ['', [Validators.required]],
      essenceTitleInEnglish: ['', [Validators.required]],
      essenceTitleInGeorgian: ['', [Validators.required]]
    });
    if (this.type === EssenceType.specialization) {
      this.validateForm.addControl(
        'icon',
        new FormControl('', Validators.required)
      );
    }
    if (this.type === EssenceType.help) {
      this.validateForm.addControl('descriptionInRussian', new FormControl('', Validators.required));
      this.validateForm.addControl('descriptionInEnglish', new FormControl('', Validators.required));
      this.validateForm.addControl('descriptionInGeorgian', new FormControl('', Validators.required));
    }
    if (this.type === EssenceType.measurementType) {
      this.validateForm.addControl('code', new FormControl('', [Validators.required, Validators.maxLength(5)]));

    }
  }



  handleOk(): void {
    if (this.validateForm.valid) {
      let sendingData: EssenceItem;
      const titles = {
        name_en: this.validateForm.value.essenceTitleInEnglish,
        name_ru: this.validateForm.value.essenceTitleInRussian,
        name_ge: this.validateForm.value.essenceTitleInGeorgian
      }
      if (this.type === EssenceType.help) {
        sendingData = {
          description_ge: this.validateForm.value.descriptionInGeorgian,
          description_ru: this.validateForm.value.descriptionInRussian,
          description_en: this.validateForm.value.descriptionInEnglish,

          help: {
            translation_key_title: this.isEditing ?
              this.itemsList[this.editingEssenceIndex].translation_key_title : `help_title___${Date.now()}`,
            translation_key_description: this.isEditing ?
              this.itemsList[this.editingEssenceIndex].translation_key_description : `help_description___${Date.now()}`
          }
        };
        sendingData = Object.assign(sendingData, titles)
      } else if (this.type === EssenceType.measurementType) {
        sendingData = {
          measurement_type: {
            translation_key: this.isEditing ?
              this.itemsList[this.editingEssenceIndex].translation_key : `measurement_type___title${Date.now()}`,
            code: (this.validateForm.value.code).toUpperCase()

          },
        };
        sendingData = Object.assign(sendingData, titles)

      } else if (this.type === EssenceType.specialization) {
        sendingData = {
          specialization: {
            translation_key: this.isEditing ?
              this.itemsList[this.editingEssenceIndex].translation_key : `specialization___title${Date.now()}`
          }
        };
        sendingData = Object.assign(sendingData, titles)

        if (typeof this.validateForm.get('icon').value === 'string') {
          sendingData.specialization.icon = this.validateForm.get('icon').value;
          this.emitValues(sendingData);
        } else {
          this.mainService.uploadFile(this.validateForm.get('icon').value)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((res) => {
              sendingData.specialization.icon = res.url;
              this.emitValues(sendingData);
            });
        }
      } else if (this.type === EssenceType.subserviceType) {
        sendingData = {
          // title: titles,
          subservice_type: {
            translation_key: this.isEditing ?
              this.itemsList[this.editingEssenceIndex].translation_key : `subservice_type___title${Date.now()}`
          }
        };
        sendingData = Object.assign(sendingData, titles)

      } else if (this.type === EssenceType.userAttachmentType) {
        sendingData = {
          // title: titles,
          user_attachment_type: {
            translation_key: this.isEditing ? this.itemsList[this.editingEssenceIndex].translation_key :
              `user_attachment_type${Date.now()}`
          }
        };
        sendingData = Object.assign(sendingData, titles)

      }
      if (this.type == EssenceType.measurementType && this.validateForm.value.code) {
        let item = this.itemsList.filter((el) => { return el.code == this.validateForm.value.code });
        if (item && item.length) {
          this.message.error('Уже существует такой код')
          return
        }
      }

      if (this.type !== EssenceType.specialization) {
        this.emitValues(sendingData);
      }
      this.closeModal();
    } else if (this.validateForm.get('icon').invalid) {
      this.message.create('error', Messages.photoNotAttached);
    }
  }

  emitValues(sendingData: EssenceItem): void {
    if (this.isEditing) {
      this.edit.emit({
        essenceType: this.type,
        essenceValue: sendingData,
        id: this.itemsList[this.editingEssenceIndex]?.id 
      });
    } else {
      this.add.emit({
        essenceType: this.type,
        essenceValue: sendingData
      });
    }
  }

  // tslint:disable-next-line:typedef
  async handleChange(info: NzUploadChangeParam) {
    this.validateForm.get('icon').setValue(info.file.originFileObj);
  }

  // tslint:disable-next-line:typedef
  handleDelete(id: number) {
    this.delete.emit({ id, type: this.type });
  }

  editEssenceItem(index: number): void {
    this.isEditing = true;
    this.editingEssenceIndex = index;
    this.validateForm.get('essenceTitleInRussian').setValue(this.itemsList[index].name_ru);
    this.validateForm.get('essenceTitleInEnglish').setValue(this.itemsList[index].name_en);
    this.validateForm.get('essenceTitleInGeorgian').setValue(this.itemsList[index].name_ge);
    if (this.type === EssenceType.help) {
      this.validateForm.get('descriptionInRussian').setValue(this.itemsList[index].description_ru);
      this.validateForm.get('descriptionInEnglish').setValue(this.itemsList[index].description_en);
      this.validateForm.get('descriptionInGeorgian').setValue(this.itemsList[index].description_ge);
    }
    if (this.type === EssenceType.measurementType) {
      this.validateForm.get('code').setValue(this.itemsList[index].code);

    }
    if (this.type === EssenceType.specialization) {
      this.validateForm.get('icon').setValue(this.itemsList[index].icon);
    }
    this.showModal();
  }

  showModal(): void {
    this.isVisible = true;
  }

  closeModal(): void {
    this.isVisible = false;
    this.validateForm.reset();
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
