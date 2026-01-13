import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: any = null;
  isLoading: boolean = true;
  isEditing: boolean = false;

  editForm = {
    email: '',
    phone: '',
  }

  isChangingPassword = false;
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

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

      openEditModal() {
        this.editForm.email = this.user.email;
        this.editForm.phone = this.user.phone;
        this.isEditing = true;
      }

      closeEditModal() {
        this.isEditing = false;
      }

      saveProfile() {
        this.authService.updateProfile(this.editForm).subscribe({
          next: (updatedUser) => {
            this.user = updatedUser;
            this.isEditing = false;
            alert('Profiel succesvol bijgewerkt!');
          },
          error: (err) => {
            console.error('Error updating profile:', err);
            alert('Er is een fout opgetreden bij het bijwerken van het profiel.');
          }
      });
  }

    openPasswordModal() {
  // Clear the form every time we open it
  this.passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  this.isChangingPassword = true;
}

  closePasswordModal() {
    this.isChangingPassword = false;
  }

  savePassword() {
    this.authService.updatePassword(this.passwordForm).subscribe({
      next: () => {
        alert('Wachtwoord is gewijzigd!');
        this.closePasswordModal();
      },
      error: (err) => {
        console.error(err);
        // Check if the backend sent a specific error message
        if (err.error && err.error.errors && err.error.errors.current_password) {
          alert(err.error.errors.current_password[0]); // "Huidige wachtwoord onjuist"
        } else {
          alert('Er is iets misgegaan. Controleer of de wachtwoorden overeenkomen.');
        }
      }
    });
    }
  }

