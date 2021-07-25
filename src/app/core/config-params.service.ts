import { HttpParams } from '@angular/common/http';
import { ConfigParams } from './../shared/models/config-params';
import { Injectable } from '@angular/core';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigParamsService {

  constructor() { }

  configurarParametros(configParams: ConfigParams): HttpParams {
    let httpParams = new HttpParams();
    if (configParams.pagina) {
      httpParams = httpParams.set('_page', configParams.pagina.toString())
    }
    if (configParams.limite) {
      httpParams = httpParams.set('_limit', configParams.limite.toString());
    }
    if (configParams.pesquisa) {
      // httpParams = httpParams.set('titulo_like', texto);
      httpParams = httpParams.set('q', configParams.pesquisa);
    }
    if (configParams.campo && configParams.campo.valor && configParams.campo.tipo) {
      httpParams = httpParams.set(configParams.campo.tipo, configParams.campo.valor.toString());
    }
    
    httpParams = httpParams.set('_sort', 'id');
    httpParams = httpParams.set('_order', 'desc');
    
    return httpParams
  }
}
