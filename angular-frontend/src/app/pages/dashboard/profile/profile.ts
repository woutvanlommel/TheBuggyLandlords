import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: any = null;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        console.log('User Data Received:', data);
        this.user = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.isLoading = false;
      }
    });
  }
}

