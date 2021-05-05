import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServicesService } from './services.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Category,
  ServiceRequest,
  ServiceResponse,
  Subcategory,
  SubcategoryRequest,
  SubserviceRequest,
  SubserviceResponse
} from '../../core/models/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Messages } from '../../core/models/messages';
import { MainService } from '../../core/services/main.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();
  showClosedHoursList:boolean=false;
  activeSubserviceId:number;
  categories = [];
  subCategories: Subcategory[] = [];
  services: ServiceResponse[] = [];
  subservices: SubserviceResponse[];
  activeCategory: Category;
  activeSubcategory: Subcategory;
  activeCategoryIndex: number;
  activeSubcategoryIndex: number;
  activeServiceIndex: number;
  activeSubServiceIndex: number;
  showCategoryActions = false;
  showSubcategoryActions = false;
  showServiceActions = false;
  showSubserviceActions = false;
  isEditing = false;
  constructor(
    private servicesService: ServicesService,
    private messagesService: NzMessageService,
    private mainService: MainService,
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.servicesService.getAllCategories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(categories => {
        this.categories = categories;
        this.subCategories = [];
        this.services = [];
      });
  }

  getSubservicesByService(service: ServiceResponse, index: number): void {
    this.activeServiceIndex = index;
    this.servicesService.getSubservicesByService(service.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {        
        this.subservices = res;
      });
  }

  getSubCategoriesByCategory(category: Category, index: number): void {
    this.activeCategory = category;
    this.activeCategoryIndex = index;
    this.activeSubcategory = null;
    this.activeSubServiceIndex = undefined;
    this.activeServiceIndex = undefined;
    this.servicesService.getSubCategoriesByCategory(category.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(subcategories => {
        this.services = [];
        this.subCategories = subcategories;
      });
  }

  getServicesBySubcategory(subcategory: Subcategory, index: number): void {
    this.activeSubcategory = subcategory;
    this.activeSubcategoryIndex = index;
    this.activeSubServiceIndex = undefined;
    this.activeServiceIndex = undefined;
    this.servicesService.getServicesBySubcategory(subcategory.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(services => {
        this.services = services;
      });
  }

  hideCategoryActions(): void {
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
    this.showSubserviceActions = false;
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

  onEditSubservice(): void {
    this.isEditing = true;
    this.showSubserviceActions = true;
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

  onAddSubservice(): void {
    this.showSubserviceActions = true;
    this.isEditing = false;
  }

  handleCategoryChange(category: any): void {
    const sendingData: Category = {
      // category: {
      //   color: category.color,
      //   icon: category.icon,
      //   translation_key: this.isEditing ? this.activeCategory.translation_key : 'cat___title___' + String(Date.now()),
      //   translation_key_description: this.isEditing ?
      //     this.activeCategory.translation_key_description : 'cat___desc___' + String(Date.now())
      // },
      // category:{
      color: category.color,
      icon: category.icon,
      // },
      name_en: category.english,
      name_ge: category.georgian,
      name_ru: category.russian,
      description_en: category.englishDescription,
      description_ge: category.georgianDescription,
      description_ru: category.russianDescription,

    };
    if (this.isEditing) {
      if (typeof category.icon === 'string') {
        this.servicesService.editCategory(sendingData, this.activeCategory.id)
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
              sendingData.icon = res.url;
              return this.servicesService.editCategory(sendingData, this.activeCategory.id);
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
            sendingData.icon = res.url;
            return this.servicesService.addCategory(sendingData);
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
      // subcategory: {
      //   translation_key_title: this.isEditing ? this.activeSubcategory.translation_key_title : String(Date.now()),
      //   only_for_product: 0,
      //   icon: event.icon,
      //   category: this.activeCategory.id,
      //   is_popular: event.isPopular
      // },
      only_for_product: 0,
      icon: event.icon,
      category: this.activeCategory.id,
      is_popular: event.isPopular,
      name_en: event.english,
      name_ge: event.georgian,
      name_ru: event.russian
    };
    if (this.isEditing) {
      if (typeof event.icon === 'string') {
        this.servicesService.editSubcategory(sendingData, this.activeSubcategory.id)
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
              sendingData.icon = res.url;
              return this.servicesService.editSubcategory(sendingData, this.activeSubcategory.id);
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
            sendingData.icon = res.url;
            return this.servicesService.addSubcategory(sendingData);
          }))
        .subscribe(res => {
          this.subCategories.push(res);
          this.actionsAfterSuccessfullAction();
        }, () => {
          this.actionsAfterFailAction();
        });
    }
  }
  openClosedHoursModal(id:number){
    this.showClosedHoursList=true;
    this.activeSubserviceId=id
   
  }
  closeSubserviceClosedHours(){
    this.showClosedHoursList=false
  }
  handleSubserviceChange(event): void {
    const sendingData: SubserviceRequest = {
      service_id: this.services[this.activeServiceIndex].id,
      subservices: []
    };        
    sendingData.subservices = event.items.map((item) => {
      return {
        service: this.services[this.activeServiceIndex].id,
        subservice_type: item.id,
        price: item.price,
        measurement_type: item.measurementType,
        guarantee_day_count: item.guaranteeDays
      };
    });
    if (this.isEditing) {
      this.servicesService.editSubservice(sendingData, this.services[this.activeServiceIndex].id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.actionsAfterSuccessfullAction();
          this.subservices = res;
        }, () => {
          this.actionsAfterFailAction();
        });
    } else {
      this.servicesService.addSubservice(sendingData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.actionsAfterSuccessfullAction();
          this.subservices = res;
        }, () => {
          this.actionsAfterFailAction();
        });
    }
  }
  // tslint:disable-next-line:typedef
  handleServiceChange(event: any) {
    const sendingData: ServiceRequest = {
      // service: {
        subcategory: this.activeSubcategory.id,
      //   translation_key_description: this.isEditing ? this.services[this.activeServiceIndex].service.translation_key_description : 'translation_key_description' + String(Date.now()),
      //   translation_key_title: this.isEditing ? this.services[this.activeServiceIndex].service.translation_key_title : 'translation_key_title' + String(Date.now()),
      // },
      name_en: event.english,
      name_ge: event.georgian,
      name_ru: event.russian,
      description_en: event.englishDescription,
      description_ge: event.georgianDescription,
      description_ru: event.russianDescription      
    };
    if (typeof event.icon === 'string') {
      sendingData.icon = event.icon;
      this.sendRequest(sendingData);
    } else {
      this.mainService.uploadFile(event.icon)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((response) => {
          sendingData.icon = response.url;
          this.sendRequest(sendingData);
        });
    }
  }


  sendRequest(sendingData): void {
    if (this.isEditing) {
      this.servicesService.editService(sendingData, this.services[this.activeServiceIndex].id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.services[this.activeServiceIndex] = res;
          this.actionsAfterSuccessfullAction();
        }, () => {
          this.actionsAfterFailAction();
        });
    } else {
      this.servicesService.addService(sendingData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
          this.services.push(res);
          this.actionsAfterSuccessfullAction();
        }, () => {
          this.actionsAfterFailAction();
        });
    }
  }
  deleteCategory(id: number, index: number): void {
    this.servicesService.deleteCategory(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.categories.splice(index, 1);
        this.activeCategoryIndex = undefined;
        this.subCategories = [];
      });
  }

  deleteSubcategory(id: number, index: number): void {
    this.servicesService.deleteSubCategory(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.subCategories.splice(index, 1);
        this.activeSubcategoryIndex = undefined;
        this.services = [];
      });
  }

  deleteService(id: number, index: number): void {
    this.servicesService.deleteService(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.services.splice(index, 1);
        this.subservices = [];
        this.activeServiceIndex = undefined;
      });
  }

  actionsAfterSuccessfullAction(): void {
    this.messagesService.success(Messages.success);
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
    this.showSubserviceActions = false;
  }

  actionsAfterFailAction(): void {
    this.messagesService.error(Messages.fail);
    this.showCategoryActions = false;
    this.showSubcategoryActions = false;
    this.showServiceActions = false;
    this.showSubserviceActions = false;
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
