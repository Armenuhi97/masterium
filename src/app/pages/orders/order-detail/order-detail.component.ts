import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Messages } from '../../../core/models/messages';
import {
  AutocompleteOptionGroups,
  DragItemTypes,
  OrderDetail,
  OrderRequest,
  OrderSubgroupDragItem,
  SuborderExecutor,
} from '../../../core/models/order';
import { OrdersService } from '../orders.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AutocompleteItem } from '../../../core/models/utils';
import { User } from '../../../core/models/user';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  isEditEssenceItemVisible = false;
  order: OrderDetail;
  editGroupForm: FormGroup;
  essenceItemForm: FormGroup;
  isEditGroupVisible = false;
  editingGroupIndex: number;
  executors: User[] = [];
  id: number;
  dragListsFilter = new FormArray([]);
  subgroups: OrderSubgroupDragItem[];
  connectedTo: string[] = [];
  serviceSearchResult: AutocompleteOptionGroups[] = [];
  productSearchResult: AutocompleteItem[] = [];
  selectedExecutors: number[] = [];
  removedSuborders: number[] = [];
  loading = false;
  isSearching = false;
  timePickerProps = {
    nzFormat: 'HH:mm'
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private nzMessagesService: NzMessageService,
    private ordersService: OrdersService
  ) {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getOrderById(this.id);
    this.connectedTo.push('group-1', 'group-2', 'group-3');
  }

  ngOnInit(): void {
    this.getExecutors();

  }

  initEditGroupForm(index: number): void {
    let mainExecutor;
    if (this.subgroups[index].executors && this.subgroups[index].executors.length)
      if (this.subgroups[index].suborderMain?.id) {        
        this.selectedExecutors = this.subgroups[index].executors.map(ex => ex.user.user);
        mainExecutor = this.subgroups[index].executors?.find(e => e.is_overman)?.user.user
      } else {
        this.selectedExecutors = this.subgroups[index].executors.map(ex => ex.id);
        mainExecutor = this.subgroups[index].executors?.find(e => e.is_overman)?.id
      }


    this.editGroupForm = this.formBuilder.group({
      guarantee_period: [this.subgroups[index]?.suborderMain?.guarantee_period],
      comment: [this.subgroups[index]?.suborderMain?.comment || this.order.order.description, [Validators.required]],
      date: [
        this.subgroups[index]?.suborderMain?.start_date,
        [Validators.required],
      ],
      mainExecutor: [mainExecutor],
      index,
    });
  }

  initEssenceItemForm(): void {
    this.essenceItemForm = this.formBuilder.group({
      price: [1000, [Validators.required, Validators.min(0)]],
    });
  }

  getExecutors(): void {
    if (this.executors.length === 0) {
      this.ordersService
        .getExecutors()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((executors) => {
          this.executors = executors.results;
        });
    }
  }

  getOrderById(id: number): void {
    this.ordersService
      .getOrderById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((order) => {
        this.subgroups = [
          {
            groupItemList: order.subservices.map((subservice: any) => ({
              type: DragItemTypes.Service,
              name: subservice.service_name_ru,
              subservice: subservice.subservice_name_ru,
              currentPrice: subservice.current_price,
              serviceId: subservice.service_id,
              subserviceId: subservice.subserv,
              discountPrice: subservice.real_price,
            })),
            id: 'group-1',
            name: 'Сервисы',
            isEditing: false
          },
          {
            groupItemList: order.product.map((product: any) => ({
              type: DragItemTypes.Product,
              name: product.name_ru,
              id: product.id,
              currentPrice: product.current_price,
              realPrice: product.real_price,
              quantity: product.quantity,
            })),
            id: 'group-2',
            name: 'Продукт',
            isEditing: false
          },
          {
            groupItemList: order.description_image.map((image) => ({
              type: DragItemTypes.Picture,
              id: image.id,
              url: image.image_url,
            })),
            id: 'group-3',
            name: 'Картинки',
            isEditing: false
          },
        ];
        order.suborder.forEach((sub) => {
          this.addGroup(false, order);
          sub.products.forEach((product: any) => {
            this.subgroups[this.subgroups.length - 1].groupItemList.push({
              type: DragItemTypes.Product,
              name: product.product.name[0].value,
              id: product.product.id,
              currentPrice: product.current_price,
              realPrice: product.real_price,
              quantity: product.quantity,
            });
          });
          sub.subservice.forEach((service: any) => {
            this.subgroups[this.subgroups.length - 1].groupItemList.push({
              type: DragItemTypes.Service,
              name: service.subservice.service.name_ru,
              subservice: service.subservice.subservice_type[0].value,
              currentPrice: service.current_price,
              serviceId: service.id,
              subserviceId: service.subservice.id,
              discountPrice: service.real_price,
            });
          });
          sub.suborder.description_image.forEach((image: any) => {
            this.subgroups[this.subgroups.length - 1].groupItemList.push({
              type: DragItemTypes.Picture,
              id: image.id,
              url: image.image_url,
            });
          });
        console.log(sub);
        
          
          this.subgroups[this.subgroups.length - 1].suborderMain = sub.suborder;
          this.subgroups[this.subgroups.length - 1].executors = sub.executor;
          this.subgroups[this.subgroups.length - 1].status = sub.suborder.status.name_ru;
          this.subgroups[this.subgroups.length - 1].disput = sub.disput;
          this.subgroups.map(o => o.isEditing = false);
        });
        this.order = order;
      });
  }

  onEditGroupSave(): void {
    if (this.editGroupForm.invalid) {
      this.nzMessagesService.error(Messages.failValidation);
      return;
    }
    const formValue = this.editGroupForm.value;
    this.subgroups[formValue.index].suborderMain = {
      ...this.subgroups[formValue.index].suborderMain,
      start_date: formValue.date,
      comment: formValue.comment,
      guarantee_period: formValue.guarantee_period
    };
    if (this.selectedExecutors) {
      this.subgroups[formValue.index].executors = this.selectedExecutors.map(
        (executor) => {
          return {
            is_overman: executor === formValue.mainExecutor,
            id: executor,
          } as SuborderExecutor;
        }
      );
    } else {
      this.subgroups[formValue.index].executors = [];
      this.selectedExecutors = [];
    }

    this.handleEditGroupCancel();
  }

  onEssenceItemSave(): void {
    if (this.essenceItemForm.invalid) {
      this.nzMessagesService.error(Messages.failValidation);
      return;
    }
  }

  handleEditGroupCancel(): void {
    this.editGroupForm.reset();
    this.selectedExecutors = [];
    this.isEditGroupVisible = false;
  }

  handleEssenceItemCancel(): void {
    this.isEditEssenceItemVisible = false;
  }

  editGroup(index: number): void {
    this.initEditGroupForm(index);
    this.isEditGroupVisible = true;
    this.editingGroupIndex = index;
  }

  addGroup(isEditing: boolean, order?): void {
    this.subgroups.map(order => order.isEditing = false);
    const newItem: OrderSubgroupDragItem = {
      id: `group-${this.subgroups.length + 1}`,
      name: `Заказ N ${this.order ? this.order.order.order_number : order.order.order_number}/${this.subgroups.slice(3).length + 1}`,
      groupItemList: [],
      suborderMain: null,
      isEditing,
    };
    this.dragListsFilter.push(new FormControl('all'));
    this.subgroups.push(newItem);
    this.connectedTo.push(newItem.id);
  }

  editSubgroupItem(subgroup: OrderSubgroupDragItem, index: number): void {
    this.initEssenceItemForm();
    this.isEditEssenceItemVisible = true;
  }

  addServiceItem(event: {
    service: AutocompleteOptionGroups;
    subservice: AutocompleteOptionGroups;
  }): void {
    
    this.subgroups[0].groupItemList.push({
      type: DragItemTypes.Service,
      name: event.service.title,
      subservice: event.subservice.title,
      currentPrice: event.subservice.discountPrice,
      serviceId: event.service.id,
      subserviceId: event.subservice.id,
      discountPrice: event.subservice.discountPrice,
    });
  }

  addProductItem(item: AutocompleteItem): void {    
    this.subgroups[1].groupItemList.push({
      type: DragItemTypes.Product,
      name: item.label,
      id: item.id,
      currentPrice: item.current_price,
      realPrice: item.real_price,
      quantity: item.quantity,
    });
  }

  drop(
    event: CdkDragDrop<{ name: string; type: string }[]>,
    item: OrderSubgroupDragItem
  ): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  deleteDragItemFromGroup(
    subgroup: OrderSubgroupDragItem,
    subgroupItem: { name: string; type: string },
    position: number
  ): void {
    let index: number;
    if (subgroupItem.type === DragItemTypes.Service) {
      index = this.subgroups.findIndex((sub) => sub.id === 'group-1');
    }
    if (subgroupItem.type === DragItemTypes.Product) {
      index = this.subgroups.findIndex((sub) => sub.id === 'group-2');
    }
    if (subgroupItem.type === DragItemTypes.Picture) {
      index = this.subgroups.findIndex((sub) => sub.id === 'group-3');
    }
    subgroup.groupItemList.splice(position, 1);
    this.subgroups[index].groupItemList.unshift(subgroupItem);
  }

  searchForServices(term: string): void {    
    if (term === '') {
      term = ' ';
    }
    this.isSearching = true;
    this.ordersService
      .searchForServices(term)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.serviceSearchResult = result.map((r) => {
          const autocompleteOptionGroups: AutocompleteOptionGroups = {
            children: r.subservices.map((sub) => {
              return {
                title: sub.subservice.subservice_type[0].value,
                price: sub.subservice.price,
                discountPrice: sub.discounted_price,
                id: sub.subservice.id,
              };
            }),
            title: r.name_ru,
            id: r.service.id,
          };
          
          this.isSearching = false;
          return autocompleteOptionGroups;
        });
      });
  }

  searchForProducts(term: string): void {
    
    if (term === '') {
      term = ' ';
    }
    this.isSearching = true;
    this.ordersService
      .searchForProducts(term)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.productSearchResult = result.map((r) => {
          return {
            id: r.product.id,
            label: r.name_ru,
            real_price: r.discounted_price,
            current_price: r.discounted_price,
            quantity: 1,
          };
        });
        this.isSearching = false;
      });
  }

  onSaveOrder(): void {
    if (
      !this.subgroups
        .slice(3)
        .every((element) => element.suborderMain?.start_date)
    ) {
      this.nzMessagesService.error('Пожалуйста назначьте дату начала заказа');
      return;
    }
    const sendingData: OrderRequest = {
      order_id: this.id,
      removed_suborders: this.removedSuborders.map((id) => {
        return {
          id,
        };
      }),
      suborders: this.subgroups.slice(3).map((suborder) => {
        return {
          description_image: suborder.groupItemList
            .filter((item) => item.type === DragItemTypes.Picture)
            .map((groupItemListItem) => {
              return {
                id: groupItemListItem.id,
              };
            }),
          executor: suborder.executors.map((executor) => {
            return {
              executor_id: executor.user ? executor.user.user : executor.id,
              is_overman: executor.is_overman
            };
          }),
          order_subservices: suborder.groupItemList
            .filter((item) => item.type === DragItemTypes.Service)
            .map((groupItemListItem) => {
              return {
                subservice_id: groupItemListItem.subserviceId,
                real_price: groupItemListItem.discountPrice,
                current_price: groupItemListItem.currentPrice,
              };
            }),
          product: suborder.groupItemList
            .filter((item) => item.type === DragItemTypes.Product)
            .map((groupItemListItem) => {              
              return {
                product_id: groupItemListItem.id,
                quantity: groupItemListItem.quantity,
                real_price: groupItemListItem.realPrice,
                current_price: groupItemListItem.currentPrice,
              };
            }),
            
          suborder: {
            // this.subgroups[index] 
            comment: suborder.suborderMain.comment,
            guarantee_period: suborder.suborderMain.guarantee_period,
            start_date: suborder.suborderMain?.start_date,
            suborder_name: '',
            suborder_id: suborder.suborderMain?.id || null,
            products_price: suborder.groupItemList
              .filter((item) => item.type === DragItemTypes.Product)
              .reduce(
                (accumulator, item) =>
                  accumulator + item.currentPrice * item.quantity,
                0
              ),
            services_price: suborder.groupItemList
              .filter((item) => item.type === DragItemTypes.Service)
              .reduce(
                (accumulator, item) => accumulator + item.currentPrice,
                0
              ),
          },
        };
      }),
    };
    this.loading = true;
    this.ordersService
      .editSuborder(sendingData)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.getOrderById(this.id);
        this.removedSuborders = [];
      });
  }

  executorsChange(selectedExecutors: User[]): void {
    let isMainUserDeleted = true;
    selectedExecutors.forEach((executor) => {
      if (executor === this.editGroupForm.get('mainExecutor').value) {
        isMainUserDeleted = false;
      }
    });
    if (isMainUserDeleted) {
      this.editGroupForm.get('mainExecutor').setValue('');
    }
  }

  noReturnPredicate(): boolean {
    return false;
  }

  disabledStartDate = (startValue: Date): boolean => {
    return startValue.getTime() < Date.now() - 86400000;
  }

  getExecutorNameById(id: number): string {
    const executor = this.executors.filter(
      ex => ex.user.user === id
    )[0];
    return executor?.user.first_name + ' ' + executor?.user.last_name;
  }

  deleteGroup(index: number): void {
    const group = this.subgroups[index];
    if (group?.suborderMain?.id) {
      // this.removedSuborders.push(group.suborderMain.id);
    }
    this.subgroups.splice(index, 1);
  }

  setPendingOrder(): void {
    this.ordersService
      .setPendingOrder(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getOrderById(this.id);
      });
  }

  cancelOrder(): void {
    this.ordersService
      .cancelOrder(this.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getOrderById(this.id);
      });
  }

  getGroupPrice(item: OrderSubgroupDragItem): number {
    let price = 0;
    item.groupItemList.forEach((groupItem) => {
      if (groupItem.currentPrice) {
        groupItem.quantity
          ? (price += groupItem.currentPrice * groupItem.quantity)
          : (price += groupItem.currentPrice);
      }
    });
    return price;
  }

  public handleEditSuborder(suborder: OrderSubgroupDragItem): void {
    const index = this.subgroups.findIndex(element => element.suborderMain?.id === suborder.suborderMain?.id);
    if (index > -1) {
      this.subgroups.map(order => order.isEditing = false);
      this.subgroups = this.subgroups.filter(order => order.suborderMain !== null);

    }
    this.subgroups[index].isEditing = true;
  }

  get isAddSubgroupVisible(): boolean {
    const items = this.subgroups.filter((item) => !item.suborderMain?.id);
    return items.length < 4;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
