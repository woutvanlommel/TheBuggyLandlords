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

    // ... inside ProfileComponent class ...

  // 1. Function triggered when user selects a file
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      // Optional: Check if file is too big (e.g. > 4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert('Het bestand is te groot. Maximaal 4MB.');
        return;
      }

      this.uploadAvatar(file);
    }
  }

  // 2. Function to send file to backend
  uploadAvatar(file: File) {
    // Show a loading state if you want (optional)
    this.isLoading = true;

    this.authService.updateAvatar(file).subscribe({
      next: (response) => {
        // SUCCESS: Update the user's avatar URL immediately on screen
        if (this.user) {
          // If the URL is relative (/storage/...), prepend the domain
          // If your backend already sends the full http link, remove the prefix part
          this.user.profile_picture = {file_path: ''};
        }
        this.user.profile_picture.file_path = response.url;
        this.user = { ...this.user }; // Trigger change detection

        this.isLoading = false;
        this.cd.detectChanges();
        alert('Profielfoto succesvol bijgewerkt!');
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;

        if (err.status === 422) {
          alert('Ongeldig bestandstype. Alleen JPG, PNG of GIF is toegestaan.');
        } else {
          alert ('Er is iets misgegaan bij het uploaden. Probeer het opnieuw.');
        }
      }
    });
  }

    }


