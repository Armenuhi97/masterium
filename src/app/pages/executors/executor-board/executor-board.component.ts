import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Messages } from 'src/app/core/models/messages';
import { ServerResponce } from 'src/app/core/models/server-responce';
import { BoardResponce, ExecutorBoard } from 'src/app/core/models/user';
import { MainService } from 'src/app/core/services/main.service';
import { ExecutorsService } from '../executors.service';

@Component({
    selector: 'app-executor-board-history',
    templateUrl: './executor-board.component.html',
    styleUrls: ['./executor-board.component.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class ExecutorBoardComponent implements OnInit, OnDestroy {
    @Input('userId')
    set setUserId($event) {
        this.userId = $event;
        this.getExuctorBoards();
    }
    public userId: number;
    public imagesList: NzUploadFile[] = [];
    public validateForm: FormGroup;
    public pageSize = 10;
    public unsubscribe$ = new Subject();
    public executeBoardSpareParts: ExecutorBoard[] = [];
    public total: number;
    public pageIndex = 1;
    public showChangeProductModal = false;
    public changeCountControl = new FormControl(0, Validators.required);
    public isVisible = false;
    public changingCountProductIndex: number;
    public images = [];
    public editIndex: number;
    public isEditing = false;
    constructor(
        private _executorService: ExecutorsService,
        private _fb: FormBuilder,
        private _mainService: MainService,
        private _message: NzMessageService,
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    public initForm(): void {
        this.validateForm = this._fb.group({
            name: [null, Validators.required],
            price: [null, Validators.required],
            quantity: [null]
        });
    }
    public getExuctorBoards(): void {
        this._executorService.getExecuteBoards(this.pageIndex, this.userId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: ServerResponce<ExecutorBoard[]>) => {
                this.total = data.count;
                this.executeBoardSpareParts = data.results;
            });
    }
    public handleCancel(): void {
        this.isVisible = false;
        this.resetData();
    }
    public handleRemove = (file: any) => {
        const index = this.imagesList.findIndex((image) => {
            return image.imageUrl === file.imageUrl;
        });
        this.imagesList.splice(index, 1);
    }

    public addImageRequests(): Observable<any> {
        const multiPuts = [];
        this.imagesList.forEach((item) => {
            if (item.response && !item.imageUrl) {
                multiPuts.push(this.addImageRequest(item.response));
            }
        });
        if (multiPuts.length === 0) {
            return of([]);
        }
        return forkJoin(multiPuts);
    }
    public addImageRequest(formData: File): Observable<any> {
        return this._mainService.uploadFile(formData);
    }

    public handleImageChange(info: NzUploadChangeParam): void {
        if (info.file.status === 'done' || info.file.status === 'error') {
            this._mainService.uploadFile(info.file.originFileObj)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(res => {
                    this.images.push(
                        {
                            image_url: res.url,
                            is_primary: true,
                        });
                });
        }
    }

    public resetData(): void {
        this.validateForm.reset();
        this.isEditing = false;
        this.editIndex = null;
        this.imagesList = [];
    }
    public onSubmit(): void {
        const sendObject: BoardResponce = {
            name: this.validateForm.value.name,
            price: this.validateForm.value.price,
            image: []
        };
        if (this.isEditing) {
            this.addImageRequests()
                .pipe(
                    takeUntil(this.unsubscribe$)).
                subscribe((response: any) => {
                    sendObject.image = response.map((image, index) => {
                        return {
                            image_url: image.url,
                            is_primary: index === 0,
                        };
                    });
                    this.imagesList.forEach((image) => {
                        if (image.imageUrl) {
                            sendObject.image.push({
                                image_url: image.imageUrl,
                                is_primary: false
                            });
                        }
                    });
                    this.editExecutorBoard(sendObject);
                });

        } else {
            sendObject.quantity = this.validateForm.value.quantity;
            this.addImageRequests()
                .pipe(
                    takeUntil(this.unsubscribe$)).
                subscribe((response: any) => {
                    sendObject.image = response.map((image, index) => {
                        return {
                            image_url: image.url,
                            is_primary: index === 0,
                        };
                    });
                    this.imagesList.forEach((image) => {
                        if (image.imageUrl) {
                            sendObject.image.push({
                                image_url: image.imageUrl,
                                is_primary: false
                            });
                        }
                    });
                    this.postExecutorBoard(sendObject);
                });
        }

    }
    public editExecutorBoard(sendObject): void {
        this._executorService.updateExecutorBoard(this.executeBoardSpareParts[this.editIndex].id, sendObject)
            .pipe(
                takeUntil(this.unsubscribe$),
                switchMap(() => this._executorService.getExecuteBoards(this.pageIndex, this.userId))
            )
            .subscribe((response: ServerResponce<ExecutorBoard[]>) => {
                this.executeBoardSpareParts = response.results;
                this.showSuccessMessage();
                this.handleCancel();
                this.closeModal();
            },
                () => {
                    this.showFailMessage();
                });
    }
    public postExecutorBoard(sendObject): void {
        this._executorService.addExecutorBoard(this.userId, sendObject).pipe(
            takeUntil(this.unsubscribe$),
            switchMap(() => {
                this.total += 1;
                this.pageIndex = Math.ceil(this.total / this.pageSize);
                return this._executorService.getExecuteBoards(this.pageIndex, this.userId);
            })
        )
            .subscribe((response: ServerResponce<ExecutorBoard[]>) => {
                this.executeBoardSpareParts = response.results;
                this.showSuccessMessage();
                this.handleCancel();
                this.closeModal();
            },
                () => {
                    this.showFailMessage();
                });
    }

    public nzPageIndexChange(page: number): void {
        this.pageIndex = page;
        this.getExuctorBoards();
    }

    public closeModal(): void {
        this.isVisible = false;
        this.showChangeProductModal = false;
        this.resetData();
    }


    public onChangeProductCount(index: number): void {
        this.changingCountProductIndex = index;
        this.showChangeProductModal = true;
        this.changeCountControl.reset();
    }
    public changeProductCount(): void {
        this._executorService.changeExecuteBoardCount(
            this.executeBoardSpareParts[this.changingCountProductIndex].id,
            this.changeCountControl.value
        ).pipe(takeUntil(this.unsubscribe$))
            .subscribe(res => {
                this.showSuccessMessage();
                this.closeModal();
                this.executeBoardSpareParts[this.changingCountProductIndex].quantity += this.changeCountControl.value;
            }, () => {
                this.showFailMessage();
            });
    }

    public onEdit(index): void {
        this.isEditing = true;
        this.editIndex = index;
        this.getBoardById(this.executeBoardSpareParts[this.editIndex].id);
        this.showModal();
    }

    public customImageRequest = (item) => {
        setTimeout(() => {
            item.onSuccess(item.file);
        });
    }
    public getBoardById(id: number): void {
        this._executorService.getBoardById(id).pipe(takeUntil(this.unsubscribe$)).subscribe((data: ExecutorBoard) => {
            this.validateForm.patchValue({
                name: data.product.name[0].value,
                price: data.product.price,
                quantity: data.quantity
            });
            data.product.product_images.forEach((image, i) => {
                this.imagesList.push({
                    name: 'XXX',
                    url: image.image_url,
                    thumbUrl: image.image_url,
                    uid: (0 - i).toString(),
                    imageUrl: image.image_url
                });
            });
            this.imagesList = [...this.imagesList];
        });
    }

    public showModal(): void {
        this.isVisible = true;
    }

    public showSuccessMessage(): void {
        this._message.success(Messages.success);
    }

    public showFailMessage(): void {
        this._message.error(Messages.fail);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
