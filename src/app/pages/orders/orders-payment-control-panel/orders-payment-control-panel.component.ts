import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders-payment-control-panel',
  templateUrl: './orders-payment-control-panel.component.html',
  styleUrls: ['./orders-payment-control-panel.component.css']
})
export class OrdersPaymentControlPanelComponent implements OnInit {
  public debit: string;
  constructor() { }

  ngOnInit(): void {
  }

}
