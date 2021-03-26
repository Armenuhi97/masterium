import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MarketProduct, MarketProductRequest, MarketsProduct, Transaction } from 'src/app/core/models/market';
import { Measurment } from 'src/app/core/models/measurment';
import { Messages } from 'src/app/core/models/messages';
import { Category, ServiceRequest, ServiceResponse, Subcategory, SubcategoryRequest } from 'src/app/core/models/services';
import { MainService } from 'src/app/core/services/main.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { MarketsService } from './markets.service';

@Component({
  selector: 'app-markets',
  templateUrl: 'markets.component.html',
  styleUrls: ['markets.component.scss']
})
export class MarketsComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  categories: Category[] = [];
  subCategories: Subcategory[] = [];
  activeCategory: Category;
  activeSubcategory: Subcategory;
  activeCategoryIndex: number;
  activeSubcategoryIndex: number;
  activeServiceIndex: number;
  showCategoryActions: boolean = false;
  showSubcategoryActions: boolean = false;
  showServiceActions: boolean = false;
  isEditing: boolean = false;
  editingMarketProductIndex: number;
  activeCategoryId = null;
  redsCount: number = 0;
  isVisible: boolean = false;
  loadingTransactions: boolean = false;
  showChangeProductModal: boolean = false;
  public pageIndex: number = 1;
  public totalCount: number;
  changingCountProductIndex: number;
  validateForm: FormGroup;
  initialValues: MarketsProduct;
  marketProduct: MarketsProduct;
  listOfData: MarketsProduct[];
  imagesList: NzUploadFile[] = [];
  measurementTypes: Measurment[] = [];
  transactions: Transaction[] = [];
  subCategoriesControl = new FormControl('');
  listFilterControl = new FormControl('all');
  changeCountControl = new FormControl(0, Validators.required);
  constructor(
    private marketService: MarketsService,
    private messagesService: NzMessageService,
    private mainService: MainService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.initForm();
  }

  getAllCategories(): void {
    this.marketService.getAllCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(categories => {
        this.categories = categories;
        this.subCategories = [];
        this.listOfData = [];
        this.getMeasurments();

        this.validateForm.reset();
      }, () => this.messagesService.error(Messages.fail));
  }
  getMeasurments(): void {
    this.utilsService.getMeasurments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.measurementTypes = res;
      }, () => this.messagesService.error(Messages.fail));
  }
  getSubCategoriesByCategory(category: Category, index: number): void {
    this.activeCategory = category;
    this.activeCategoryIndex = index;
    this.activeSubcategory = null;
    this.activeServiceIndex = undefined;
    this.marketService.getSubCategoriesByCategory(category.category.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(subcategories => {
        this.subCategories = subcategories;
        this.validateForm.reset();
      }, () => this.messagesService.error(Messages.fail));
  }

  getProductsBySubcategory(subcategory: Subcategory, index: number, isReset: boolean = false): void {
    if (isReset)
      this.pageIndex = 1;
    this.activeSubcategory = subcategory;
    this.activeSubcategoryIndex = index;
    this.activeServiceIndex = undefined;
    this.marketService.getProductBySubcatery(subcategory.subcategory.id, this.pageIndex)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        this.totalCount = products.count;
        this.listOfData = products.results;
      });
  }

  hideCategoryActions(): void {
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
  }

  onEditCategory(index: number): void {
    this.activeCategory = this.categories[index];
    this.activeCategoryIndex = index;
    this.showCategoryActions = true;
    this.isEditing = true;
  }

  onEditSubcategory(index: number): void {
    this.activeSubcategory = this.subCategories[index];
    this.activeSubcategoryIndex = index;
    this.isEditing = true;
    this.showSubcategoryActions = true;
  }

  onEditService(index: number): void {
    this.isEditing = true;
    this.showServiceActions = true;
    this.activeServiceIndex = index;
  }



  onAddCategory(): void {
    this.showCategoryActions = true;
    this.isEditing = false;
  }

  onAddSubcategory(): void {
    this.showSubcategoryActions = true;
    this.isEditing = false;
  }

  onAddService(): void {
    this.showServiceActions = true;
    this.isEditing = false;
  }



  handleCategoryChange(category: any): void {
    const sendingData: Category = {
      category: {
        color_one: category.color_one,
        color_two: category.color_two,
        gradient_degree: category.gradient_degree,
        icon: category.icon,
        translation_key: this.isEditing ? this.activeCategory.category.translation_key : 'cat___title___' + String(Date.now()),
        translation_key_description: this.isEditing ?
          this.activeCategory.category.translation_key_description : 'cat___desc___' + String(Date.now())
      },
      title: [
        {
          value: category.russian,
          language: 1,
        },
        {
          value: category.english,
          language: 2,
        },
        {
          value: category.georgian,
          language: 3,
        },
      ],
      description: [
        {
          value: category.russianDescription,
          language: 1,
        },
        {
          value: category.englishDescription,
          language: 2,
        },
        {
          value: category.georgianDescription,
          language: 3,
        },
      ]
    };
    if (this.isEditing) {
      if (typeof category.icon === 'string') {
        this.marketService.editCategory(sendingData, this.activeCategory.category.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(res => {
            this.categories[this.activeCategoryIndex] = res;
            this.actionsAfterSuccessfullAction();
          }, () => {
            this.actionsAfterFailAction();
          });
      } else {
        this.mainService.uploadFile(category.icon)
          .pipe(
            takeUntil(this.unsubscribe$),
            switchMap(res => {
              sendingData.category.icon = res.url;
              return this.marketService.editCategory(sendingData, this.activeCategory.category.id);
            })
          ).subscribe(res => {
            this.categories[this.activeCategoryIndex] = res;
            this.actionsAfterSuccessfullAction();
          }, () => {
            this.actionsAfterFailAction();
          });
      }
    } else {
      this.mainService.uploadFile(category.icon)
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap((res) => {
            sendingData.category.icon = res.url;
            return this.marketService.addCategory(sendingData);
          }))
        .subscribe(res => {
          this.categories.push(res);
          this.actionsAfterSuccessfullAction();
        }, () => {
          this.actionsAfterFailAction();
        });
    }
  }

  handleSubcategoryChange(event: any): void {
    const sendingData: SubcategoryRequest = {
      subcategory: {
        translation_key_title: this.isEditing ? this.activeSubcategory.subcategory.translation_key_title : String(Date.now()),
        only_for_product: 0,
        icon: event.icon,
        category: this.activeCategory.category.id,
      },
      title: [{
        value: event.russian,
        language: 1,
      },
      {
        value: event.english,
        language: 2,
      },
      {
        value: event.georgian,
        language: 3,
      }]
    };
    if (this.isEditing) {
      if (typeof event.icon === 'string') {
        this.marketService.editSubcategory(sendingData, this.activeSubcategory.subcategory.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(res => {
            this.subCategories[this.activeSubcategoryIndex] = res;
            this.actionsAfterSuccessfullAction();
          }, () => {
            this.actionsAfterFailAction();
          });
      } else {
        this.mainService.uploadFile(event.icon)
          .pipe(
            takeUntil(this.unsubscribe$),
            switchMap(res => {
              sendingData.subcategory.icon = res.url;
              return this.marketService.editSubcategory(sendingData, this.activeSubcategory.subcategory.id);
            })
          ).subscribe(res => {
            this.subCategories[this.activeSubcategoryIndex] = res;
            this.actionsAfterSuccessfullAction();
          }, () => {
            this.actionsAfterFailAction();
          });
      }
    } else {
      this.mainService.uploadFile(event.icon)
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap((res) => {
            sendingData.subcategory.icon = res.url;
            return this.marketService.addSubcategory(sendingData);
          }))
        .subscribe(res => {
          this.subCategories.push(res);
          this.actionsAfterSuccessfullAction();
        }, () => {
          this.actionsAfterFailAction();
        });
    }
  }

  deleteCategory(id: number, index: number): void {
    this.marketService.deleteCategory(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.categories.splice(index, 1);
        this.activeCategoryIndex = undefined;
        this.subCategories = [];
      }, () => this.messagesService.error(Messages.fail));
  }

  deleteSubcategory(id: number, index: number): void {
    this.marketService.deleteSubCategory(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.subCategories.splice(index, 1);
      }, () => this.messagesService.error(Messages.fail));
  }


  actionsAfterSuccessfullAction(): void {
    this.messagesService.success(Messages.success);
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
  }

  actionsAfterFailAction(): void {
    this.messagesService.error(Messages.fail);
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      price: ['', [Validators.required]],
      measurementType: ['', [Validators.required]],
      // quantity: ['', [Validators.required]],
      // minimalCount: ['', [Validators.required]],
      // showInMarket: [false, [Validators.required]],
      nameInEnglish: ['', [Validators.required]],
      nameInRussian: ['', [Validators.required]],
      nameInGeorgian: ['', [Validators.required]],
      descriptionInEnglish: ['', [Validators.required]],
      descriptionInRussian: ['', [Validators.required]],
      descriptionInGeorgian: ['', [Validators.required]],
      productCode: ['', [Validators.required]],
      vat: ['', [Validators.required]],
      costPrice: ['', [Validators.required]],
      photo: ['', []],
    });

  }

  onSubmit(): void {
    if (this.validateForm.invalid) {
      return;
    }
    const formValue = this.validateForm.value;

    const sendingData: MarketProductRequest = {
      image: [],
      product: {
        id: this.isEditing ? this.listOfData[this.editingMarketProductIndex].product.id : undefined,
        price: formValue.price,
        measurement: formValue.measurementType,
        minimal_count: 1,
        quantity: 0,
        minimal_count_for_board: 0,
        minimum_count_for_order: 1,
        maximum_count_for_order: 10000,
        vat: formValue.vat,
        cost_price: formValue.costPrice,
        product_code: formValue.productCode,
        show_in_market: true,
        product_subcategory: this.activeSubcategory.subcategory.id,
        translation_key_description: this.isEditing ?
          this.listOfData[this.editingMarketProductIndex].product.translation_key_description
          : String('translation_key_description' + Date.now()),
        translation_key_name: this.isEditing ? this.listOfData[this.editingMarketProductIndex].product.translation_key_name
          : String('translation_key_name' + Date.now())
      },
      name: [
        {
          value: formValue.nameInRussian,
          language: 1,
        },
        {
          value: formValue.nameInEnglish,
          language: 2,
        },
        {
          value: formValue.nameInGeorgian,
          language: 3,
        },
      ],
      description: [
        {
          value: formValue.descriptionInRussian,
          language: 1,
        },
        {
          value: formValue.descriptionInEnglish,
          language: 2,
        },
        {
          value: formValue.descriptionInGeorgian,
          language: 3,
        },
      ]
    };
    console.log(this.isEditing);
    if (this.isEditing) {
      this.editMarketProductWithImages(sendingData);
    } else {
      this.postMarketProductWithImages(sendingData);
    }
  }

  editMarketProductWithImages(sendingData: MarketProductRequest): void {
    this.addImageRequests()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((response: any) => {
          sendingData.image = response.map((image, index) => {
            return {
              image_url: image.url,
              is_primary: index === 0,
            };
          });
          this.imagesList.forEach((image) => {
            if (image.imageUrl) {
              sendingData.image.push({
                image_url: image.imageUrl,
                is_primary: false
              });
            }
          });
          return this.editMarketProduct(sendingData, sendingData.product.id);
        })
      )
      .subscribe(() => {
        this.getProductsBySubcategory(this.activeSubcategory, this.activeSubcategoryIndex);
        this.validateForm.reset();
        this.closeModal();
        this.showSuccessMessage();
      }, () => this.messagesService.error(Messages.fail));
  }

  postMarketProductWithImages(sendingData: MarketProductRequest): void {
    this.addImageRequests()
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((response: any) => {
          sendingData.image = response.map((image, index) => {
            return {
              image_url: image.url,
              is_primary: index === 0,
            };
          });
          return this.postMarketProduct(sendingData);
        })
      )
      .subscribe(() => {
        this.getProductsBySubcategory(this.activeSubcategory, this.activeSubcategoryIndex);
        this.showSuccessMessage();
        this.closeModal();
      }, () => this.messagesService.error(Messages.fail));
  }

  addImageRequests(): Observable<any> {
    const multiPuts = [];
    this.imagesList.forEach((item) => {
      if (item.response && !item.imageUrl) {
        multiPuts.push(this.addImageRequest(item.response));
      }
    });
    if (multiPuts.length === 0) {
      return of([]);
    }
    return forkJoin(multiPuts);
  }

  addImageRequest(formData: File): Observable<any> {
    return this.mainService.uploadFile(formData);
  }


  postMarketProduct(sendingData: MarketProductRequest): Observable<any> {
    return this.marketService.postMarketProduct(sendingData);
  }

  editMarketProduct(sendingData: MarketProductRequest, id: number): Observable<any> {
    return this.marketService.editMarketProduct(sendingData, id);
  }

  resetData(): void {
    this.imagesList = [];
    this.validateForm.reset();
    this.editingMarketProductIndex = undefined;
  }

  closeModal(): void {
    this.isVisible = false;
    this.showChangeProductModal = false;
    this.resetData();
  }

  onEditMarketProduct(marketProduct: MarketsProduct, index: number): void {
    this.isVisible = true;
    this.isEditing = true;
    this.transactions = [];
    // if (this.pageIndex === 1) {
    this.editingMarketProductIndex = index;
    // }
    // else {
    //   this.editingMarketProductIndex = ((this.pageIndex - 1) * 10) + index;
    // }
    this.validateForm.patchValue({
      price: marketProduct.product.price,
      measurementType: marketProduct.product.measurement,
      vat: marketProduct.product.vat,
      costPrice: marketProduct.product.cost_price,
      // quantity: marketProduct.quantity,
      // minimalCount: marketProduct.product.minimal_count,
      // showInMarket: marketProduct.product.show_in_market,
      productCode: marketProduct.product.product_code,
      nameInEnglish: marketProduct.title[1].value,
      nameInRussian: marketProduct.title[0].value,
      nameInGeorgian: marketProduct.title[2].value,
      descriptionInEnglish: marketProduct.description[1].value,
      descriptionInRussian: marketProduct.description[0].value,
      descriptionInGeorgian: marketProduct.description[2].value,
      photo: ['', []],
    });
    marketProduct.images.forEach((image, i) => {
      this.imagesList.push({
        name: 'XXX',
        url: image.image_url,
        thumbUrl: image.image_url,
        uid: (0 - i).toString(),
        imageUrl: image.image_url
      });
    });
    this.imagesList = [...this.imagesList];
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleUserChange(marketProduct: MarketsProduct): void {
    this.marketProduct = marketProduct;
  }

  showSuccessMessage(): void {
    this.message.success(Messages.success);
  }

  showFailMessage(): void {
    this.message.error(Messages.fail);
  }

  customImageRequest = (item) => {
    setTimeout(() => {
      item.onSuccess(item.file);
    });
  }

  deleteMarketProduct(marketProduct: MarketsProduct, index: number): void {
    this.marketService
      .deleteMarketProduct(marketProduct.product.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.showSuccessMessage();
        // this.listOfData.splice(index, 1);
        // this.listOfData = [...this.listOfData];
        // this.calculateRedsCount();
        this.getProductsBySubcategory(this.activeSubcategory, this.activeSubcategoryIndex);

      }, () => this.messagesService.error(Messages.fail));
  }

  calculateRedsCount(): void {
    this.redsCount = 0;
    this.listOfData.forEach(product => {
      if (product.quantity < product.product.minimal_count) {
        this.redsCount += 1;
      }
    });
  }

  onChangeProductCount(index: number): void {
    this.changingCountProductIndex = index;
    this.showChangeProductModal = true;
    this.changeCountControl.reset();
  }

  changeProductCount(): void {
    this.marketService.changeProductQuantity(
      this.listOfData[this.changingCountProductIndex].product.id,
      this.changeCountControl.value
    ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.showSuccessMessage();
        this.closeModal();
        this.listOfData[this.changingCountProductIndex].quantity += this.changeCountControl.value;
      }, () => {
        this.showFailMessage();
      });
  }



  handleRemove = (file: any) => {
    const index = this.imagesList.findIndex((image) => {
      return image.imageUrl === file.imageUrl;
    });
    this.imagesList.splice(index, 1);
  }

  openMarketProductActionModal(): void {
    this.isVisible = true;
    this.isEditing = false;
    // this.resetData();
  }

  pageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getProductsBySubcategory(this.activeSubcategory, this.activeSubcategoryIndex);
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
