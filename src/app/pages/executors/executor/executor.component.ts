import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Messages } from 'src/app/core/models/messages';
import { Subcategory } from 'src/app/core/models/services';
import { ExecutorOrderHistoryResponse, ExecutorRequest, UserDetail } from 'src/app/core/models/user';
import { EssenceItem } from 'src/app/core/models/utils';
import { MainService } from 'src/app/core/services/main.service';
import { getBase64 } from 'src/app/core/utilities/base64';
import { dateLessThan } from 'src/app/core/utilities/validators';
import { ExecutorsService } from '../executors.service';

@Component({
  templateUrl: './executor.component.html',
  styleUrls: ['./executor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ExecutorComponent implements OnInit {
  private _unsubscribe$ = new Subject();
  public id: number;
  public validateForm: FormGroup;
  public executor: UserDetail;
  public subcategories: Subcategory[];
  public selectedSubcategories: number[] = [];
  public selectedSpecializations: number[] = [];
  public selectedUserAttachmentTypes: number[] = [];
  public isEditing = false;
  public isRewardHistoryVisible = false;
  public isVisibleBoard = false;
  public userAttachmentTypes: EssenceItem[] = [];
  public specializations: EssenceItem[] = [];
  public workScheduleStart: Date;
  public workScheduleEnd: Date;
  public documents: FormArray;
  public specializationsFormArray: FormArray;
  public subcategoriesFormArray: FormArray;
  public executorOrdersHistory: ExecutorOrderHistoryResponse[] = [];
  public executorDisputOrdersHistory: ExecutorOrderHistoryResponse[] = [];

  constructor(
    private _executorsService: ExecutorsService,
    private _nzMessages: NzMessageService,
    private _mainService: MainService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.isEditing = !isNaN(this.id);
  }

  ngOnInit(): void {
    this._initForm();
    if (this.isEditing) {
      this._getExecutor();
    }
    this._getSubcategories();
    this._getUserAttachmentTypes();
    this._getSpecializations();
  }

  private _initForm(): void {
    this.validateForm = this._formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        email: ['', Validators.required],
        creditCardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
        experience: '',
        study: '',
        about: '',
        executorType: ['', Validators.required],
        workScheduleStart: ['', Validators.required],
        workScheduleEnd: ['', Validators.required],
        workArea: ['', Validators.required],
        bet: ['', Validators.required],
        documents: this._formBuilder.array([]),
        specializationsFormArray: this._formBuilder.array([]),
        subcategoriesFormArray: this._formBuilder.array([]),
        image: [null, Validators.required],
        showingImage: null,
      },
      { validator: dateLessThan('workScheduleStart', 'workScheduleEnd') }
    );
    this.validateForm.valueChanges.subscribe(() => {
      console.log(this.validateForm);

    })
    this.validateForm.valueChanges.subscribe((res) => {
      if (this.validateForm.hasError('wrongDate')) {
        this._nzMessages.error(Messages.wrongTimeRange);
      }
    });
  }

  private _getSubcategories(): void {
    this._executorsService
      .getAllSubcategories()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((subcategories) => {
        this.subcategories = subcategories;
      });
  }

  private _getUserAttachmentTypes(): void {
    this._executorsService
      .getUserAttachmentTypes()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.userAttachmentTypes = response;
      });
  }

  private _getSpecializations(): void {
    this._executorsService
      .getSpecializations()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.specializations = response;
      });
  }

  private _getExecutor(): void {
    this._executorsService
      .getExecutorById(this.id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        this.executor = res;
        this._patchStateToForm();
      }, error => this._router.navigate(['dashboard/executors']));
  }

  private _getExecutorOrderHistory(): void {
    this._executorsService
      .getExecutorOrderHistory(this.id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        this.executorOrdersHistory = res.results;
      });
  }

  public getExecutorDistupOrderHistory(): void {
    this._executorsService
      .getExecutorDistupOrderHistory(this.id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        this.executorDisputOrdersHistory = res.results;
      });
  }


  public onExecutorSave(): void {
    console.log(this.validateForm);

    if (this.validateForm.invalid) {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      this._nzMessages.error(Messages.validationError);
      return;
    }
    const formValue = this.validateForm.value;
    const sendingData: ExecutorRequest = {
      user_details: {
        about: formValue.about,
        credit_card_number: formValue.creditCardNumber,
        email: formValue.email,
        experience: formValue.experience,
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        phone_number: '+995' + formValue.phone,
        study_history: formValue.study,
        image: formValue.image,
        is_registered_executor: formValue.executorType,
        city: formValue.workArea,
      },
      user_specializations: formValue.specializationsFormArray.map(
        (specializationsFormArrayItem) => {
          return {
            specialization_id: specializationsFormArrayItem.id,
            is_prioritized: specializationsFormArrayItem.isPriority,
          };
        }
      ),
      subcategories: formValue.subcategoriesFormArray.map(
        (subcategoriesFormArrayItem) => {
          return {
            id: subcategoriesFormArrayItem.id,
            is_prioritized: subcategoriesFormArrayItem.isPriority,
          };
        }
      ),
      user_schedule: {
        start_time: new Date(formValue.workScheduleStart).getHours() +
          ':' +
          new Date(formValue.workScheduleStart).getMinutes(),
        end_time: new Date(formValue.workScheduleEnd).getHours() +
          ':' +
          new Date(formValue.workScheduleEnd).getMinutes(),
        tarif: formValue.bet,
      },
    };
    if (typeof formValue.image === 'string') {
      this._sendSaveOrCreateExecutorRequest(sendingData);
    } else {
      this._mainService
        .uploadFile(formValue.image)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((response) => {
          sendingData.user_details.image = response.url;
          this._sendSaveOrCreateExecutorRequest(sendingData);
        });
    }
  }

  private _addExecutor(executor: ExecutorRequest): void {
    this._executorsService
      .addExecutor(executor)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        () => {
          this._router.navigate(['dashboard/executors']);
        },
        () => {
          this._nzMessages.error(Messages.fail);
        }
      );
  }

  private _sendSaveOrCreateExecutorRequest(sendingData: ExecutorRequest): void {
    this._addDocumentRequests()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res) => {
        const documents = this.validateForm.get('documents') as FormArray;
        sendingData.user_attachments = documents.controls
          .filter((control) => typeof control.value.file === 'string')
          .map((doc) => {
            return {
              attachment_type_id: doc.value.id,
              file_url: doc.value.file,
            };
          });
        res.forEach((file) => {
          sendingData.user_attachments.push({
            file_url: file.url,
            attachment_type_id: file.id,
          });
        });
        if (this.isEditing) {
          this._editExecutor(
            sendingData
          );
        } else {
          this._addExecutor(sendingData);
        }
      });
  }

  private _editExecutor(executor: ExecutorRequest): void {
    this._executorsService
      .editExecutor(this.id, executor)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        () => {
          this._router.navigate(['dashboard/executors']);
        },
        () => {
          this._nzMessages.error(Messages.fail);
        }
      );
  }

  public async handleExecutorImageChange(image: NzUploadChangeParam): Promise<void> {
    this.validateForm.get('image').setValue(image.file.originFileObj);
    // tslint:disable-next-line: no-non-null-assertion
    const base64Image = await getBase64(image.file.originFileObj!);
    this.validateForm.get('showingImage').setValue(base64Image);
  }

  private _addDocumentRequests(): Observable<any> {
    const multiPuts = [];
    const documents = this.validateForm.get('documents') as FormArray;
    const indexes = [];
    documents.controls.forEach((item) => {
      if (typeof item.value.file !== 'string') {
        indexes.push(item.value.id);
        multiPuts.push(this._addDocumentRequest(item.value.file));
      }
    });
    if (multiPuts.length === 0) {
      return of([]);
    }
    return forkJoin(multiPuts).pipe(
      map((data: any) => {
        data.map((d, index) => {
          d.id = indexes[index];
        });
        return data;
      })
    );
  }

  private _addDocumentRequest(formData: File): Observable<any> {
    return this._mainService.uploadFile(formData);
  }

  private _patchStateToForm(): void {
    const editingExecutor = this.executor;
    const workScheduleStart = new Date(Date.now()).setHours(
      editingExecutor.user_schedule.start_time.split(':')[0],
      editingExecutor.user_schedule.start_time.split(':')[1]
    );
    const workScheduleEnd = new Date(Date.now()).setHours(
      editingExecutor.user_schedule.end_time.split(':')[0],
      editingExecutor.user_schedule.end_time.split(':')[1]
    );
    this.workScheduleStart = new Date(workScheduleStart);
    this.workScheduleEnd = new Date(workScheduleEnd);
    console.log(this.validateForm, editingExecutor);

    this.validateForm.patchValue({
      image: editingExecutor.user_details.image || '',
      showingImage: editingExecutor.user_details.image || '',
      firstName: editingExecutor.user_details.first_name || '',
      lastName: editingExecutor.user_details.last_name || '',
      phone: (editingExecutor.user_details.phone_number).slice(4) || '',
      email: editingExecutor.user_details.email || '',
      creditCardNumber: editingExecutor.user_details.credit_card_number?.slice(3) || '',
      experience: editingExecutor.user_details.experience || '',
      study: editingExecutor.user_details.study_history || '',
      about: editingExecutor.user_details.about || '',
      executorType: editingExecutor.user_details.is_registered_executor,
      workScheduleStart: this.workScheduleStart,
      workScheduleEnd: this.workScheduleEnd,
      workArea: editingExecutor.user_schedule.city || '',
      bet: editingExecutor.user_schedule.tarif || '',
      documents: editingExecutor.user_attachments.map((attachment) => {
        const items = this.validateForm.get('documents') as FormArray;
        this.selectedUserAttachmentTypes.push(
          attachment.user_attachment.attachment_type.id
        );
        items.push(
          this._createItem(
            attachment.user_attachment.attachment_type.id,
            attachment.attachment_type[0].value,
            false,
            false,
            attachment.user_attachment.file_url
          )
        );
      }),
      specializationsFormArray: editingExecutor.user_specialization.map(
        (specialization) => {
          const items = this.validateForm.get(
            'specializationsFormArray'
          ) as FormArray;
          this.selectedSpecializations.push(
            specialization.user_specialization.specialization.id
          );

          items.push(
            this._createItem(
              specialization.user_specialization.specialization.id,
              specialization.specialization[0].value,
              true,
              specialization.user_specialization.is_prioritized
            )
          );
        }
      ),
      subcategoriesFormArray: editingExecutor.user_subcategory.map((sub) => {
        const items = this.validateForm.get(
          'subcategoriesFormArray'
        ) as FormArray;
        this.selectedSubcategories.push(sub.subcategory.subcategory.id);
        items.push(
          this._createItem(
            sub.subcategory.subcategory.id,
            sub.title[0].value,
            true,
            sub.subcategory.is_prioritized
          )
        );
      }),
    });
  }

  private _createItem(
    id: number,
    name: string,
    isPriorityAvailable: boolean,
    priorityValue = false,
    fileValue = ''
  ): FormGroup {
    const group = this._formBuilder.group({
      id: [id],
      name: [name],
      file: [fileValue],
    });
    if (isPriorityAvailable) {
      group.removeControl('file');
      group.addControl('isPriority', new FormControl(priorityValue));
    }
    return group;
  }

  public addOrDeleteItem(
    selectedTypes: number[],
    items: FormArray,
    origin: any[],
    type: string
  ): void {
    if (type === 'specializationsFormArray') {
      items = this.validateForm.get('specializationsFormArray') as FormArray;
    } else if (type === 'subcategoriesFormArray') {
      items = this.validateForm.get('subcategoriesFormArray') as FormArray;
    } else {
      items = this.validateForm.get('documents') as FormArray;
    }
    const existingIds = items.value.map((v) => v.id);
    const newId = selectedTypes.filter((x) => !existingIds.includes(x));
    if (newId[0]) {
      const index = origin.findIndex(
        (el) =>
          el.user_attachment_type?.id === newId[0] ||
          el.specialization?.id === newId[0] ||
          el.subcategory?.id === newId[0]
      );
      items.push(
        this._createItem(
          newId[0],
          origin[index].title[0].value,
          type !== 'documents'
        )
      );
    } else {
      for (let i = 0; i < existingIds.length; i++) {
        const element = existingIds[i];
        if (!selectedTypes.includes(element)) {
          items.removeAt(i);
          return;
        }
      }
    }
  }

  public activeTabChange(event: NzTabChangeEvent): void {
    if (event.index === 1) {
      if (this.executorOrdersHistory.length === 0) {
        this._getExecutorOrderHistory();
      }
    } else if (event.index === 2) {
      if (this.executorDisputOrdersHistory.length === 0) {
        this.getExecutorDistupOrderHistory();
      }
    } else if (event.index === 3) {
      this.isRewardHistoryVisible = true;
    } else if (event.index === 4) {
      this.isVisibleBoard = true;
    }
  }

  public handleUserAttachmentTypeFileChange(
    file: NzUploadChangeParam,
    control: AbstractControl
  ): void {
    control.setValue(file.file.originFileObj);
  }
}
