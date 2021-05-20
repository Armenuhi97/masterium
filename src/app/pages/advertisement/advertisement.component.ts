import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AdvertisementType, Advertisement, AdvertisementResponse } from 'src/app/core/models/advertisment';
import { Messages } from 'src/app/core/models/messages';
import { AdvertisementService } from './advertisement.service';
import { MainService } from '../../core/services/main.service';
import { Promotion } from '../../core/models/promotion';
import { getBase64 } from 'src/app/core/utilities/base64';

@Component({
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class AdvertisementComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  isVisible = false;
  isEditing = false;
  editingAdvertisementIndex: number;
  validateForm: FormGroup;
  advertisements: AdvertisementResponse[];
  advertisementTypes: AdvertisementType[];
  promotions: Promotion[] = [];
  pageIndex = 1;
  constructor(
    public message: NzMessageService,
    public formBuilder: FormBuilder,
    public advertisementsService: AdvertisementService,
    public datePipe: DatePipe,
    public mainService: MainService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAdvertisements();
    this.getAdvertisementTypes();
    this.getAllPromotions();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      type: ['', Validators.required],
      date: ['', [Validators.required]],
      isMain: '',
      russianImage: ['', Validators.required],
      englishImage: ['', Validators.required],
      georgianImage: ['', Validators.required],
      showrussianImage: ['', Validators.required],
      showenglishImage: ['', Validators.required],
      showgeorgianImage: ['', Validators.required],
    });

    this.validateForm.get('type').valueChanges.subscribe(data => {
      if (data === 1) {
        this.validateForm.addControl('sale', new FormControl());
      } else {
        if (this.validateForm.get('sale'))
          this.validateForm.removeControl('sale');
      }
    });
  }

  disabledStartDate = (startValue: Date): boolean => {
    return startValue.getTime() < Date.now() - 86400000;
  }

  getAllPromotions(): void {
    this.advertisementsService.getPromotions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.promotions = res;
      });
  }


  onSubmit(): void {
    // if (!this.validateForm.get('image').value || typeof this.validateForm.get('image').value === 'string') {
    //   this.message.error(Messages.photoNotAttached);
    //   return;
    // }
    if (this.validateForm.invalid) {
      return;
    }
    const formValue = this.validateForm.value;
    const sendingData: Advertisement = {
      advertisement: {
        advertisement_type: formValue.type,
        start_date: this.transformDate(formValue.date[0], 'yyyy-MM-dd'),
        end_date: this.transformDate(formValue.date[1], 'yyyy-MM-dd'),
        sale: formValue.sale || null,
        is_main: Number(formValue.isMain)
      },
      images: [
        { image: formValue.russianImage, language: 1 },
        { image: formValue.englishImage, language: 2 },
        { image: formValue.georgianImage, language: 3 }
      ]
    };

    if (this.isEditing) {
      this.editAdvertisement(sendingData);
    } else {
      this.postAdvertisement(sendingData);
    }
  }

  getAdvertisementTypes(): void {
    this.advertisementsService.getAdvertisementTypes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.advertisementTypes = res.results;
      });
  }

  postAdvertisement(advertisement: Advertisement): void {
    const formValue = this.validateForm.value;
    forkJoin([
      this.mainService.uploadFile(formValue.russianImage),
      this.mainService.uploadFile(formValue.englishImage),
      this.mainService.uploadFile(formValue.georgianImage)
    ])
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((res) => {
          advertisement.images = [
            {
              image: res[0].url,
              language: 1
            },
            {
              image: res[1].url,
              language: 2
            },
            {
              image: res[2].url,
              language: 3
            },
          ];
          return this.advertisementsService.postAdvertisement(advertisement);
        })
      ).subscribe((advertisements) => {
        this.advertisements.push(advertisements);
        this.advertisements = [...this.advertisements];
        this.showSuccessMessage();
        this.handleCancel();
      });
  }

  editAdvertisement(advertisement: Advertisement): void {
    this.advertisementsService.editAdvertisement(advertisement, this.advertisements[this.editingAdvertisementIndex].id)
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.advertisementsService.getAdvertisements())
      )
      .subscribe(response => {
        this.advertisements = response;
        this.showSuccessMessage();
        this.handleCancel();
      });
  }

  getAdvertisements(): void {
    this.advertisementsService.getAdvertisements()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.advertisements = response;
      });
  }

  addAdvertisement(): void {
    this.isVisible = true;
    this.isEditing = false;
    // if (this.validateForm)
    // this.validateForm.reset();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.isEditing = false;
    this.editingAdvertisementIndex = undefined;
    if (this.validateForm.get('sale')) {
      this.validateForm.removeControl('sale');
    }
    this.validateForm.reset();

  }


  onEditAdvertisement(index: number): void {
    if (this.pageIndex === 1) {
      this.editingAdvertisementIndex = index;
    } else {
      this.editingAdvertisementIndex = ((this.pageIndex - 1) * 10) + index;
    }
    this.isVisible = true;
    this.isEditing = true;
    const editingAdvertisement = this.advertisements[this.editingAdvertisementIndex];
    this.validateForm.addControl('sale', new FormControl());
    this.validateForm.patchValue({
      sale: editingAdvertisement.sale ? editingAdvertisement.sale.id : null,
      type: editingAdvertisement.advertisement_type.id,
      date: [new Date(editingAdvertisement.start_date), new Date(editingAdvertisement.end_date)],
      russianImage: editingAdvertisement.images[0]?.image,
      englishImage: editingAdvertisement.images[1]?.image,
      georgianImage: editingAdvertisement.images[2]?.image,
      showrussianImage: editingAdvertisement.images[0]?.image,
      showenglishImage: editingAdvertisement.images[1]?.image,
      showgeorgianImage: editingAdvertisement.images[2]?.image
    });
  }

  deleteAdvertisement(advertisement: AdvertisementResponse, index: number): void {
    this.advertisementsService
      .deleteAdvertisement(advertisement.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.advertisements.splice(index, 1);
        this.advertisements = [...this.advertisements];
        this.showSuccessMessage();
      });
  }

  async handleChange(info: NzUploadChangeParam, controlName: string): Promise<void> {    
    if (this.isEditing) {
      this.mainService.uploadFile(info.file.originFileObj)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.validateForm.get(controlName).setValue(res.url);
          this.validateForm.get(`show${controlName}`).setValue(res.url);
        });
    } else {
      const base64Image = await getBase64(info.file.originFileObj!);      
      this.validateForm.get(`show${controlName}`).setValue(base64Image);
      this.validateForm.get(controlName).setValue(info.file.originFileObj);
    }
  }


  showSuccessMessage(): void {
    this.message.success(Messages.success);
  }

  transformDate(date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  showErrorMessage(): void {
    this.message.error(Messages.fail);
  }

  nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
