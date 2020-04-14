import { Component, OnInit } from '@angular/core';
import { SearchBarService } from 'src/app/services/search-bar.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/api/services/user.service';
import { NavService } from 'src/app/services/nav.service';
import { UserDto } from 'src/app/api/models/user-dto';
import { RoleService } from 'src/app/services/role.service';
import { ProfilComponent } from '../profil/profil.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  role: any;
  loading: boolean;

  constructor(public searchb: SearchBarService,
              private router: Router,
              private userService: UserService,
              public navService: NavService,
              private readonly roleService: RoleService,
              private theme: ProfilComponent) { }

  title = 'Utilisateurs';

  Users: UserDto[] = [];

  ngOnInit() {
    this.loading = true;
    this.navService.show();
    this.userService.getUser().subscribe(users => {
      this.Users = users as UserDto[];
      this.loading = false;});
    this.role = this.roleService.getRole();
    this.theme.setDefaultTheme();
  }

  addUsers(){
    this.router.navigateByUrl('/signup');
  }

}
