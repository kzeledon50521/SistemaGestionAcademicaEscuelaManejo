import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Curso } from '../../models/curso.model';
import { CursoService } from '../../services/curso.service';

@Component({
  selector: 'app-inscripciones',
  imports: [CommonModule],
  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.scss',
})
export class Inscripciones {
  catalogo: Curso[] = [];

  constructor(private cursoService: CursoService, private cdr: ChangeDetectorRef) {
    this.obtenerCatalogo();
  }

  obtenerCatalogo(): void {
    this.cursoService.obtenerCatalogo().subscribe({
      next: (respuesta) => {
        this.catalogo = respuesta;
        this.cdr.detectChanges();
      }
    });
  }
}
