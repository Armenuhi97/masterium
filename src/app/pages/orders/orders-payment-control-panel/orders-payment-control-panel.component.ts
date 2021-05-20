import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-orders-payment-control-panel',
  templateUrl: './orders-payment-control-panel.component.html',
  styleUrls: ['./orders-payment-control-panel.component.css']
})
export class OrdersPaymentControlPanelComponent implements OnInit {
  @Output() onDebitChanged = new EventEmitter<number>();
  @Input() set defaultDebet(debet) {
    this.debit = debet;
  }
  public debit: number;


  constructor() { }

  ngOnInit(): void {
    this.debit = this.defaultDebet;
  }

  debitChanged(debit): void {
    this.onDebitChanged.emit(debit)
  }
}
