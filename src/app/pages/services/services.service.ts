import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Category,
  ServiceRequest,
  ServiceResponse,
  Subcategory,
  SubcategoryRequest, SubserviceRequest,
  SubserviceResponse,
  SubserviceType
} from '../../core/models/services';
import { ClosedHoursResponce } from 'src/app/core/models/closed-hours';

@Injectable()
export class ServicesService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>('services/category/');
  }

  getSubCategoriesByCategory(categoryId: number): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>(`services/subcategories-by-category/${categoryId}/`);
  }

  getServicesBySubcategory(subcategoryId: number): Observable<ServiceResponse[]> {
    return this.httpClient.get<ServiceResponse[]>(`services/services-by-subcategory/${subcategoryId}/`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`services/category/`, category);
  }

  editCategory(category: Category, categoryId: number): Observable<Category> {
    return this.httpClient.put<Category>(`services/category/${categoryId}/`, category);
  }

  addSubcategory(subcategory: SubcategoryRequest): Observable<Subcategory> {
    return this.httpClient.post<Subcategory>(`services/subcategory/`, subcategory);
  }

  editSubcategory(subcategory: SubcategoryRequest, subcategoryId: number): Observable<Subcategory> {
    return this.httpClient.put<Subcategory>(`services/subcategory/${subcategoryId}/`, subcategory);
  }

  deleteSubCategory(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`services/subcategory/${id}/`);
  }

  deleteCategory(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`services/category/${id}/`);
  }

  addService(service: ServiceRequest): Observable<ServiceResponse> {
    return this.httpClient.post<ServiceResponse>(`services/service/`, service);
  }

  editService(service: ServiceRequest, serviceId: number): Observable<ServiceResponse> {
    return this.httpClient.put<ServiceResponse>(`services/service/${serviceId}/`, service);
  }

  deleteService(id: number): Observable<{}> {
    return this.httpClient.delete<{}>(`services/service/${id}/`);
  }

  getSubservicesByService(id: number): Observable<SubserviceResponse[]> {
    return this.httpClient.get<SubserviceResponse[]>(`services/subservices-by-service/${id}/`);
  }

  getSubserviceTypes(): Observable<SubserviceType[]> {
    return this.httpClient.get<SubserviceType[]>('utils/subservice-type/');
  }

  deleteSubService(id: number): Observable<{}> {
    return this.httpClient.post<{}>(`services/delete-service-subservices/${id}/`,{});
  }
  editSubservice(id: number,body){
    return this.httpClient.post(`services/edit-service-subservices/${id}/`,body);
  } 
  addSubservice(serviceId: number,body:SubserviceRequest) {
    return this.httpClient.post(`services/add-service-subservices/${serviceId}/`,body);
  }
  // addSubservice(subservice: SubserviceRequest): Observable<SubserviceResponse[]> {
  //   return this.httpClient.post<SubserviceResponse[]>(`services/subservice/`, subservice);
  // }

  // editSubservice(subservice: SubserviceRequest, id: number): Observable<SubserviceResponse[]> {
  //   return this.httpClient.post<SubserviceResponse[]>(`services/edit-service-subservices/${id}/`, subservice);
  // }
  getSubserviceClosedHours(id: number, page: number) {
    return this.httpClient.get(`services/closed-hour/?subservice=${id}&page=${page}`)
  }
  addClosedHours(body: ClosedHoursResponce) {
    return this.httpClient.post('services/closed-hour/', body)
  }
  deleteClosedHours(id: number) {
    return this.httpClient.delete(`services/closed-hour/${id}/`)
  }
}
