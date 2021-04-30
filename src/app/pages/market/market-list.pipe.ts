import { Pipe, PipeTransform } from '@angular/core';
import { MarketsProduct} from '../../core/models/market';

@Pipe({name: 'marketList'})
export class MarketListPipe implements PipeTransform {
  transform(value: MarketsProduct[], state?: string): MarketsProduct[] {
    switch (state){
      case 'all':
        return value;
      case 'showReds':
        return value.filter(v => v.quantity < v.minimal_count);
      case 'showBlues':
        return value.filter(v => v.quantity > v.minimal_count);
    }
  }
}
