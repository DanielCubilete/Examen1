import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../servicios/api-service';
import { Item } from '../../common/personaje-interfaz';

@Component({
  selector: 'app-personajes-component',
  imports: [CommonModule],
  templateUrl: './personajes-component.html',
  styleUrl: './personajes-component.css',
})
export class PersonajesComponent implements OnInit {
  personajes = signal<Item[]>([]);
  cargando = signal<boolean>(true);
  paginaActual = signal<number>(1);
  personajesPorPagina = 10;

  // Personajes paginados
  personajesPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.personajesPorPagina;
    const fin = inicio + this.personajesPorPagina;
    return this.personajes().slice(inicio, fin);
  });

  // Total de páginas
  totalPaginas = computed(() => {
    return Math.ceil(this.personajes().length / this.personajesPorPagina);
  });

  // Array de números de página para mostrar
  paginasArray = computed(() => {
    return Array.from({ length: this.totalPaginas() }, (_, i) => i + 1);
  });

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Componente inicializado');
    this.cargando.set(true);
    this.cargarTodosLosPersonajes();
  }

  cargarTodosLosPersonajes(personajesAcumulados: Item[] = []): void {
    this.apiService.getCharacters().subscribe({
      next: (data) => {
        console.log('Datos de la API:', data);
        
        const todosLosPersonajes = [...personajesAcumulados, ...data.items];
        
        // Verificar si hay más páginas
        if (data.links && data.links.next) {
          // Cargar la siguiente página
          this.cargarPaginaSiguiente(data.links.next, todosLosPersonajes);
        } else {
          // No hay más páginas, asignar todos los personajes
          this.personajes.set(todosLosPersonajes);
          console.log('Total de personajes cargados:', todosLosPersonajes.length);
          this.cargando.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error completo:', error);
        this.cargando.set(false);
        this.personajes.set(personajesAcumulados);
      }
    });
  }

  cargarPaginaSiguiente(url: string, personajesAcumulados: Item[]): void {
    this.apiService.getCharactersByUrl(url).subscribe({
      next: (data) => {
        const todosLosPersonajes = [...personajesAcumulados, ...data.items];
        
        if (data.links && data.links.next) {
          this.cargarPaginaSiguiente(data.links.next, todosLosPersonajes);
        } else {
          this.personajes.set(todosLosPersonajes);
          console.log('Total de personajes cargados:', todosLosPersonajes.length);
          this.cargando.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar página siguiente:', error);
        this.personajes.set(personajesAcumulados);
        this.cargando.set(false);
      }
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 1) {
      this.cambiarPagina(this.paginaActual() - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual() < this.totalPaginas()) {
      this.cambiarPagina(this.paginaActual() + 1);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/personajes', id]);
  }
}
