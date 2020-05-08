import { Component, OnInit } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component';
import { FacturesService } from '../../api/services/factures.service';
import { RoleService } from '../../services/role.service';
import { FactureDto } from '../../api/models/facture-dto';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
title = "Mes factures";
userId:number;
isShow = true;
date ="";
commercial = -1;
factureDto : FactureDto[] = [];
dataSource: FactureDto[];
displayedColumns: string[] = ['number', 'date', 'commercial'];

  constructor(
    private theme : ProfilComponent,
    private facturesService : FacturesService,
    private roleService : RoleService
  ) { }

  ngOnInit() {
    this.userId = this.roleService.getId();
    this.theme.setDefaultTheme();
    this.facturesService.getFacturesDoctorId(this.userId).toPromise().then(
      userBills => {this.factureDto = userBills as unknown as FactureDto[],
        console.log(this.factureDto);
        this.dataSource = this.factureDto;}
    )
  }

  onSearchFirstnameChange(event){

  }

  onSearchEmailChange(event){

  }

  
  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}
