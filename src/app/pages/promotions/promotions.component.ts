import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subcategory } from '../../core/models/services';
import { PromotionService } from './promotion.service';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Promotion, PromotionRequestObject } from '../../core/models/promotion';
import { DatePipe } from '@angular/common';
import { Messages } from '../../core/models/messages';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  providers: [DatePipe]
})
export class PromotionsComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  listOfSelectedValue = [];
  subCategories: Subcategory[] = [];
  productSubCategories: Subcategory[] = [];
  promotions: Promotion[] = [];
  items: FormArray;
  productItems: FormArray;
  isVisible = false;
  isEditing = false;
  pageIndex = 1;
  editingPromotionIndex: number;
  unsubscribe$ = new Subject();

  constructor(
    public formBuilder: FormBuilder,
    public promotionService: PromotionService,
    public datePipe: DatePipe,
    public message: NzMessageService
  ) { }


  ngOnInit(): void {
    this.initForm();
    forkJoin([
      this.getAllSubcategories(),
      this.getAllProductsSubcategories()
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.subCategories = res[0];
        this.productSubCategories = res[1];
        this.getAllPromotions();
      });
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', [Validators.required]],
      productSubcategories: [[]],
      items: this.formBuilder.array([]),
      productItems: this.formBuilder.array([])
    });
    this.validateForm.get('productSubcategories').valueChanges.subscribe(data => {
      if (data) {
        this.addOrDeleteProductItem(data);
      }
    });
  }


  openAddPromotion(): void {
    this.isVisible = true;
  }

  getAllPromotions(): void {
    this.promotionService.getPromotions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.promotions = res;
      });
  }

  getAllSubcategories(): Observable<Subcategory[]> {
    return this.promotionService.getAllSubcategories();
  }

  getAllProductsSubcategories(): Observable<Subcategory[]> {
    return this.promotionService.getAllProductsSubcategories();
  }

  createItem(id: number, name: string, percent?: number): FormGroup {
    return this.formBuilder.group({
      id: [id],
      name: [name],
      percent: [percent || '', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addOrDeleteItem(selectedTypes: number[]): void {
    this.items = this.validateForm.get('items') as FormArray;
    const existingIds = this.items.value.map(v => v.id);
    const newId = selectedTypes.filter(x => !existingIds.includes(x));
    if (newId[0]) {
      const index = this.subCategories.findIndex(el => el.id === newId[0]);
      this.items.push(this.createItem(newId[0], this.subCategories[index].name_ru));
    } else {
      for (let i = 0; i < existingIds.length; i++) {
        const element = existingIds[i];
        if (!selectedTypes.includes(element)) {
          this.items.removeAt(i);
          return;
        }
      }
    }
  }

  addOrDeleteProductItem(selectedTypes: number[]): void {
    this.productItems = this.validateForm.get('productItems') as FormArray;
    const existingIds = this.productItems.value.map(v => v.id);
    const newId = selectedTypes.filter(x => !existingIds.includes(x));
    if (newId[0]) {
      const index = this.productSubCategories.findIndex(el => el.id === newId[0]);
      this.productItems.push(this.createItem(newId[0], this.productSubCategories[index].name_ru));
    } else {
      for (let i = 0; i < existingIds.length; i++) {
        const element = existingIds[i];
        if (!selectedTypes.includes(element)) {
          this.productItems.removeAt(i);
          return;
        }
      }
    }
  }

  onEditPromotion(index: number): void {
    this.isVisible = true;
    this.isEditing = true;
    if (this.pageIndex === 1) {
      this.editingPromotionIndex = index;
    } else {
      this.editingPromotionIndex = ((this.pageIndex - 1) * 10) + index;
    }
    this.bindState();
  }

  bindState(): void {
    this.validateForm.get('name').setValue(this.promotions[this.editingPromotionIndex].name);
    // this.validateForm.get('productSubcategories').setValue(this.promotions[this.editingPromotionIndex].sale.)
    this.validateForm.get('date').setValue([
      new Date(this.promotions[this.editingPromotionIndex].start_date),
      new Date(this.promotions[this.editingPromotionIndex].end_date)
    ]);
    this.items = this.validateForm.get('items') as FormArray;
    this.productItems = this.validateForm.get('productItems') as FormArray;
    this.promotions[this.editingPromotionIndex].discount.forEach(discount => {
      if (discount.product_subcategory === null) {
        this.items = this.validateForm.get('items') as FormArray;
        const subserviceTypeIndex =
          this.subCategories.findIndex(el => el.id === discount.id);
        this.listOfSelectedValue.push(discount.id);
        this.listOfSelectedValue = [...this.listOfSelectedValue];
        this.items.push(
          this.createItem(
            discount.id,
            this.subCategories[subserviceTypeIndex]?.name_ru,
            discount.percent
          )
        );
      } else {
        this.productItems = this.validateForm.get('productItems') as FormArray;
        const subserviceTypeIndex =
          this.productSubCategories.findIndex(el => el.id === discount.product_subcategory.id);
        this.validateForm.get('productSubcategories')
          .setValue([...this.validateForm.get('productItems').value, discount.product_subcategory.id], { emitEvent: false });
        this.productItems.push(
          this.createItem(
            discount.product_subcategory.id,
            this.productSubCategories[subserviceTypeIndex]?.name_ru,
            discount.percent
          )
        );
      }
    });
  }

  deletePromotion(promotion: Promotion, index: number): void {
    this.promotionService
      .deletePromotion(promotion.id)
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.promotions.splice(index, 1);
        this.promotions = [...this.promotions];
        this.showSuccessMessage();
      });
  }


  onSubmit(): void {
    if (this.validateForm.invalid) {
      return;
    }
    const formValue = this.validateForm.value;
    const sendingData: PromotionRequestObject = {
      sale: {
        name: formValue.name,
        end_date: this.transformDate(formValue.date[1], 'yyyy-MM-dd'),
        start_date: this.transformDate(formValue.date[0], 'yyyy-MM-dd'),
      },
      discount: [],
      product_subcategory: []
    };


    sendingData.discount = formValue.items.map((item) => {
      return {
        subcategory: item.id,
        percent: item.percent,
        product_subcategory: null
      };
    });

    sendingData.discount = [...sendingData.discount, ...formValue.productItems.map((item) => {
      return {
        subcategory: null,
        percent: item.percent,
        product_subcategory: item.id
      };
    })];
    if (this.isEditing) {
      sendingData.id = this.promotions[this.editingPromotionIndex].id;
      this.promotionService.editPromotion(sendingData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.showSuccessMessage();
          this.resetData();
          this.isVisible = false;
          this.promotions[this.editingPromotionIndex] = res;
          this.promotions = [...this.promotions];
        }, () => {
          this.showFailMessage();
        });
    } else {
      this.promotionService.addPromotion(sendingData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.showSuccessMessage();
          this.resetData();
          this.isVisible = false;
          this.getAllPromotions();
        }, () => {
          this.showFailMessage();
        });
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    return startValue.getTime() < Date.now() - 86400000;
  }

  getSubcategoryName(id: number): string {

    const subcategory = this.subCategories.filter(sub => sub.id === id);
    return subcategory.length > 0 ? subcategory[0].name_ru : '';
  }

  // getProductSubcategoryName(): string {
  //   return this.productSubCategories.find(sub => sub.)
  // }

  showSuccessMessage(): void {
    this.message.success(Messages.success);
  }

  showFailMessage(): void {
    this.message.error(Messages.fail);
  }

  transformDate(date, format: string): string {
    return this.datePipe.transform(date, format);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.resetData();
  }

  resetData(): void {
    this.validateForm.reset();
    this.clearFormArray(this.items);
    this.clearFormArray(this.productItems);
    this.listOfSelectedValue = [];
  }

  clearFormArray = (items) => {
    while (items?.length !== 0) {
      items?.removeAt(0);
    }
  }

  nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
