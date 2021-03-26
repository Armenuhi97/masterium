import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Subject } from 'rxjs';
import { Messages } from 'src/app/core/models/messages';
import { User } from 'src/app/core/models/user';
// import { UsersService } from './users.service';

interface ColumnItem {
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  unsubscribe$ = new Subject();
  validateForm: FormGroup;
  initialValues: User;
  user: User;
  isVisible = false;
  isEditing = false;
  listOfData = [];
  userTypeId: number;

  cityColumn: ColumnItem = {
    sortOrder: null,
    sortFn: (a: any, b: any) =>
      a.showCity.title.localeCompare(b.showCity.title),
    sortDirections: ['ascend', 'descend', null],
  };
  taskCountColumn: ColumnItem = {
    sortOrder: 'descend',
    sortFn: (a: any, b: any) => a.successTaskCount - b.successTaskCount,
    sortDirections: ['descend', null],
  };

  constructor(
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    // public usersService: UsersService,
    public message: NzMessageService
  ) {
    this.subscribeToQueryChanges();
  }

  ngOnInit(): void {
    this.initForm();
  }

  subscribeToQueryChanges(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      // this.userTypeId = Number(params['userType']);
      this.getUsersByType();
    });
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  onUserSave(): void {
    this.isEditing ? this.editUser() : this.addUser();
  }

  getUsersByType(): void {
    // this.usersService
    //   .getUsers(this.userTypeId)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((response) => {
    //     this.listOfData = response;
    //     this.listOfData = [...this.listOfData];
    //   });
  }

  deleteUser(user: User): void {
    // this.usersService
    //   .deleteUser(user.user)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     switchMap(() => {
    //       this.showSuccessMessage();
    //       return this.usersService.getUsers(this.userTypeId);
    //     })
    //   )
    //   .subscribe((response) => {
    //     this.listOfData = response;
    //     this.listOfData = [...this.listOfData];
    //   });
  }

  addUser(): void {
    // this.usersService
    //   .addUser(this.user)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     switchMap(() => {
    //       this.showSuccessMessage();
    //       return this.usersService.getUsers(this.userTypeId);
    //     })
    //   )
    //   .subscribe(
    //     (response) => {
    //       this.listOfData = response;
    //       this.handleCancel();
    //     },
    //     () => {
    //       this.showErrorMessage();
    //     }
    //   );
  }

  editUser(): void {
    // this.user.user = this.initialValues.user;
    // this.usersService
    //   .editUser(this.user)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     switchMap(() => {
    //       this.showSuccessMessage();
    //       // return this.usersService.getUsers(this.userTypeId);
    //     })
    //   )
    //   .subscribe(
    //     (response) => {
    //       this.listOfData = response;
    //       this.handleCancel();
    //     },
    //     () => {
    //       this.showErrorMessage();
    //     }
    //   );
  }

  showModal(): void {
    this.isVisible = true;
  }

  onEditUser(user: User): void {
    const index = this.listOfData.findIndex((t) => t.id === user.user);
    this.isEditing = true;
    this.initialValues = this.listOfData[index];
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.user = undefined;
    this.isEditing = false;
  }

  handleUserChange(user: User): void {
    this.user = user;
  }

  showSuccessMessage(): void {
    this.message.success(Messages.success);
  }

  showErrorMessage(): void {
    this.message.error(Messages.fail);
  }

  submitForm(a): void {}
}
