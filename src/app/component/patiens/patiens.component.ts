import { Component, OnInit } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';
import { PageEvent } from '@angular/material/paginator';
import { NavService } from 'src/app/services/nav.service';
import { ProfilComponent } from '../profil/profil.component';
import { UserService } from '../../api/services/user.service';
import { UserDto } from '../../api/models/user-dto';
import { Router } from '@angular/router';
// tslint:disable-next-line: class-name

@Component({
  selector: 'app-patiens',
  templateUrl: './patiens.component.html',
  styleUrls: ['./patiens.component.scss']
})

export class PatiensComponent implements OnInit {
title = "Prendre rendez-vous";
isShow = true;
firstname:string = '';
lastname :string ='';
email:string = '';
adresse:string = '';

  constructor(
    private profilComponent : ProfilComponent,
    private userService : UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.profilComponent.setDefaultTheme();
    this.getUsersCommercials();
  }

  onSearchFirstnameChange(searchNameValue: string): void {  
    this.firstname = searchNameValue;
    this.getUsersCommercials();
  }
  onSearchLastnameChange(searchLastnameValue: string): void {  
    this.lastname = searchLastnameValue;
    this.getUsersCommercials();
  }
  onSearchEmailChange(searchEmailValue: string): void {  
    this.email = searchEmailValue;
    this.getUsersCommercials();
  }
  onSearchAddresseChange(searchAddresseValue: string): void {  
    this.adresse = searchAddresseValue;
    this.getUsersCommercials();
  }
  
  getUsersCommercials(){
    this.userService.getUserCommercials({lastname : this.lastname, firstname : this.firstname,email : this.email, adresse : this.adresse}).subscribe(doctors => {
      this.medecinsList = doctors as UserDto[],
      this.displayedMedecins = this.medecinsList;
      this.paginatorInfo.length = this.displayedMedecins.length;
      // this.displayedMedecins = this.paginateElements<UserDto>(this.medecinsList, this.paginatorInfo);
      // tslint:disable-next-line: max-line-length
      this.displayedMedecins = this.paginateElements<UserDto>(this.displayedMedecins, this.paginatorInfo); // On pagine nos éléments qui correspondent à la recherche
      });
  }

  medecinsList: UserDto[] = [];

  displayedMedecins = []; // La liste qui est liée à la vue (celle qui est affichée)
  paginatorInfo: PageEvent = {pageSize: 5, pageIndex: 0, length: this.medecinsList.length}; // Les informations que l'on lie au paginateur
  
  // Méthode déclenchée lorsque l'utilisateur change de page ou change la taille du paginateur
  pageChange(event: PageEvent): void {
  this.paginatorInfo = event; // On met à jour la variable qui contient les informations du paginateur
  this.displayedMedecins = this.paginateElements<UserDto>(this.medecinsList, this.paginatorInfo); // On pagine nos éléments affichés
  }
  
  /*Méthode paramétrique qui permet de paginer des éléments de n'importe quel type
  Prend en paramètre un tableau d'élément et un paginateur
  Retourne un tableau d'élément du même type
  */
  paginateElements<T>(elements: T[], paginator: PageEvent): T[] {
  return elements.filter((element, index) => {
  const start = paginator.pageIndex * paginator.pageSize; // On construit l'indice de départ.
  const end = start + paginator.pageSize - 1; // On construit l'indice de fin.
  return index >= start && index <= end; // On conserve que les éléments qui sont compris entre les indices de départ et de fin.
  });
  }
  
  fiche(id: any) {
  this.router.navigate(['medecins/user', { id }]);
  console.log(id);
  }
  
  deleteUser(e: number) {
  this.userService.deleteUserId(e).subscribe( x => {
    this.ngOnInit();
  });
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}
