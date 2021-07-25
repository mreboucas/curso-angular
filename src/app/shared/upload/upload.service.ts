import { UtilFormatador } from './../../util/util-formatador';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { ArquivoUpload } from '../models/arquivo-upload.model';

@Injectable({ providedIn: 'root' })
export class UploadService {

  private arquivosPermitidos: string[] = ['png', 'jpeg', 'jpg', 'gif', 'pdf'];
  public readonly mensagemErroTamanhoMaximoArquivo = 'O arquivo excede o tamanho máximo de {0}MB permitido. Verifique as configurações do seu dispositivo e/ou tamanho da imagem e tente novamente.';
  constructor(private _sanitizer: DomSanitizer) { }

  async upload(event: any, tamanhoMaximoArquivoEmBytes: number, extensoesPermitidas: string[] = null): Promise<ArquivoUpload> {
    if (!event || !event.target.files
      || event.target.files.length <= 0) {
      console.log('No file selected.');
      return Promise.resolve(null);
    }

    const arquivo = event.target.files[0];

    const blob = arquivo.slice(0, arquivo.size, arquivo.type);

    const nomeArquivoTratado = UtilFormatador.obterNomeArquivoComExtensao(arquivo.name);
    const newFile = new Blob([blob], { type: arquivo.type });

    let arqPermitido: boolean = false;

    const extensaoArquivo = UtilFormatador.obterNomeArquivoComExtensao(arquivo.name.toLowerCase());
    const extensoesValidas = extensoesPermitidas ? extensoesPermitidas : this.arquivosPermitidos;
    if (extensoesValidas.indexOf(extensaoArquivo.extensao) > -1) {
      arqPermitido = true;
    }

    if (!arqPermitido) {
      return Promise.reject(`Formato de arquivo não permitido!`);
    }

    const arquivoBase64 = await this.convertToBase64(newFile);

    // console.log(arquivoBase64);

    const txtSplit = arquivoBase64.toString().split('base64,');

    const arquivoBase64Split = txtSplit[1];

    const arquivoUpload = new ArquivoUpload();
    arquivoUpload.id = moment().unix();
    arquivoUpload.nome = nomeArquivoTratado.nomeComExtensao;
    arquivoUpload['representacao-base64'] = arquivoBase64Split;
    arquivoUpload.tamanho = newFile.size;
    arquivoUpload.tipo = newFile.type;
    arquivoUpload['image-path'] = this._sanitizer.bypassSecurityTrustResourceUrl(arquivoBase64.toString());
    arquivoUpload.extensao = nomeArquivoTratado.extensao;

    if (arquivoUpload.tamanho > tamanhoMaximoArquivoEmBytes) {
      return Promise.reject(UtilFormatador.formatarString(this.mensagemErroTamanhoMaximoArquivo, (tamanhoMaximoArquivoEmBytes / 1048576).toString()));
    }

    return Promise.resolve(arquivoUpload);
  }

  private convertToBase64(arquivo: Blob): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const fileReader = new FileReader();
      if (fileReader && arquivo) {
        fileReader.readAsDataURL(arquivo);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject('No file provided');
      }
    });
  }

  async concatenarBase64(arquivosBase64: any[] = [], retornarPrefixoBase64: boolean = false, config = {}) {
    const { quanlity } = {
      quanlity: 1,
      ...config,
    };

    const imgs = await Promise.all(arquivosBase64.map(async a => await this.converterBase64ParaImagem(a)));
    const { width, height } = this.calcularTamanhoCanvas(imgs);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let curTop = 0
    const imageContext = canvas.getContext('2d');
    imgs.forEach(img => {
      imageContext.drawImage(img, 0, curTop);
      curTop += img.height;
    });

    const imageUrl = canvas.toDataURL('image/jpeg', quanlity);

    return retornarPrefixoBase64 ? imageUrl : this.removerPrefixoBase64(imageUrl);
  }

  removerPrefixoBase64(imageUrl: string) {
    if (imageUrl && imageUrl.indexOf('base64,') !== -1) {
      return imageUrl.split('base64,')[1];
    }
    return imageUrl;
  }

  async concatenarArquivos(arquivos: any = [], retornarPrefixoBase64: boolean = false, config: any = {}) {
    let arquivosBase64 = await Promise.all([...arquivos].map(async a => await this.converterArquivoParaImagem(a)));
    return this.concatenarBase64(arquivosBase64, retornarPrefixoBase64, config);
  }

  converterArquivoParaImagem(arquivo): any {
    return URL.createObjectURL(arquivo);
  }

  converterBase64ParaImagem(imagem: any): any {
    return new Promise((resolve, reject) => {
      var img = new Image()
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
      img.src = imagem;
    });
  }

  calcularTamanhoCanvas(imgs = []): any {
    let width = 0;
    let height = 0;
    imgs.forEach(img => {
      width = Math.max(width, img.width);
      height += img.height;
    });

    return { width, height };
  }

  obterArquivoUploadMultiplaFotos(fotosTemporarias: any): ArquivoUpload {
    const arquivoUpload = new ArquivoUpload();
    arquivoUpload.id = moment().unix();
    arquivoUpload.nome = UtilFormatador.obterNomeArquivoGenerico('jpeg');
    arquivoUpload['representacao-base64'] = fotosTemporarias.mergeBase64;
    arquivoUpload.tamanho = fotosTemporarias.tamanhoTotal;
    arquivoUpload.tipo = 'image/jpeg';
    arquivoUpload['image-path'] = this._sanitizer.bypassSecurityTrustResourceUrl(fotosTemporarias.mergeBase64.toString());
    arquivoUpload.extensao = 'jpeg';

    return arquivoUpload;
  }

}
