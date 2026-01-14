import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerhuurderService } from '../../shared/verhuurder.service';

@Component({
  selector: 'app-building-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between gap-3 mb-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-primary-600">Overzicht</p>
        <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Studenten per Kot</h3>
      </div>
      <button
        class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow hover:bg-white/80 transition-colors"
      >
        Beheer
      </button>
    </div>

    <div class="space-y-4">
      <!-- Loading State -->
      @if (loading) {
      <div class="text-center py-4 text-base-twee-500">Gebouwen laden...</div>
      }

      <!-- Empty State -->
      @if (!loading && buildings.length === 0) {
      <div class="text-center py-4 text-base-twee-500">Geen gebouwen gevonden.</div>
      }

      <!-- Building List -->
      @for (building of buildings; track building.id) {
      <div class="bg-base-een-100/30 border border-base-twee-200/50 rounded-xl overflow-hidden">
        <!-- Accordion Header -->
        <div
          (click)="toggleBuilding(building)"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-base-een-200/30 transition-colors group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary-100/50 flex items-center justify-center text-primary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-base-twee-900">
                {{ building.street }} {{ building.number }}
              </h4>
              <p class="text-xs text-base-twee-500">
                {{ building.city }} • {{ building.rooms?.length || 0 }} Kamers
              </p>
            </div>
          </div>

          <svg
            [class.rotate-180]="building.expanded"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 text-base-twee-400 transform transition-transform duration-200"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <!-- Accordion Content (Table) -->
        @if (building.expanded) {
        <div class="border-t border-base-twee-200/50 bg-white/30">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-base-twee-700">
              <thead
                class="text-xs uppercase text-base-twee-500 font-semibold border-b border-base-twee-200/50"
              >
                <tr>
                  <th class="px-4 py-3 bg-base-een-50/50">Kamer</th>
                  <th class="px-4 py-3 bg-base-een-50/50">Huurder</th>
                  <th class="px-4 py-3 bg-base-een-50/50">Status</th>
                  <th class="px-4 py-3 text-right bg-base-een-50/50">Actie</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-base-twee-200/50">
                @for (room of building.rooms; track room.id) {
                <tr class="hover:bg-base-een-200/30 transition-colors">
                  <td class="px-4 py-3 font-medium text-base-twee-900">
                    {{ room.name || 'Kamer ' + room.id }}
                  </td>
                  <td class="px-4 py-3">
                    <!-- Mock data checks, adjust based on real API -->
                    @if (room.active_contract?.subscriber; as subscriber) {
                    <div class="flex items-center gap-2">
                      <div
                        class="w-6 h-6 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-800 text-xs font-bold"
                      >
                        {{ subscriber.first_name.charAt(0) }}
                      </div>
                      <span>{{ subscriber.first_name }} {{ subscriber.last_name }}</span>
                    </div>
                    } @else {
                    <span class="text-base-twee-400 italic">Geen huurder</span>
                    }
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="
                        room.active_contract
                          ? 'bg-secondary-100/50 text-secondary-900'
                          : 'bg-base-twee-100/50 text-base-twee-600'
                      "
                    >
                      {{ room.active_contract ? 'Verhuurd' : 'Beschikbaar' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-primary-600 cursor-pointer hover:underline">
                    Details
                  </td>
                </tr>
                } @if (!building.rooms || building.rooms.length === 0) {
                <tr>
                  <td colspan="4" class="px-4 py-6 text-center text-base-twee-400 text-sm">
                    Nog geen kamers toegevoegd aan dit gebouw.
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class BuildingDashboard implements OnInit {
  buildings: any[] = [];
  loading: boolean = true;

  constructor(private verhuurderService: VerhuurderService) {}

  ngOnInit() {
    this.loadBuildings();
  }

  async loadBuildings() {
    try {
      this.loading = true;
      // In a real app we would use the actual API response
      // For now we assume query works, or we mock if it fails/returns empty while developing
      const data = await this.verhuurderService.getMyBuildings();

      // Add 'expanded' property to each building for UI state
      this.buildings = data.map((b: any) => ({ ...b, expanded: false }));
    } catch (error) {
      console.error('Error loading buildings:', error);
      // Fallback/Mock data for demonstration if API fails or backend not ready
      this.buildings = [];
    } finally {
      this.loading = false;
    }
  }

  toggleBuilding(building: any) {
    building.expanded = !building.expanded;
  }
}
