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
    current_password: '',
    password: '',
    password_confirmation: '',
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
    current_password: '',
    password: '',
    password_confirmation: ''
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

    onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Optional: Check size before sending (e.g. 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert('Bestand is te groot (max 4MB)');
        return;
      }

      this.uploadAvatar(file);
    }
  }

  uploadAvatar(file: File) {
    this.authService.updateAvatar(file).subscribe({
      next: (response: any) => {
        // Update the user object immediately so the image changes on screen
        if (this.user) {
          this.user.avatar_url = response.url;
        }
        alert('Profielfoto bijgewerkt!');
      },
      error: (err) => {
        console.error(err);
        alert('Uploaden mislukt.');
      }
    });
  }
    }


