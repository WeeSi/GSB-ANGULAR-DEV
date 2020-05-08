import { Component, OnInit, ViewChild } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { RoleService } from 'src/app/services/role.service';
import { MedicamentsService } from '../../api/services/medicaments.service';
import { MedicamentDto } from 'src/app/api/models/medicament-dto';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMedicamentDialog } from '../updateMedicamentDialog/updateMedicamentDialog.component';
import { AddmedicamentComponent } from '../addmedicament/addmedicament.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfilComponent } from '../profil/profil.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FacturesService } from 'src/app/api/services/factures.service';
import { CreateFactureDto } from 'src/app/api/models/create-facture-dto';
import { OrderService } from 'src/app/api/services/order.service';
import { CreatOrderDto } from 'src/app/api/models/creat-order-dto'
import { MatSnackBarConfig, MatSnackBar} from '@angular/material/snack-bar';
import { CategorieDto, UserDto } from 'src/app/api/models';
import { UserService } from 'src/app/api/services/user.service';
import { map, tap } from 'rxjs/operators';
// tslint:disable-next-line: class-name

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss']
})

export class MedicamentsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    pageIndex = 0;
    pageSize = 10;
    search = '';
    isShow = true;
    title = 'Medicaments';
    categorieSelected="Tout";
    commercialSelected = "Tous";
    commercialIdSelected = -1;
    myArray: { categorie: string; medicament: any; }[];
    public MedicamentDto: MedicamentDto[] = [];
    public UserDto: UserDto[] = [];
    public role: any;
    public userId;
    public CategorieDto : CategorieDto[] = [];

    snackConfig: MatSnackBarConfig = {duration: 100000};

    
    constructor(public navService: NavService,
                private factureService: FacturesService,
                private roleService: RoleService,
                private medicamentService: MedicamentsService,
                private dialog: MatDialog,
                private router:Router,
                private route:ActivatedRoute,
                private theme: ProfilComponent ,
                private orderService : OrderService,
                private userService : UserService,
                private snackBar : MatSnackBar) { }

     openDialog(id: any): void {
      const dialogRef = this.dialog.open(UpdateMedicamentDialog, {
      width: '800px',
      data: {id: id}
      });
    }

    addMedicament(): void {
      const dialogRef = this.dialog.open(AddmedicamentComponent, {
      width: '800px',
      });
      dialogRef.afterClosed().subscribe(result => {
       this.ngOnInit();
      });
    }

    getSelected(id, categorie){
      this.categorieSelected = categorie;
      this.getMedicines(this.search);
    }

  deleteMedicament(id: number){
    this.medicamentService.deleteMedicamentsId(id).subscribe(res => this.ngOnInit());
    this.router.navigate(['/medicaments'],{relativeTo:this.route})
  }

    ngOnInit() {
    this.getMedicines(this.search);
      this.navService.show();
      this.role = this.roleService.getRole();
      this.userId = this.roleService.getId();
      console.log(this.role);
      this.theme.setDefaultTheme();
      this.getCategories();
      this.getCommercials();
    }

    getMedicines(search: string): void {
      this.medicamentService.getMedicaments({pageIndex: this.pageIndex, pageSize: this.pageSize, search, commercial : this.commercialIdSelected, categorie : this.categorieSelected}).toPromise().then(
        paginatedMedicines => {
          this.MedicamentDto = paginatedMedicines.elements;
          const groups = this.MedicamentDto.reduce(function(obj,medicament){
            obj[medicament.categorie] = obj[medicament.categorie] || [];
            obj[medicament.categorie].push(medicament);
            return obj;
        }, {});
        this.myArray = Object.keys(groups).map(function(key){
            return {categorie: key, medicament: groups[key]};
        });
        }
      );
    }

    onSearchNameChange(searchName){
      this.search = searchName;
      this.getMedicines(this.search);
    }

    getCommercials(){
      this.userService.getUserSelectCommercials().toPromise().then(
        userCommercial => {this.UserDto = userCommercial}
      )
    }

    getSelectedCommercial(id, commerical){
      this.commercialIdSelected =  id;
      this.commercialSelected = commerical;
      this.getMedicines(this.search);
    }


    getCategories(){
      this.medicamentService.getMedicamentsCategories().pipe(
        map(response => response),
        tap(categories =>  categories)
      )
      .subscribe(categories => {this.CategorieDto  = categories as unknown as CategorieDto[]});
    }

    onScroll(){
      this.pageSize += 5;
      this.getMedicines(this.search);      
    }
  
    pageChange(event: PageEvent): void {
      if (event.pageSize !== this.pageSize) {
        this.paginator.firstPage();
      }
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.getMedicines(this.search);
    }

    buyMedicine(medcineId:number, medicineCategorie:string, medicineImg : string, medicineName:string, medicinePrice:number, commercialId:number){
      const CreatOrderDto : CreatOrderDto = {
        medicineCategorie : medicineCategorie,
        medicineImg : medicineImg,
        medicineName : medicineName,
        medicineNumber : medcineId,
        medicinePrice : medicinePrice,
        quantity : 3,
        userOrder : this.userId,
      }
      this.orderService.putOrder(CreatOrderDto).toPromise().then( () => {
        const createFactureDto : CreateFactureDto = {
          commercialId : commercialId,
          date : new Date().toDateString(),
          doctor : this.roleService.getId(),
          orders : this.userId
        }
        this.factureService.putFactures(createFactureDto).toPromise().then( () => { (error: any) => console.log(error) } );
        this.snackBar.open('Le médicament à été commandé', 'OK', this.snackConfig);
      },error => console.log(error)
      );
    }

    toggleDisplay() {
      this.isShow = !this.isShow;
    }

    ngOnDestroy() {
     
    }

}
