import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EssenceType, EssenceTypes } from 'src/app/core/models/essence';
import { Messages } from '../../core/models/messages';
import { UtilsService } from './utils.service';
import { EssenceItem } from '../../core/models/utils';

@Component({
  selector: 'app-utils',
  templateUrl: './utils.component.html',
  styleUrls: ['./utils.component.scss']
})
export class UtilsComponent implements OnInit, OnDestroy {
  banks: EssenceItem[] = [];
  helps: EssenceItem[] = [];
  measurementTypes: EssenceItem[] = [];
  specializations: EssenceItem[] = [];
  subserviceTypes: EssenceItem[] = [];
  userAttachmentTypes: EssenceItem[] = [];
  unsubscribe$ = new Subject();
  essenceList: any[] = [];
  constructor(
    public utilsService: UtilsService,
    public message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.getAllEssenceTypes();
  }

  initEssenceList(): void {

    this.essenceList = [
      {
        buttonLabel: 'Добавить помощь',
        essenceLabel: 'Помощь',
        inputLabel: 'Введите название помощи',
        itemsList: this.helps,
        type: EssenceType.help
      },
      {
        buttonLabel: 'Добавить единицу измерения',
        essenceLabel: 'Единица измерения',
        inputLabel: 'Введите единицу измерения',
        itemsList: this.measurementTypes,
        type: EssenceType.measurementType
      },
      {
        buttonLabel: 'Добавить инструмент',
        essenceLabel: 'Инструменты',
        inputLabel: 'Введите инструмент',
        itemsList: this.specializations,
        type: EssenceType.specialization
      },
      {
        buttonLabel: 'Добавить подсервис',
        essenceLabel: 'Подсервис',
        inputLabel: 'Введите подсервис',
        itemsList: this.subserviceTypes,
        type: EssenceType.subserviceType
      },
      {
        buttonLabel: 'Добавить тип документов',
        essenceLabel: 'Типы документов',
        inputLabel: 'Введите тип документов',
        itemsList: this.userAttachmentTypes,
        type: EssenceType.userAttachmentType
      },
      {
        buttonLabel: 'Добавить банк',
        essenceLabel: 'Банк',
        inputLabel: '',
        itemsList: this.banks,
        type: EssenceType.bank
      },
    ];

  }

  addEssenceItem(event: { essenceType: string, essenceValue: EssenceItem }): void {
    this.utilsService.postEssenceItem(event.essenceType, event.essenceValue)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        let item = this.essenceList.filter((data) => { return data.type == event.essenceType });
        if (item && item.length) {
          item[0].itemsList.push(value)
          // filter((data)=>{return data.id == event.id})
        }
        // this.showSuccesMessageAndUpdateData();
      }, () => {
        this.showFailMessage();
      });
  }

  deleteEssenceItem(event: { type: string, id: number }): void {
    this.utilsService.deleteEssenceItem(event.type, event.id)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        let item = this.essenceList.filter((data) => { return data.type == event.type });
        if (item && item.length) {
          let value = item[0].itemsList.filter((data) => { return data.id == event.id });
          if (value && value[0]) {
            let index = item[0].itemsList.indexOf(value[0]);
            item[0].itemsList.splice(index, 1)
          }
        }
      }, () => {
        this.showFailMessage();
      });

  }

  editEssenceItem(event: { essenceType: string, essenceValue: any, id: number }): void {

    this.utilsService.editEssenceItem(event.essenceType, event.essenceValue, event.id)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        let item = this.essenceList.filter((el) => { return el.type == event.essenceType });
        if (item && item.length) {
          let value = item[0].itemsList.filter((el) => { return el.id == event.id });
          if (value && value[0]) {
            let index = item[0].itemsList.indexOf(value[0])
            item[0].itemsList[index] = data
          }
        }
        // this.showSuccesMessageAndUpdateData();
      }, () => {
        this.showFailMessage();
      });
  }

  showFailMessage(): void {
    this.message.create('error', Messages.fail);
  }

  showSuccesMessageAndUpdateData(): void {
    this.message.create('success', Messages.success);
    this.getAllEssenceTypes();
  }

  getAllEssenceTypes(): void {
    forkJoin([
      this.getHelps(),
      this.getMeasurementTypes(),
      this.getSpecializations(),
      this.getSubservices(),
      this.getUserAttachmentTypes(),
      this.getBanks()
    ]).pipe(takeUntil(this.unsubscribe$)).subscribe(results => {
      this.helps = results[0];
      this.measurementTypes = results[1];
      this.specializations = results[2];
      this.subserviceTypes = results[3];
      this.userAttachmentTypes = results[4];
      this.banks = results[5];
      console.log(this.banks);
      
      this.initEssenceList();
    });
  }

  getHelps(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.help);
  }

  getMeasurementTypes(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.measurementType);
  }

  getSpecializations(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.specialization);
  }

  getSubservices(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.subserviceType);
  }

  getUserAttachmentTypes(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.userAttachmentType);
  }
  getBanks(): Observable<EssenceItem[]> {
    return this.utilsService.getEssence(EssenceType.bank);
  }
  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
