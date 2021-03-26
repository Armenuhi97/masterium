import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FinancesService } from 'src/app/core/api-services/finances.service';
import { MarketProduct } from 'src/app/core/models/market';

@Component({
  selector: 'app-finances-products',
  templateUrl: './finances-products.component.html',
  styleUrls: ['./finances-products.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancesProductsComponent implements OnInit {
  public products$: Observable<MarketProduct[]>;
  public pageSize: number = 10;
  public totalCount: number;
  public pageIndex: number = 1;

  constructor(private _financesService: FinancesService) { }

  ngOnInit(): void {
    this._getProducts();
  }

  private _getProducts(): void {
    this.products$ = this._financesService.getProducts(this.pageIndex).pipe(
      map(products => {
        this.totalCount = products.count;
        return products.results;
      })
    );
  }

  public pageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this._getProducts();
  }
}
