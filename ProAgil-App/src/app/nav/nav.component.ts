import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    public router: Router) { }

  ngOnInit(): void {
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  showMenu() {
    return this.router.url !== '/user/login';
  }

  entrar() {
    this.router.navigate(['user/login']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['user/login']);
  }

  userName() {
    return sessionStorage.getItem('username');
  }

}
