import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import {
  CategoriasResponse,
  Categoria,
} from '../interfaces/categorias.interface';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private http = inject(HttpClient);

  obtieneCategorias(): Observable<CategoriasResponse> {
    return this.http
      .get<CategoriasResponse>(
        `${AppConfig.APIREST_URL}/api/CategoriaConvencionista/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneCategoria(categoriaId: number): Observable<CategoriasResponse> {
    return this.http
      .get<CategoriasResponse>(
        `${AppConfig.APIREST_URL}/api/CategoriaConvencionista/Detalles/${categoriaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaCategoria(categoria: Categoria): Observable<CategoriasResponse> {
    return this.http
      .post<CategoriasResponse>(
        `${AppConfig.APIREST_URL}/api/CategoriaConvencionista/Nueva`,
        {
          id: categoria.id,
          nombre: categoria.nombre,
          activo: categoria.activo,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaCategoria(categoria: Categoria): Observable<CategoriasResponse> {
    return this.http
      .put<CategoriasResponse>(
        `${AppConfig.APIREST_URL}/api/CategoriaConvencionista/Actualizar/${categoria.id}`,
        {
          id: categoria.id,
          nombre: categoria.nombre,
          activo: categoria.activo,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaCategoria(categoriaId: number): Observable<CategoriasResponse> {
    return this.http
      .delete<CategoriasResponse>(
        `${AppConfig.APIREST_URL}/api/CategoriaConvencionista/${categoriaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
