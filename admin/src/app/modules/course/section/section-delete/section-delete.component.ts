import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-section-delete',
  templateUrl: './section-delete.component.html',
  styleUrls: ['./section-delete.component.scss']
})
export class SectionDeleteComponent implements OnInit {

  @Input() section_selected:any;

  @Output() SectionD: EventEmitter<any> = new EventEmitter();
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
    this.courseService.deleteSection(this.section_selected.id).subscribe((resp:any) => {
      // console.log(resp)
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, caption: 'VALIDACIÓN', type: 'danger'});
        return;
      }else{
        this.SectionD.emit("");
        this.modal.dismiss();
      }
    })
  }

}
