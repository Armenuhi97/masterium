import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {
  User,
} from '../../core/models/user';
import {
  Subject
} from 'rxjs';
import {
  ExecutorsService
} from './executors.service';
import {
  takeUntil
} from 'rxjs/operators';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-executors',
  templateUrl: './executors.component.html',
  styleUrls: ['./executors.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExecutorsComponent implements OnInit, OnDestroy {
  private _unsubscribe$ = new Subject();
  public pageSize: number = 10;
  public total: number;
  public executors: User[] = [];
  public pageIndex = 1;

  constructor(
    private _router: Router,
    private _executorsService: ExecutorsService,
  ) { }

  ngOnInit(): void {
    this.getExecutors();
  }

  public addExecutor(): void {
    this._router.navigate(['dashboard/executors/new']);
  }

  public editExecutor(id: number): void {
    this._router.navigate([`dashboard/executors/${id}`]);
  }
  public changeStatus( data) {
    this._executorsService.changeExecutorStatus(data.user.user).pipe(takeUntil(this._unsubscribe$)).subscribe()
  }
  public getExecutors(): void {
    this._executorsService
      .getExecutors(this.pageIndex)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((executors) => {
        this.total = executors.count;
        this.executors = executors.results;
      });
  }


  public nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getExecutors();
  }

  public chatWithUser(user: User): void {
    this._executorsService.chatWithUser(user.user.user)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((room: any) => {
        // , token: '2d7497064f6a366cc825b3cc56d1a7dd1a42c3c3'
        this._router.navigate([`dashboard/chat/`], { queryParams: { focusedRoomId: room.id } });
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}
