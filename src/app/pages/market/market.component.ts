import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  AddProductToExecutorRequest, MarketProduct,
  MarketProductItem,
  MarketProductRequest, Transaction, WarehouseRequest
} from 'src/app/core/models/market';
import { Messages } from 'src/app/core/models/messages';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { MarketService } from './market.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MainService } from 'src/app/core/services/main.service';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Measurment } from '../../core/models/measurment';
import { UtilsService } from '../../core/services/utils.service';
import { Category, Subcategory } from '../../core/models/services';
import { ServerResponce } from 'src/app/core/models/server-responce';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarketComponent implements OnInit, OnDestroy {
  tabInex = 0;
  activeItem: MarketProductItem;
  isShowExecutorModal: boolean = false;
  unsubscribe$ = new Subject();
  editingMarketProductIndex: number;
  activeCategoryId = null;
  redsCount = 0;
  whiteCounts: number = 0;
  activeSubcategoryIndex = undefined;
  isVisible = false;
  isEditing = false;
  loadingTransactions = false;
  showChangeProductModal = false;
  showAddProductToExecutorModal = false;
  pageIndex = 1;
  changingCountProductIndex: number;
  validateForm: FormGroup;
  addProductToExecutorForm: FormGroup;
  initialValues: MarketProduct;
  marketProduct: MarketProduct;
  listOfData: MarketProductItem[] = [];
  imagesList: NzUploadFile[] = [];
  subCategories: Subcategory[];
  categories: Category[];
  measurementTypes: Measurment[] = [];
  transactions: Transaction[] = [];
  subCategoriesControl = new FormControl('');
  listFilterControl = new FormControl('all');
  changeCountControl = new FormControl(0, Validators.required);
  warehouseBoards = [];
  boardPageindex = 1;
  pageSize = 10;
  selectedWarehouseBoard: any;
  total: number = 0;
  executors: User[] = []
  constructor(
    public message: NzMessageService,
    public formBuilder: FormBuilder,
    public marketService: MarketService,
    public mainService: MainService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initAddProductToExecutorForm();
    this.getCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.categories = response;
        this.activeCategoryId = this.categories[0].id;
        // this.getSubcategories();
        // this.getMarketProductsByCategory();
        this.subscribeToSubserviceControlChange();
        this.subscribeToColorControlChange()
        this.getMeasurments();
        this.getWarehouseBoards();
        this.getExecutorList()
      });
  }
  public changeShowInMarket($event, data: MarketProductItem,ind:number) {
    console.log($event);

    data.show_in_market = $event;
    const product = {
      ...this.listOfData[ind],
      show_in_market:$event,
      id: this.listOfData[ind].id
      // minimal_count_for_board: formValue.minimalCountForBoard,
      // minimal_count: formValue.minimalCount,
      // minimum_count_for_order: formValue.minimumCountForOrder,
      // maximum_count_for_order: formValue.maximumCountForOrder,
    };
    const sendingData = {
      ...this.listOfData[ind],
      product,
    };
    sendingData.measurement=this.listOfData[ind].measurement ? this.listOfData[ind].measurement.id : null;
    delete Object.assign(sendingData, { ['image']: sendingData.images }).images;
    this.editMarketProduct(sendingData, sendingData.product.id).pipe(takeUntil(this.unsubscribe$)).subscribe()
  }
  public initAddProductToExecutorForm(): void {
    this.addProductToExecutorForm = this.formBuilder.group({
      quantity: [null, [Validators.required]]
    });
  }

  public initForm(): void {
    this.validateForm = this.formBuilder.group({
      minimalCountForBoard: ['', [Validators.required]],
      minimalCount: ['', [Validators.required]],
      minimumCountForOrder: ['', [Validators.required]],
      maximumCountForOrder: ['', [Validators.required]]
    });
  }

  public getWarehouseBoards(): void {
    const offset = (this.pageIndex - 1) * this.pageSize;
    this.marketService.getWarehouseBoards(this.pageIndex, offset)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.warehouseBoards = res.results;
      });
  }

  subscribeToSubserviceControlChange(): void {
    this.subCategoriesControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      // this.activeSubcategoryIndex = data;
      if (data)
        this.getMarketProductsByCategory(1);
    });
  }
  subscribeToColorControlChange(): void {
    this.listFilterControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((data) => {
      if (data)
        this.getMarketProductsByCategory(1);

    });
  }
  getMarketProductsByCategory(page: number = this.pageIndex): void {
    if (this.activeSubcategoryIndex) {
      this.marketService
        .getProductsBySubcategory(this.activeSubcategoryIndex)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result: any) => {
          this.listOfData = result;
          // this.calculateRedsCount();
        });
    } else {

      this.marketService
        .getProductsByCategory(page, this.activeCategoryId, this.subCategoriesControl.value, this.listFilterControl.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result: ServerResponce<MarketProduct>) => {
          this.total = result.results.all_count;
          this.redsCount = result.results.red_count;
          this.whiteCounts = result.results.white_count
          this.listOfData = result.results.products;
          // this.calculateRedsCount();
        });
    }
  }

  getSubcategories(id?: number): void {
    this.marketService.getSubCategoriesByCategory(id || this.activeCategoryId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.subCategories = response;
      });
  }

  getCategories(): Observable<Category[]> {
    return this.marketService.getAllCategories();
  }

  getMeasurments(): void {
    this.utilsService.getMeasurments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.measurementTypes = res;
      });
  }
  getExecutorList(): void {
    this.marketService.getExecutors()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: ServerResponce<User[]>) => {
        this.executors = res.results;
      });
  }
  public onAddProductToExecutor(item): void {
    this.selectedWarehouseBoard = item;
    this.showAddProductToExecutorModal = true;
  }
  public closeExecutorModal() {
    this.isShowExecutorModal = false;
    this.activeItem = null
  }
  public addExutorToProduct($event) {
    if ($event) {
      let sendResponse = {
        products: [{ id: this.activeItem.id, quantity: $event.count }]
      }
      this.marketService.addExecutorToProduct($event.executor, sendResponse).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
        let index = this.listOfData.findIndex((data) => { return data.id == this.activeItem.id })
        this.listOfData[index].quantity -= $event.count;
        this.closeExecutorModal();
      })
    }
  }
  public addProductToExecutor(): void {
    const sendingData: AddProductToExecutorRequest = {
      quantity: this.addProductToExecutorForm.value.quantity
    };
    this.marketService.addProductToExecutor(sendingData, this.selectedWarehouseBoard.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.toggleAddProductToExecutor();
        this.showSuccessMessage();
        this.addProductToExecutorForm.reset();
        this.getWarehouseBoards();
      });
  }

  onSubmit(): void {
    if (this.validateForm.invalid) {
      return;
    }
    const formValue = this.validateForm.value;    
    const product = {
      ...this.listOfData[this.editingMarketProductIndex],
      
      id: this.isEditing ? this.listOfData[this.editingMarketProductIndex].id : undefined,
      minimal_count_for_board: formValue.minimalCountForBoard,
      minimal_count: formValue.minimalCount,
      minimum_count_for_order: formValue.minimumCountForOrder,
      maximum_count_for_order: formValue.maximumCountForOrder,
    };
   
    const sendingData = {
      ...this.listOfData[this.editingMarketProductIndex],
      product,
    };
    sendingData.measurement=this.listOfData[this.editingMarketProductIndex].measurement ? this.listOfData[this.editingMarketProductIndex].measurement.id : null;
    delete Object.assign(sendingData, { ['name']: sendingData.title }).title;
    delete Object.assign(sendingData, { ['image']: sendingData.images }).images;


    if (this.isEditing) {
      this.editMarketProductWithImages(sendingData);
    } else {
      this.postMarketProductWithImages(sendingData);
    }
  }

  editMarketProductWithImages(sendingData: WarehouseRequest): void {
    // this.addImageRequests()
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     switchMap((response) => {
    //       sendingData.image = response.map((image, index) => {
    //         return {
    //           image_url: image.url,
    //           is_primary: index === 0,
    //         };
    //       });
    //       this.imagesList.forEach((image) => {
    //         if (image.imageUrl) {
    //           sendingData.image.push({
    //             image_url: image.imageUrl,
    //             is_primary: false
    //           });
    //         }
    //       });
    //   })
    // )
    this.editMarketProduct(sendingData, sendingData.product.id).pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getMarketProductsByCategory();
        this.validateForm.reset();
        this.closeModal();
        this.showSuccessMessage();
      });
  }

  postMarketProductWithImages(sendingData: WarehouseRequest): void {
    // this.addImageRequests()
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     switchMap((response) => {
    //       console.log(response);
    //       sendingData.image = response.map((image, index) => {
    //         return {
    //           image_url: image.url,
    //           is_primary: index === 0,
    //         };
    //       });
    this.postMarketProduct(sendingData).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.getMarketProductsByCategory();
      this.showSuccessMessage();
      this.closeModal();
    });
    //   })
    // )

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


  postMarketProduct(sendingData: WarehouseRequest): Observable<any> {
    return this.marketService.postMarketProduct(sendingData);
  }

  editMarketProduct(sendingData: WarehouseRequest, id: number): Observable<any> {
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
    this.tabInex = 0;
  }

  onEditMarketProduct(marketProduct: MarketProductItem, index: number): void {

    this.isVisible = true;
    this.isEditing = true;
    this.transactions = [];
    if (this.pageIndex === 1) {
      this.editingMarketProductIndex = index;
    }
    else {
      this.editingMarketProductIndex = ((this.pageIndex - 1) * 10) + index;
    }
    // if (marketProduct.product && marketProduct.product.product_category_id) {
    //   const category = this.categories.find(element => element.id === marketProduct.product.product_category_id);
    //   if (category && category)
    //     this.validateForm.get('category').setValue(category.id);
    // }
    // if (marketProduct.product && marketProduct.product.product_subcategory) {
    //   const subcategory = this.subCategories.find(element => element.subcategory.id === marketProduct.product.product_subcategory);
    //   if (subcategory && subcategory.subcategory)
    //     this.validateForm.get('subcategory').setValue(subcategory.subcategory.id);
    // }
    this.validateForm.patchValue({
      minimalCount: marketProduct.minimal_count,
      minimalCountForBoard: marketProduct.minimal_count_for_board,
      minimumCountForOrder: marketProduct.minimum_count_for_order,
      maximumCountForOrder: marketProduct.maximum_count_for_order,
    });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleUserChange(marketProduct: MarketProduct): void {
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

  deleteMarketProduct(marketProduct: MarketProductItem, index: number): void {
    this.marketService
      .deleteMarketProduct(marketProduct.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.showSuccessMessage();
        this.listOfData.splice(index, 1);
        this.listOfData = [...this.listOfData];
        // this.calculateRedsCount();
      });
  }

  // calculateRedsCount(): void {    
  //   this.redsCount = 0;    
  //   this.listOfData.forEach(product => {      
  //     if (product.quantity < product.product.minimal_count) {
  //       this.redsCount += 1;
  //     }
  //   });
  // }

  onChangeProductCount(index: number): void {
    this.changingCountProductIndex = index;
    this.showChangeProductModal = true;
    this.changeCountControl.reset();
  }

  changeProductCount(): void {
    this.marketService.changeProductQuantity(
      this.listOfData[this.changingCountProductIndex].id,
      this.changeCountControl.value,
      null
    ).pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.showSuccessMessage();
        this.closeModal();
        this.listOfData[this.changingCountProductIndex].quantity += this.changeCountControl.value;

        this.getMarketProductsByCategory()
        // this.calculateRedsCount();
      }, () => {
        this.showFailMessage();
      });
  }

  public getProductTransactions(): void {
    this.loadingTransactions = true;
    this.marketService.getProductTransaction(this.listOfData[this.editingMarketProductIndex].id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.transactions = res;
        this.loadingTransactions = false;
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

  activeTabChange(event: NzTabChangeEvent): void {
    this.activeCategoryId = this.categories[event.index].id;
    this.activeSubcategoryIndex = undefined;
    this.getSubcategories();
    this.getMarketProductsByCategory();
    this.subCategoriesControl.reset();
  }

  toggleAddProductToExecutor(): void {
    this.showAddProductToExecutorModal = !this.showAddProductToExecutorModal;
  }

  transactionTabChange(event: NzTabChangeEvent): void {
    this.tabInex = event.index
    if (event.index === 1 && this.transactions?.length === 0) {
      this.getProductTransactions();
    }
  }

  nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    // this.getWarehouseBoards();    
    this.getMarketProductsByCategory()
  }

  boardWarehousePageIndexChange(pageIndex: number): void {
    this.boardPageindex = pageIndex;
  }
  openExecutorModal(data) {
    this.isShowExecutorModal = true;
    this.activeItem = data
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
