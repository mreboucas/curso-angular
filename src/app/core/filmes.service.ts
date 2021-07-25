import { ConfigParamsService } from './config-params.service';
import { ConfigParams } from './../shared/models/config-params';
import { Filme } from './../shared/models/filme';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const url = 'http://localhost:3000/filmes/'

@Injectable({
  providedIn: 'root'
})
export class FilmesService {


  constructor(private http: HttpClient,
              private configParamsService: ConfigParamsService) { }

  salvar(filme: Filme): Observable<any> {
    return this.http.post<Filme>(url, filme);
  }

  editar(filme: Filme): Observable<Filme> {
    return this.http.put<Filme>(url + filme.id, filme);
  }

  listar(configParams: ConfigParams): Observable<Filme[]> {
  
    const httpParams = this.configParamsService.configurarParametros(configParams);

    return this.http.get<Filme[]>(url, {params: httpParams});
  }

  visualizar(id: number): Observable<Filme> {
    return this.http.get<Filme>(url + id)
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(url + id)
  }
}
