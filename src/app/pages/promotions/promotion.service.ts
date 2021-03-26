import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Subcategory} from '../../core/models/services';
import {Promotion} from '../../core/models/promotion';

@Injectable()
export class PromotionService {

  constructor(private httpClient: HttpClient) { }

  getPromotions(): Observable<Promotion[]> {
    return this.httpClient.get<Promotion[]>('advertisements/sale/');
  }

  getAllSubcategories(): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>('services/subcategory/');
  }

  getAllProductsSubcategories(): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>('products/product-subcategory/');
  }

  addPromotion(promotion: Promotion): Observable<Promotion[]> {
    return this.httpClient.post<Promotion[]>('advertisements/sale/', promotion);
  }

  editPromotion(promotion: Promotion): Observable<Promotion> {
    return this.httpClient.put<Promotion>(`advertisements/sale/${promotion.sale.id}/`, promotion);
  }

  deletePromotion(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`advertisements/sale/${id}/`);
  }
}
