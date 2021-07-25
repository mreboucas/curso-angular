import { Router } from '@angular/router';
import { ConfigParams } from './../../shared/models/config-params';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Filme } from './../../shared/models/filme';
import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  //pagina: number = 0;
  //readonly qntdRegistrosPorPagina: number = 4;
  //texto: string;
  //genero: string;
  readonly semFotoImg = "https://cdn.neemo.com.br/uploads/settings_webdelivery/logo/1616/No-image-available.png"
  config: ConfigParams = {
    pagina: 0,
    limite: 4
  }
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<String>;

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });
    //Espécie de observable - dispara quando tiver alguma alteração no campo de busca;
    this.filtrosListagem.get('texto').valueChanges
    //Debounce -> adiciona 400 milisegundos depois da parada da digitação pelo usuário - evitar oneração nas requests para o servidor.
    .pipe(debounceTime(400))
    .subscribe((val: string) => {
      console.log('alteracao valor texto ', val);
      this.config.pesquisa = val;
      this.resetarDadosEListarFilmes();
    });
    //Espécie de observable - dispara quando tiver alguma alteração no campo de busca;
    this.filtrosListagem.get('genero').valueChanges
    .subscribe((val: string) => {
      console.log('alteracao valor genero ', val);
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarDadosEListarFilmes();
    });
    this.listarFilmes();
    this.generos = ['Ação','Romance','Aventura','Terror','Ficção Científica', 'Comédia', 'Aventura', 'Drama'];
  }

  onScroll(): void {
    this.listarFilmes();
  }

  private listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe((filmes: Filme[]) => {
      console.log(filmes);
      //spread operator (...) -> faz a cópia do array retornado para o novo array.
      this.filmes.push(...filmes);
      });
  }

  private resetarDadosEListarFilmes(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

  abrir(id: number): void {
    this.router.navigateByUrl('/filmes/' + id);
  }
}
