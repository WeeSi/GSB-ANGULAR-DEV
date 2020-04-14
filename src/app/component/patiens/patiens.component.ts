import { Component, OnInit } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';
import { PageEvent } from '@angular/material/paginator';
import { NavService } from 'src/app/services/nav.service';
import { ProfilComponent } from '../profil/profil.component';


// tslint:disable-next-line: class-name
export interface patientsList {
  firstname: string;
  lastname: string;
  id: number;
}

@Component({
  selector: 'app-patiens',
  templateUrl: './patiens.component.html',
  styleUrls: ['./patiens.component.scss']
})

export class PatiensComponent implements OnInit {

  constructor(
              public searchb: SearchBarService,
              public navService: NavService,
              private theme : ProfilComponent) { }

  title = 'Vendeurs';

  searchTerm: string;

  patientsList: patientsList[] = [
    {
        firstname: 'Kyrie',
        lastname:  'Irving',
        id: 4
    },
    {
        firstname: 'Kevin',
        lastname:  'Durant',
        id: 6
    },
    {
        firstname: 'Markell',
        lastname:  'Fultz',
        id: 3
    },
    {
        firstname: 'Lebron',
        lastname:  'James',
        id: 23
    },
    {
        firstname: 'Chris',
        lastname:  'Paul',
        id: 15
    },

    {
        firstname: 'Ja',
        lastname:  'Morant',
        id: 12
    },

  ];

  displayedPatients = []; // La liste quiest liée à la vue (celle qui est affichée)
  paginatorInfo: PageEvent = {pageSize: 5, pageIndex: 0, length: this.patientsList.length}; // Les informations que l'on lie au paginateur

    // Méthode déclenchée lorsqu'une recherche est faite dans notre composant de recherche
    search(query: string): void {
      // Si la recherche est vide on affecte tous les éléments à la liste que l'on affiche
      this.displayedPatients = this.patientsList;
      // Sinon on filtre les éléments dont le nom ou le prénom ne commence pas par la chaîne recherchée
      if (query !== '') {
        this.displayedPatients = this.patientsList.filter((patient) => {
          const len = query.length; // On récupère la taille de la chaîne recherchée
          // tslint:disable-next-line: max-line-length
          const firstname = patient.firstname.substr(0, len).toLocaleLowerCase(); // On crée une sous chaîne du prénom de la même taille que celle recherchée
          const lastname = patient.lastname.substr(0, len).toLowerCase(); // Idem ave cle nom

          // On vérifie ensuite l'égalité des chaînes (on transforme ces chaînes en minuscule pour ne pas être sensible à la casse)
          const firstNameMatched = firstname === query.toLowerCase();
          const lastNameMatched = lastname === query.toLowerCase();

          // On conserve les éléments si la sous-chaîne créée avec le prénom ou celle créée avec le nom correspond
          return firstNameMatched || lastNameMatched;
        });
      }

      this.paginatorInfo.pageIndex = 0; // On remet le paginateur à la première page
      this.paginatorInfo.length = this.displayedPatients.length; // On affecte la taille des éléments trouvés à la taille du paginateur
      // tslint:disable-next-line: max-line-length
      this.displayedPatients = this.paginateElements<patientsList>(this.displayedPatients, this.paginatorInfo); // On pagine nos éléments qui correspondent à la recherche

    }
      // Méthode déclenchée lorsque l'utilisateur change de page ou change la taille du paginateur
  pageChange(event: PageEvent): void {
    this.paginatorInfo = event; // On met à jour la variable qui contient les informations du paginateur
    this.displayedPatients = this.paginateElements<patientsList>(this.patientsList, this.paginatorInfo); // On pagine nos éléments affichés
  }

  ngOnInit() {
    this.displayedPatients = this.paginateElements<patientsList>(this.patientsList, this.paginatorInfo);
    this.navService.show();
    this.theme.setDefaultTheme();
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

}
