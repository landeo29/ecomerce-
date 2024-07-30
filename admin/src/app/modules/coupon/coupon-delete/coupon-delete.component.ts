import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CouponService } from '../service/coupon.service';

@Component({
  selector: 'app-coupon-delete',
  templateUrl: './coupon-delete.component.html',
  styleUrls: ['./coupon-delete.component.scss']
})
export class CouponDeleteComponent implements OnInit {

  @Input() coupon:any;

  @Output() CouponD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public cuponService: CouponService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.cuponService.isLoading$;
  }

  delete(){
    this.cuponService.deleteCoupon(this.coupon.id).subscribe((resp:any) => {
      // console.log(resp)
      this.CouponD.emit("");
      this.modal.dismiss();
    })
  }

}
