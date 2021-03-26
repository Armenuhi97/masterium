import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ExecutorsRoutingModule } from './executors-routing.module';
import { ExecutorsService } from './executors.service';
import { ExecutorRewardHistoryComponent } from './executor-reward-history/executor-reward-history.component';
import { ExecutorBoardComponent } from './executor-board/executor-board.component';
@NgModule({
  declarations: [ExecutorsRoutingModule.components, ExecutorRewardHistoryComponent, ExecutorBoardComponent],
  imports: [ExecutorsRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, IconsProviderModule, FormsModule],
  providers: [ExecutorsService]
})
export class ExecutorsModule { }
