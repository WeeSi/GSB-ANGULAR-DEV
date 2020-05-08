import { Component, OnInit } from '@angular/core';
import { ProfilComponent } from '../profil/profil.component';
import { OrderService } from '../../api/services/order.service';
import { OrderDto } from 'src/app/api/models';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrls: ['./medicines.component.scss']
})
export class MedicinesComponent implements OnInit {

  title = 'Mes médicaments';
  private  OrderDto : OrderDto[] =[]; 
  private id;
  myArray: { categorie: string; medicament: any; }[];

  constructor(
    private theme : ProfilComponent,
    private orderService : OrderService,
    private roleService : RoleService
  ) { }

  ngOnInit() {
    this.id = this.roleService.getId();
    this.theme.setDefaultTheme();
    this.orderService.getOrderId(this.id).toPromise().then(
      userOrders => {this.OrderDto = userOrders;
        const groups = this.OrderDto.reduce(function(obj,medicament){
          obj[medicament.medicineCategorie] = obj[medicament.medicineCategorie] || [];
          obj[medicament.medicineCategorie].push(medicament);
          return obj;
      }, {});
      this.myArray = Object.keys(groups).map(function(key){
          return {categorie: key, medicament: groups[key]};
      });
    console.log(this.myArray)}
    )
  }

  deleteMedicament(e){

  }

}
