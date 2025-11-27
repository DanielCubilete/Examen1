import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../servicios/api-service';
import { PersonajeInterfaz } from '../../common/personaje-interfaz';

@Component({
  selector: 'app-personaje-detalles-component',
  imports: [CommonModule],
  templateUrl: './personaje-detalles-component.html',
  styleUrl: './personaje-detalles-component.css',
})
export class PersonajeDetallesComponent implements OnInit {
  personaje = signal<PersonajeInterfaz | null>(null);
  cargando = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargando.set(true);
      this.apiService.getCharacter(Number(id)).subscribe({
        next: (data) => {
          console.log('Datos completos del personaje:', data);
          console.log('Planeta de origen:', data.originPlanet);
          console.log('Transformaciones:', data.transformations);
          this.personaje.set(data);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar personaje:', error);
          this.cargando.set(false);
          this.router.navigate(['/personajes']);
        }
      });
    }
  }

  calcularPorcentajeKi(): number {
    const p = this.personaje();
    if (!p || !p.ki || !p.maxKi) return 0;
    const ki = this.parsearKi(p.ki);
    const maxKi = this.parsearKi(p.maxKi);
    return maxKi > 0 ? (ki / maxKi) * 100 : 0;
  }

  private parsearKi(ki: string): number {
    return Number(ki.replace(/[^0-9]/g, '')) || 0;
  }
}
