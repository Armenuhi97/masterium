import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ClientsService } from './clients.service';
import { Subject } from 'rxjs';
import { ClientList } from '../../core/models/user';

import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClientsComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject();
  public clients: ClientList[] = [];
  public pageSize = 10;
  public total: number;
  public pageIndex = 1;
  constructor(
    private _clientsService: ClientsService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._getClients();
  }

  public addClient(): void {
    this._router.navigate(['dashboard/clients/new']);
  }
  public changeStatus( data) {
    this._clientsService.changeExecutorStatus(data.user).pipe(takeUntil(this._unsubscribe$)).subscribe()
  }
  public editClient(id: number): void {
    this._router.navigate([`dashboard/clients/${id}`]);
  }

  private _getClients(): void {
    this._clientsService.getClients(this.pageIndex)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((clients) => {
        this.total = clients.count;
        this.clients = clients.results;
      });
  }

  public nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this._getClients();
  }

  public chatWithUser(user: ClientList): void {
    this._clientsService.chatWithUser(user.user)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((room: any) => {
        this._router.navigate([`dashboard/chat/`], { queryParams: { focusedUserId: room.id } });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
