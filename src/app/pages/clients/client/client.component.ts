import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { forkJoin, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Messages } from 'src/app/core/models/messages';
import { ServerResponce } from 'src/app/core/models/server-responce';
import { ClientDetail, ClientOrderHistoryResponse, ClientRequest, CompanyType } from 'src/app/core/models/user';
import { EssenceItem } from 'src/app/core/models/utils';
import { MainService } from 'src/app/core/services/main.service';
import { getBase64 } from 'src/app/core/utilities/base64';
import { ClientsService } from '../clients.service';

@Component({
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  private _unsubscribe$ = new Subject();
  private _id: number;
  public isEditing = false;
  public disputPageIndex: number = 1;
  public pageSize = 10;
  public pageIndex = 1;
  public disputTotal: number;
  public historyOffset: number = 0;
  public validateForm: FormGroup;
  public totalHistory: number;
  public historypageIndex: number = 1;
  public editingClientIndex: number;
  public user: ClientDetail;
  public clientOrdersHistory: ClientOrderHistoryResponse[] = [];
  public clientDisputHistory = [];
  public companyTypes: CompanyType[];
  constructor(
    private _clientsService: ClientsService,
    private _formBuilder: FormBuilder,
    private _nzMessages: NzMessageService,
    private _mainService: MainService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this._id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    this.isEditing = !isNaN(this._id);
  }

  ngOnInit(): void {
    this._initForm();
    this._combineObservable()
    // this._getCompanyTypes();
    // if (this.isEditing) {
    //   this._getClient();
    // }
  }

  private _initForm(): void {
    this.validateForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      companyId: '',
      companyName: '',
      companyType: '',
      creditCardNumber: ['', [Validators.maxLength(12), Validators.minLength(12)]],
      isCooperativeUser: [false, [Validators.required]],
      email: ['', [Validators.email]],
      image: null,
      showingImage: null,
    });

    this.validateForm.get('isCooperativeUser').valueChanges.subscribe(data => {
      if (data) {
        this.validateForm.get('companyId').setValidators(Validators.required);
        this.validateForm.get('companyName').setValidators(Validators.required);
        this.validateForm.get('companyType').setValidators(Validators.required);
      } else {
        this.validateForm.get('companyId').clearValidators();
        this.validateForm.get('companyName').clearValidators();
        this.validateForm.get('companyType').clearValidators();
        this.validateForm.get('companyId').updateValueAndValidity();
        this.validateForm.get('companyName').updateValueAndValidity();
        this.validateForm.get('companyType').updateValueAndValidity();
      }
    });
  }
  private _combineObservable() {
    const combine = forkJoin(
      this._getCompanyTypes()

    )
    combine.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
      if (this.isEditing) {
        this._getClient();
      }
    })
  }

  private _getCompanyTypes() {
    return this._clientsService.getCompanyTypes()
      .pipe(map((res) => {
        console.log(res);

        this.companyTypes = res;
      }));
  }

  public getClientOrders(): void {
    this._clientsService.getClientOrders(
      this._id,
      this.historyOffset
    )
      .pipe(takeUntil(this._unsubscribe$)).subscribe((data: ClientOrderHistoryResponse[]) => {
        this.clientOrdersHistory = data;
      });
  }

  public getClientDisput(): void {
    this._clientsService.getClientDisputsHistory(
      this._id,
      this.disputPageIndex
    )
      .pipe(takeUntil(this._unsubscribe$)).subscribe((data: ServerResponce<any[]>) => {
        this.disputTotal = data.count;
        this.clientDisputHistory = data.results;
      });
  }

  public onClientSave(): void {
    if (this.validateForm.invalid) {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
      this._nzMessages.error(Messages.validationError);
      return;
    }
    const formValue = this.validateForm.value;
    const sendingData: ClientRequest = {
      credit_card_number: null,
      bank: null,
      email: formValue.email,
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      phone_number: '+995' + formValue.phoneNumber,
      image: formValue.image,
      is_cooperative_user: formValue.isCooperativeUser,
      company_id: formValue.isCooperativeUser ? formValue.companyId : null,
      company_name: formValue.isCooperativeUser ? formValue.companyName : null,
      company_type_id: formValue.isCooperativeUser ? formValue.companyType : null,
      about: null,
      experience: null,
      study_history: null,
    };
    if (typeof formValue.image === 'string' || !formValue.image) {
      this._sendSaveOrCreateExecutorRequest(sendingData);
    } else {
      this._mainService.uploadFile(formValue.image)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((response) => {
          sendingData.image = response.url;
          this._sendSaveOrCreateExecutorRequest(sendingData);
        });
    }
  }

  private _addClient(client: ClientRequest): void {
    this._clientsService
      .addClient(client)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        () => {
          this._router.navigate(['dashboard/clients']);
        },
        (err) => {
          if (err.error && err.error[0] && err.error[0].includes("this phone number")) {
            this._nzMessages.error('Этот номер телефона уже зарегистрирован');
          } else {
            this._nzMessages.error(Messages.fail);
          }
        }
      );
  }

  private _editClient(client: ClientRequest): void {
    this._clientsService
      .editClient(this._id, client)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        () => {
          this._router.navigate(['dashboard/clients']);
        },
        (err) => {
          if (err.error && err.error[0] && err.error[0].includes("this phone number")) {
            this._nzMessages.error('Этот номер телефона уже зарегистрирован');
          } else {
            this._nzMessages.error(Messages.fail);
          }
        }
      );
  }

  private _sendSaveOrCreateExecutorRequest(sendingData: ClientRequest): void {
    if (this.isEditing) {
      this._editClient(sendingData);
    } else {
      this._addClient(sendingData);
    }
  }

  private _getClient(): void {
    this._clientsService.getClientById(this._id)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(res => {
        this.user = res;
        this.patchStateToForm();
      });
  }

  patchStateToForm(): void {
    const editingExecutor = this.user;
    this.validateForm.patchValue({
      image: editingExecutor.image || '',
      showingImage: editingExecutor.image || '',
      firstName: editingExecutor.first_name || '',
      lastName: editingExecutor.last_name || '',
      phoneNumber: editingExecutor.phone_number?.slice(4) || '',
      email: editingExecutor.email || '',
      creditCardNumber: editingExecutor.credit_card_number || '',
      companyId: editingExecutor.company_id || '',
      companyName: editingExecutor.company_name || '',
      companyType: editingExecutor.company_type || '',
      isCooperativeUser: editingExecutor.is_cooperative_user,

    });
  }

  public nzDisputHistoryPageIndexChange($event): void {
    this.disputPageIndex = $event;
    this.getClientDisput();
  }

  public nzHistoryPageIndexChange($event: number): void {
    this.historypageIndex = $event;
    this.historypageIndex = (this.pageIndex - 1) * this.pageSize;
    this.getClientOrders();
  }

  public async handleClientImageChange(image: NzUploadChangeParam): Promise<void> {
    this.validateForm.get('image').setValue(image.file.originFileObj);
    // tslint:disable-next-line:no-non-null-assertion
    const base64Image = await getBase64(image.file.originFileObj!);
    this.validateForm.get('showingImage').setValue(base64Image);
  }

  public activeTabChange(event: NzTabChangeEvent): void {
    if (event.index === 1) {
      if (this.clientOrdersHistory.length === 0) {
        this.getClientOrders();
      }
    } else if (event.index === 2) {
      if (this.clientDisputHistory.length === 0) {
        this.getClientDisput();
      }
    } else if (event.index === 3) {
    }
  }

}
