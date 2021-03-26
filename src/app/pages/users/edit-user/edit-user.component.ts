import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/core/models/user';
import { Specialization } from 'src/app/core/models/utils';
import { MainService } from 'src/app/core/services/main.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit, OnDestroy {
  @Output() valueChanged = new EventEmitter<User>();
  @Input() isEditing: boolean;
  @Input() user: User;
  listOfSelectedSpecializations = [];

  unsubscribe$ = new Subject();
  specializations: Specialization[];
  validateForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public mainService: MainService
  ) { }

  ngOnInit(): void {
    this.initForm();
    // this.getSpecializations();
  }

  initForm(): void {
    this.validateForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      study: ['', [Validators.required]],
      workArea: ['', [Validators.required]],
    });

    if (this.isEditing) {
      this.validateForm.patchValue(this.user);
      // this.listOfSelectedSpecializations = this.user.specialization;
    }
    this.validateForm.valueChanges.subscribe((data) => {
      this.emitData();
    });
  }

  emitData(): void {
    if (this.validateForm.valid) {
      // let user: User = this.validateForm.value;
      // user.specialization = this.listOfSelectedSpecializations;
      // this.valueChanged.emit(user);
    }
  }

  // getSpecializations(): void {
  //   this.mainService
  //     .getSpecializations()
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((response) => {
  //       this.specializations = response;
  //     });
  // }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
