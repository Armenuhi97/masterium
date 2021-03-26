import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddProductToExecutorRequest, MarketProduct, Transaction, WarehouseRequest } from 'src/app/core/models/market';
import { Category, ServiceResponse, Subcategory } from '../../core/models/services';
import { ServerResponce } from 'src/app/core/models/server-responce';

@Injectable()
export class MarketService {

  constructor(private httpClient: HttpClient) { }

  public getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('products/product-category/');
  }

  public getSubCategoriesByCategory(categoryId: number): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>(`products/product-subcategories-by-category/${categoryId}/`);
  }

  public getServiceByCategory(categoryId: number): Observable<ServiceResponse[]> {
    return this.httpClient.get<ServiceResponse[]>(`services/services-by-category/${categoryId}/`);
  }

  public getWarehouseBoards(page: number, offset: number): Observable<ServerResponce<any[]>> {
    return this.httpClient.get<ServerResponce<any[]>>(`products/get-minimal-passed-board-item/?limit=10&offset=${offset}&page=1`);
  }

  // public getProducts(categoryId: number, subcategoryId: number): Observable<MarketProduct[]> {
  //   return this.httpClient.get<MarketProduct[]>(`api/products/product/?category=${categoryId}&subcategory=${subcategoryId}`);
  // }

  // public getProductsByCategory(page: number, categoryId: number): Observable<ServerResponce<MarketProduct[]>> {
  //   let params = new HttpParams();
  //   params = params.append('page', page.toString());
  //   return this.httpClient.get<ServerResponce<MarketProduct[]>>(`products/products-by-category/${categoryId}/`, { params });
  // }

  public getProductsBySubcategory(subcategoryId: number): Observable<MarketProduct[]> {
    return this.httpClient.get<MarketProduct[]>(`products/products-by-subcategory/${subcategoryId}/`);
  }

  public postMarketProduct(marketProduct: WarehouseRequest): Observable<{}> {
    return this.httpClient.post<{}>(`products/product/`, marketProduct);
  }

  public editMarketProduct(marketProduct: WarehouseRequest, id: number): Observable<{}> {
    return this.httpClient.put<{}>(`products/product/${id}/`, marketProduct);
  }

  public deleteMarketProduct(marketProductId: number): Observable<{}> {
    return this.httpClient.delete<{}>(`products/product/${marketProductId}/`);
  }

  public changeProductQuantity(productId: number, quantity: number, order: string): Observable<{}> {
    return this.httpClient.post<{}>('products/product-transaction/', { product: productId, quantity, order });
  }

  public getProductTransaction(productId: number): Observable<Transaction[]> {
    return this.httpClient.get<Transaction[]>(`products/get-product-transaction/${productId}/`);
  }

  public addProductToExecutor(sendingData: AddProductToExecutorRequest, boardId: number): Observable<{}> {
    return this.httpClient.post<{}>(`products/change-board-item-count/${boardId}/`, sendingData);
  }
  public getProductsByCategory(page: number, categoryId: number, subCategoryId?: number | string, color?: string): Observable<ServerResponce<MarketProduct>> {
    let url = `products/product/?product_subcategory__product_category=${categoryId}&page=${page}`
    if (color && color !== 'all') {
      url += `&filter_by=${color}`
    }
    if (subCategoryId && subCategoryId !== 'all') {
      url += `&product_subcategory=${subCategoryId}`
    }
    return this.httpClient.get<ServerResponce<MarketProduct>>(url)
  }
}
