import { UtilFormatador } from './../../util/util-formatador';
import { Router, Routes, ActivatedRoute } from '@angular/router';
import { Alerta } from './../../shared/models/alerta';
import { AlertaComponent } from './../../shared/components/alerta/alerta.component';
import { Filme } from './../../shared/models/filme';
import { FilmesService } from './../../core/filmes.service';
import { ValidarCamposService } from './../../shared/components/campos/validar-campos.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import StringUtils from 'src/app/util/StringUtil';
import { MatDialog } from '@angular/material';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ArquivoUpload } from 'src/app/shared/models/arquivo-upload.model';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  id: number;
  cadastro: FormGroup;
  generos: Array<String>;
  nomeAbreviado: string;

  ////UPLOAD
  tamanhoMaximoArquivoEmBytes: number;
  qtdeArquivosExibicao: number;
  recolherTodosArquivos: boolean;
  mostrarMenosArquivos: boolean;
  painelAberto: boolean;
  editandoArquivoAnexado: boolean;
  fotosTemporarias: {
    tamanhoTotal: number,
    fotos: ArquivoUpload[],
    mergeBase64: string
  };
  caracteresEspeciais: boolean = false;
  arquivosAnexados: ArquivoUpload[] = [];
  @ViewChild('uploadFile', { static: false }) uploadFile: ElementRef;
  @ViewChild('tirarFoto', { static: false }) tirarFoto: ElementRef;
  arquivosAnexadosForm: FormGroup;
  readonly qtdeArquivosExibicaoPadrao = 5;
  readonly qtdeMinimaExibirRecolherExpandirTodosArquivos = 10;


  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private filmesService: FilmesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private uploadService: UploadService
              ) { 

  //UPLOAD
  this.tamanhoMaximoArquivoEmBytes = 30 * 1048576;
  this.qtdeArquivosExibicao = this.qtdeArquivosExibicaoPadrao;

  }

  get f() {
    return this.cadastro.controls;
  }
  
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    if (this.id) {
      try {
        this.filmesService.visualizar(this.id)
        .subscribe((filme: Filme) => { this.criarFormulario(filme) });
      } catch (error) {
        this.criarFormulario(this.criarFilmeEmBRanco()); 
      }
    } else {
      this.criarFormulario(this.criarFilmeEmBRanco());
    }

    
    this.generos = ['Ação','Romance','Aventura','Terror','Ficção Científica', 'Comédia', 'Aventura', 'Drama'];
    
    //UPLOAD
    this.resetFotosTemporarias();

    this.arquivosAnexadosForm = this.fb.group({
      'nome-arquivo': null
    });
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }
    const filme = this.cadastro.getRawValue() as Filme;
    if (filme.id) {
      this.editar(filme);
    } else {
      this.salvar(filme);
    }

   // alert('Oia, salvar' + JSON.stringify(this.cadastro.value, null, 4));
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  abreviarNome() {
    //console.log(this.cadastro.controls.nomeCompleto.value)
    this.nomeAbreviado = StringUtils.abreviarNome(this.cadastro.controls.nomeCompleto.value, 35);
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(() => {
      const config = {
        data : {
          btnSucesso: 'Ir para listagem',
          btnCancelar: 'Cadastrar um novo filme',
          corBtnCancelar: 'primary',
          possuiBtnFechar: true
        } as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao: boolean ) => {
        if (opcao) {
          this.router.navigateByUrl('filmes');
        } else {
          this.reiniciarForm();
        }
      });
    },
    () => {
      const config = {
        data : {
          titulo: 'Errro ao salvar o registro!',
          descricao: 'Não conseguimos salvar seu registro, favor tentar novamente mais tarde.',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      }
      this.dialog.open(AlertaComponent, config);
    },
    () => {
      //Finally
    });
  } 

  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe(() => {
      const config = {
        data : {
          descricao: 'Seu registro foi atualizado com sucesso',
          btnSucesso: 'Ir para listagem',
          corBtnSucesso: 'accent',
        } as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe(() => {
          this.router.navigateByUrl('filmes');
      });
    },
    () => {
      const config = {
        data : {
          titulo: 'Errro ao editar o registro!',
          descricao: 'Não conseguimos editar seu registro, favor tentar novamente mais tarde.',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      }
      this.dialog.open(AlertaComponent, config);
    },
    () => {
      //Finally
    });
  }
  
  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      id: [filme.id],
      titulo: [filme.titulo, [Validators.required, Validators.minLength(5), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]],
      nomeCompleto: ['MARCELO DA COSTA REBOUÇAS DA COSTA REBOUÇASSSSS DA COSTA']
    });
  }

  private criarFilmeEmBRanco(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null
    } as Filme
  }

  async uploadFoto(event: any) {
    alert('Processando imagem...');
    let perf = window.performance;
    if (perf && perf.memory) {
      console.log("ANTES DO UPLOAD");
      console.log("jsHeapSizeLimit " + this.bytesToSize(perf.memory.jsHeapSizeLimit));
      console.log("totalJSHeapSize " + this.bytesToSize(perf.memory.totalJSHeapSize));
      console.log("usedJSHeapSize " + this.bytesToSize(perf.memory.usedJSHeapSize));
    }
    try {
      const arquivoUpload = await this.uploadService.upload(event, this.tamanhoMaximoArquivoEmBytes, ['jpg', 'jpeg']);
      if (arquivoUpload) {
        const tamanhoTotalComNovaFoto = this.fotosTemporarias.tamanhoTotal + arquivoUpload.tamanho;
        if (tamanhoTotalComNovaFoto > this.tamanhoMaximoArquivoEmBytes) {
          alert(UtilFormatador.formatarString(this.uploadService.mensagemErroTamanhoMaximoArquivo, (this.tamanhoMaximoArquivoEmBytes / 1048576).toString()));
        } else {
          this.fotosTemporarias.tamanhoTotal += arquivoUpload.tamanho;
          let index = 1000;
          for (let i = 0; i<1000; i++) {
            this.fotosTemporarias.fotos = []
            this.fotosTemporarias.fotos.push(event.target.files[0]);
            this.fotosTemporarias.mergeBase64 = await this.uploadService.concatenarArquivos(this.fotosTemporarias.fotos);
            const tamanhoTotalComNovaFoto = this.fotosTemporarias.tamanhoTotal + arquivoUpload.tamanho;
            console.log("TAMANO BASE64 MERGED " + this.bytesToSize(tamanhoTotalComNovaFoto));
            if (perf && perf.memory) {
              console.log("DEPOIS DO UPLOAD");
              console.log("jsHeapSizeLimit " + this.bytesToSize(perf.memory.jsHeapSizeLimit));
              console.log("totalJSHeapSize " + this.bytesToSize(perf.memory.totalJSHeapSize));
              console.log("usedJSHeapSize " + this.bytesToSize(perf.memory.usedJSHeapSize));
            }
          }
          // this.toggleLoader(false, true);
          // this.exibirConfirmacaoContinuarTirandoFoto();
        }
      }
     
      // this.toggleLoader(false, true);
      this.limparInputUpload();
    } catch (ex) {
      // this.toggleLoader(false, true);
      // this.exibirMensagemErro(ex);
      console.log(ex)
    }
  }

  private limparInputUpload() {
    if (this.uploadFile && this.uploadFile.nativeElement) {
      this.uploadFile.nativeElement.value = '';
    }
    if (this.tirarFoto && this.tirarFoto.nativeElement) {
      this.tirarFoto.nativeElement.value = '';
    }

    this.cancelarEdicaoNomeArquivoAnexado(null);
  }

  cancelarEdicaoNomeArquivoAnexado(indice: number) {
    if (indice === null) {
      this.arquivosAnexados.forEach(i => i.editando = false);
    } else {
      this.arquivosAnexados[indice].editando = false;
    }
    this.editandoArquivoAnexado = false;
    this.arquivosAnexadosForm.reset();
    this.caracteresEspeciais = false;
  }

  resetFotosTemporarias() {
    this.fotosTemporarias = { tamanhoTotal: 0, fotos: [], mergeBase64: '' };
  }

  private bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = +Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }

}