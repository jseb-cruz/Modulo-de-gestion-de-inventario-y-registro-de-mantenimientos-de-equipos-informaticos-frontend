import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-module-hub',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './module-hub.page.html',
  styleUrls: []
})
export class ModuleHubPage {
  auth = inject(AuthService);

  logout() {
    this.auth.clear();
  }
}
