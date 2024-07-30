import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CourseService } from '../../../service/course.service';

@Component({
  selector: 'app-clase-delete',
  templateUrl: './clase-delete.component.html',
  styleUrls: ['./clase-delete.component.scss']
})
export class ClaseDeleteComponent implements OnInit {

  @Input() clase_selected:any;

  @Output() ClaseD: EventEmitter<any> = new EventEmitter();
  isLoading:any;
  constructor(
    public courseService: CourseService,
    public toaster:Toaster,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
  }

  delete(){
    this.courseService.deleteClase(this.clase_selected.id).subscribe((resp:any) => {
      // console.log(resp)
      this.ClaseD.emit("");
      this.modal.dismiss();
    })
  }

}
