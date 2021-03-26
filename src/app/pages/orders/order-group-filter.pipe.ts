import { Pipe, PipeTransform } from '@angular/core';
import {DragItemTypes, OrderSubgroupDragItem} from '../../core/models/order';

@Pipe({name: 'orderGroupFilter', pure: false})
export class OrderGroupFilterPipe implements PipeTransform {
  transform(value: any[], type: string): any[] {
    switch (type) {
      case DragItemTypes.Product:
        return value.filter(v => v.type === DragItemTypes.Product);
      case DragItemTypes.Service:
        return value.filter(v => v.type === DragItemTypes.Service);
      case DragItemTypes.Picture:
        return value.filter(v => v.type === DragItemTypes.Picture);
      default:
        return value;
    }
  }
}
