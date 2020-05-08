import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { MeetingService } from '../../api/services/meeting.service';
import { ProfilComponent } from '../profil/profil.component'
import { MeetingDto, UserDto } from 'src/app/api/models';
import { MatSnackBarConfig, MatSnackBar} from '@angular/material/snack-bar';
import { UserService } from 'src/app/api/services';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
  UserId:number;
  title = 'Mes rendez-vous';
  isShow = true;
  state = -1;
  selectedState="Tous";
  doctor = -1;
  date = "";
  dateToString = "";
  commercialSelected = "Tous";
  commercialIdSelected = -1;
  doctorSelected = "Tous";
  doctorIdSelected = -1;
  public CommercialDto : UserDto[] = [];
  public DoctorDto : UserDto[] = [];
  public Mettings:MeetingDto[] = [];
  public role: any;
  dataSource: MeetingDto[];
  displayedColumns: string[] = ['Date', 'Heure', 'Commercial','Etat','Handle'];
  displayedColumnsDoctor: string[] = ['Date', 'Heure', 'Doctor', 'Etat','Handle'];
  displayedColumnsAdmin: string[] = ['Date', 'Heure', 'Doctor', 'Commercial',  'Etat','Handle'];
  snackConfig: MatSnackBarConfig = {duration: 100000};

  constructor(
    private roleService : RoleService,
    private meetingService : MeetingService,
    private theme : ProfilComponent,
    private readonly snackBar: MatSnackBar,
    private userService : UserService,
  ) { }

  ngOnInit() {
    this.theme.setDefaultTheme();
    this.UserId = this.roleService.getId();
    this.role = this.roleService.getRole();
    this.getMeetings();
    this.getCommercials();
    this.getDoctor();
  }

  getMeetings(){
    this.meetingService.getMeetingId({state : this.state, id : this.UserId, doctor : this.doctor, date : this.date, commercial : this.commercialIdSelected}).toPromise().then(
      userMeetings => {this.Mettings = userMeetings; 
        this.dataSource = this.Mettings; 
      }
    );
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  accepteMeeting(id:number){
    this.meetingService.postMeetingIdAccept(id).toPromise().then(
      () => {
        this.snackBar.open('Rendez-vous accepté', 'OK', this.snackConfig);
        },
        error => console.log(error) );
  }

  declineMeeting(id:number){
    this.meetingService.postMeetingIdDecline(id).toPromise().then(
      () => {
        this.snackBar.open('Rendez-vous refusé', 'OK', this.snackConfig);
        },
        error => console.log(error) );
  }

  deleteMeeting(id:number){
    this.meetingService.postMeetingIdDecline(id).toPromise().then(
      () => {
        this.snackBar.open('Rendez-vous supprimé', 'OK', this.snackConfig);
        },
        error => console.log(error) );
  }

  getCommercials(){
    this.userService.getUserSelectCommercials().toPromise().then(
      userCommercial => {this.CommercialDto = userCommercial}
    )
  }

  getDoctor(){
    this.userService.getUserDoctors().toPromise().then(
      userDoctor => this.DoctorDto = userDoctor
    )
  }

  getSelectedCommercial(id: number, commerical: string){
    this.commercialIdSelected =  id;
    this.commercialSelected = commerical;
    this.getMeetings();
  }

  getSelectedDoctor(id: number, doctor: string){
    this.doctorIdSelected =  id;
    this.doctorSelected = doctor;
    this.getMeetings();
  }

  getSelected(state:number): void {
    this.state = state;
    this.getMeetings();
    switch(this.state){
      case -1  : this.selectedState = 'Tous';
                break;
      case  0  : this.selectedState = 'Refusé';
                break;
      case  1  : this.selectedState = 'Accepté';
                break;
      case  2  : this.selectedState = 'En attente';
                break;
      default : this.selectedState = 'Tous';
    }
  }

  onDate(event: { value: { toLocaleDateString: () => string; getTime: () => string; }; }): void {
    this.dateToString = event.value.toLocaleDateString();
    this.date = event.value.getTime();
    this.getMeetings();
  }

  refreshDate(){
    this.dateToString = '';
    this.date = '';
    this.getMeetings();
  }

}
