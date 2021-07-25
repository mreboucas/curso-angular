import { MatDialog } from '@angular/material';
import { Filme } from './../../shared/models/filme';
import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {

  readonly semFotoImg = "https://cdn.neemo.com.br/uploads/settings_webdelivery/logo/1616/No-image-available.png"
  filme: Filme;
  id: number;

  constructor(private activateRoute: ActivatedRoute,
              private filmesService: FilmesService,
              private dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    //Captura o parâmetro oriundo do componente de listagem :id
    this.id = this.activateRoute.snapshot.params['id'];
    this.visualizar();
  }

  excluir() {
    const config = {
      data : {
        titulo: 'Você tem certeza que deseja excluir?',
        descricao: 'Clique em ok se deseja excluir o registro!',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuiBtnFechar: true
      } as Alerta
    }
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().subscribe((opcao: boolean ) => {
      if (opcao) {
        this.filmesService.excluir(this.id).subscribe(() => this.router.navigateByUrl('/filmes'));
      }
    });

  }

  editar() {
    this.router.navigateByUrl('/filmes/cadastro/' + this.id);
    
  }

  private visualizar(): void {
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => { this.filme = filme });
  }

}
