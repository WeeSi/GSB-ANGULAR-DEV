import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { ApiService } from 'src/app/services/api.service';
import { RoleService } from 'src/app/services/role.service';
import { MedicamentsService } from '../../api/services/medicaments.service';
import { MedicamentDto } from 'src/app/api/models/medicament-dto';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateMedicamentDialog } from '../updateMedicamentDialog/updateMedicamentDialog.component';
import { AddmedicamentComponent } from '../addmedicament/addmedicament.component';
import { map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfilComponent } from '../profil/profil.component';


// tslint:disable-next-line: class-name
export interface medicamentsList {
  id: number;
  nom: string;
  description: string;
  img: string;
  vendeur?: string;
}

@Component({
  selector: 'app-medicaments',
  templateUrl: './medicaments.component.html',
  styleUrls: ['./medicaments.component.scss']
})

export class MedicamentsComponent implements OnInit {

    private role: any;
    animal: string;
    name: string;

    constructor(public navService: NavService,
                private api: ApiService,
                private roleService: RoleService,
                // tslint:disable-next-line: no-shadowed-variable
                private medicamentService: MedicamentsService,
                private dialog: MatDialog,
                private router:Router,
                private route:ActivatedRoute,
                private theme: ProfilComponent ) { }

    title = 'Medicaments';
    public MedicamentDto: MedicamentDto[] = [];

     openDialog(id): void {
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

  deleteMedicament(id){
    this.medicamentService.deleteMedicamentsId(id).subscribe(res => this.ngOnInit());
    this.router.navigate(['/medicaments'],{relativeTo:this.route})
  }

    ngOnInit() {
      // tslint:disable-next-line: no-shadowed-variable
      // tslint:disable-next-line: max-line-length
      // this.medicamentService.getMedicaments().pipe(
      //   map(response => response),
      //   tap(users =>  users)    // users array [Object, Object, Object]
      // )
      // .subscribe(users => this.MedicamentDto = users);
      // this.navService.show();
      // this.role = this.roleService.getRole();
      // console.log(this.role);
      // this.theme.setDefaultTheme();
    }

    ngOnDestroy() {
     
    }

}
