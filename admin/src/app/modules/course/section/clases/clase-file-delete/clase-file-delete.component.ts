import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { CourseService } from '../../../service/course.service';

@Component({
  selector: 'app-clase-file-delete',
  templateUrl: './clase-file-delete.component.html',
  styleUrls: ['./clase-file-delete.component.scss']
})
export class ClaseFileDeleteComponent implements OnInit {

  @Input() file_selected:any;

  @Output() FileD: EventEmitter<any> = new EventEmitter();
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
    this.courseService.deleteClaseFile(this.file_selected.id).subscribe((resp:any) => {
      // console.log(resp)
      this.FileD.emit("");
      this.modal.dismiss();
    })
  }

}
