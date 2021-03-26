import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketProduct, MarketProductRequest, MarketsProduct } from 'src/app/core/models/market';
import { ServerResponce } from 'src/app/core/models/server-responce';
import {
  Category,
  ServiceRequest,
  ServiceResponse,
  Subcategory,
  SubcategoryRequest
} from '../../core/models/services';

@Injectable()
export class MarketsService {
  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('products/product-category/');
  }

  getSubCategoriesByCategory(categoryId: number): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>(`products/product-subcategories-by-category/${categoryId}/`);
  }

  getProductBySubcatery(subCategoryId: number, page?: number): Observable<ServerResponce<MarketsProduct[]>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    return this.httpClient.get<ServerResponce<MarketsProduct[]>>(`products/products-by-subcategory/${subCategoryId}/`, { params });

  }
  changeProductQuantity(productId: number, quantity: number): Observable<any> {
    return this.httpClient.post(`products/change-product-count/`, {
      product_id: productId,
      quantity
    });
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`products/product-category/`, category);
  }
  addSubcategory(subcategory: SubcategoryRequest): Observable<Subcategory> {
    return this.httpClient.post<Subcategory>(`products/product-subcategory/`, subcategory);
  }
  postMarketProduct(product: MarketProductRequest): Observable<any> {
    return this.httpClient.post<{}>(`products/product/`, product);
  }
  editCategory(category: Category, categoryId: number): Observable<Category> {
    return this.httpClient.put<Category>(`products/product-category/${categoryId}/`, category);
  }
  editSubcategory(subcategory: SubcategoryRequest, subcategoryId: number): Observable<Subcategory> {
    return this.httpClient.put<Subcategory>(`products/product-subcategory/${subcategoryId}/`, subcategory);
  }
  editMarketProduct(product: MarketProductRequest, id: number): Observable<any> {
    return this.httpClient.put(`products/product/${id}/`, product);
  }
  deleteSubCategory(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`products/product-subcategory/${id}/`);
  }

  deleteCategory(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`products/product-category/${id}/`);
  }
  deleteMarketProduct(id: number): Observable<{}> {
    return this.httpClient.delete(`products/product/${id}/`);
  }
}
