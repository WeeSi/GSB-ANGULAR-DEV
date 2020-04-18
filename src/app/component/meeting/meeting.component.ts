import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { MeetingService } from '../../api/services/meeting.service';
import { ProfilComponent } from '../profil/profil.component'
import { MeetingDto } from 'src/app/api/models';
import { MatSnackBarConfig, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
  UserId:number;
  title = 'Mes rendez-vous';
  isShow = true;
  private Mettings:MeetingDto[] = [];
  dataSource: MeetingDto[];
  displayedColumns: string[] = ['Date', 'Heure', 'Commercial', 'Etat','Handle'];
  snackConfig: MatSnackBarConfig = {duration: 100000};

  constructor(
    private roleService : RoleService,
    private meetingService : MeetingService,
    private theme : ProfilComponent,
    private readonly snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.theme.setDefaultTheme();
    this.UserId = this.roleService.getId();
    this.meetingService.getMeetingId(this.UserId).toPromise().then(
      userMeetings => {this.Mettings = userMeetings; 
        this.dataSource = this.Mettings; 
        console.log(this.dataSource);
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

}
