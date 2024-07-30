import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '../service/categorie.service';
import { CategorieAddComponent } from '../categorie-add/categorie-add.component';
import { CategorieEditComponent } from '../categorie-edit/categorie-edit.component';
import { CategorieDeleteComponent } from '../categorie-delete/categorie-delete.component';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.scss']
})
export class CategorieListComponent implements OnInit {

  CATEGORIES:any = [];
  isLoading:any = null;

  search:any = null;
  state:any = null;
  constructor(
    public modalService: NgbModal,
    public categorieService: CategorieService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.categorieService.isLoading$;

    this.listCategorie();
  }
  
  listCategorie(){
    this.categorieService.listCategories(this.search,this.state).subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories.data;
    })
  }

  openModalCreateCategorie(){
    const modalRef = this.modalService.open(CategorieAddComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter((categorie:any) => !categorie.categorie_id);

    modalRef.componentInstance.CategorieC.subscribe((Categorie:any) => {
      console.log(Categorie);
      this.CATEGORIES.unshift(Categorie);
    })
  }

  editCategorie(CATEGORIE:any){
    const modalRef = this.modalService.open(CategorieEditComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.categorie = CATEGORIE;
    modalRef.componentInstance.CATEGORIES = this.CATEGORIES.filter((categorie:any) => !categorie.categorie_id);

    modalRef.componentInstance.CategorieE.subscribe((Categorie:any) => {
      console.log(Categorie);
      let INDEX = this.CATEGORIES.findIndex((item:any) => item.id == Categorie.id);
      this.CATEGORIES[INDEX] = Categorie;
    })
  }

  deleteCategorie(CATEGORIE:any){
    const modalRef = this.modalService.open(CategorieDeleteComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.categorie = CATEGORIE;

    modalRef.componentInstance.CategorieD.subscribe((resp:any) => {
      let INDEX = this.CATEGORIES.findIndex((item:any) => item.id == CATEGORIE.id);
      this.CATEGORIES.splice(INDEX,1);
    })
  }
}
