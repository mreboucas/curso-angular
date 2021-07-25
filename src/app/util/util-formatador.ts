import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilFormatador {

  /**
   * Retira a mascara do telefone caso tenha
   * @param telefone
   */
  static formataTelefone(telefone: string): string {
    let telefoneFormatado: string = '';
    if (telefone !== null && telefone !== undefined && telefone !== '') {
      if (telefone.indexOf('-') >= 0) {
        telefoneFormatado = telefone.replace('-', '');
        if (telefoneFormatado.indexOf('-') >= 0) {
          telefoneFormatado = telefoneFormatado.replace('-', '');
        }
      } else {
        telefoneFormatado = telefone;
      }
    }
    if (telefoneFormatado !== '' && telefoneFormatado !== null && telefoneFormatado !== undefined) {
      return telefoneFormatado;
    } else {
      return null;
    }
  }

  /**
   * Retira a mascara do cep caso tenha
   * @param cep
   */
  static formataCep(cep: string): string {
    let cepFormatado: string = '';
    if (cep !== null && cep !== undefined && cep !== '') {
      if (cep.indexOf('-') >= 0) {
        cepFormatado = cep.replace('-', '');
      } else {
        cepFormatado = cep;
      }
    }
    return cepFormatado;
  }

  static formataSexo(sexo: string): string {
    let sexoFormatado: string = '';
    if (sexo !== null && sexo !== undefined && sexo !== '') {
      sexoFormatado = sexo.toUpperCase() === 'MASCULINO' ? 'M' : (sexo.toUpperCase() === 'FEMININO' ? 'F' : '');
    }
    return sexoFormatado;
  }

  static formataDataDDMMYYYY(data: string, mascaraOrigem: string, mascaraDestino: string = 'DDMMYYYY', useLocale: boolean = false): string {
    let dataFormatada: string = '';
    if (data !== null && data !== undefined && data !== '') {
      dataFormatada = useLocale ? moment(data, mascaraOrigem).locale('pt-br').format(mascaraDestino) : moment(data, mascaraOrigem).format(mascaraDestino);
    }
    return dataFormatada;
  }

  static formatarData(data: string, mascaraDestino: string, useLocale: boolean = false): string {
    let dataFormatada: string = '';
    if (data !== null && data !== undefined && data !== '') {
      dataFormatada = useLocale ? moment(data).locale('pt-br').format(mascaraDestino) : moment(data).format(mascaraDestino);
    }
    return dataFormatada;
  }

  /**
   * Recebe uma data no formato YYYYMMDD e formata para DD/MM/YYYY
   * @param data
   * @param dataFormatada
   */
  static formataDataMascara(data: string): string {
    let dataFormatada: string = '';
    if (data !== null && data !== undefined && data !== '') {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return dataFormatada;
  }

  /**
   * Recebe uma data no formato YYYYMMDD e formata para DD/MM/YYYY HH:mm
   * @param data
   * @param dataFormatada
   */
  static formataDataHoraMascara(data: string): string {
    let dataFormatada: string = '';
    if (data !== null && data !== undefined && data !== '') {
      dataFormatada = moment(data).locale('pt-BR').format('DD/MM/YYYY HH:mm');
    }
    return dataFormatada;
  }

  /**
   * Recebe uma data/hora sem GMT e converte a data/hora para o GMT do navegador
   * @param data
   * @param dataFormatada
   * @example 2019-05-09T15:00:16.01 -> 09/05/2019 12:00
   */
  static formataDataHoraUTCMascara(data: string): string {
    let dataFormatada: string = '';
    if (data !== null && data !== undefined && data !== '') {
      dataFormatada = moment(moment(data).valueOf() + moment(data).utcOffset() * 60000).locale('pt-BR').format('DD/MM/YYYY HH:mm');
    }
    return dataFormatada;
  }

  /**
   *
   * @param estadoCivil
   */
  static formataEstadoCivil(estadoCivil: string): string {
    let estadoCivilFormatado: string = '';
    if (estadoCivil !== null && estadoCivil !== undefined && estadoCivil !== '') {
      if (estadoCivil.toUpperCase().indexOf('(A)') > 0) {
        estadoCivilFormatado = estadoCivil.toUpperCase().replace('(A)', '').toUpperCase().trim();
      } else {
        estadoCivilFormatado = estadoCivil.toUpperCase().trim();
      }
    }
    return estadoCivilFormatado;
  }

  static numeroParaValorEmReal(valor: number, adicionarCifrao: boolean = false): string {
    if (valor === undefined || valor === null) {
      return '';
    }
    const valorFormatado = (valor).toFixed(2).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
    return (adicionarCifrao ? 'R$ ' : '') + valorFormatado;
  }

  static formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
  }

  static formatarCNPJ(cpf: string): string {
    return cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4-\$5');
  }

  static truncarTexto(texto: string, limite: number): string {
    if (!texto) {
      return '';
    }

    texto = texto.trim();
    return texto.length > limite ? texto.substring(0, limite) : texto.trim();
  }

  static padLeft(texto: string, tamanho: number, padString: string = '0'): string {
    tamanho = tamanho - texto.length + 1;
    return tamanho > 0 ?
      new Array(tamanho).join(padString) + texto : texto;
  }

  static capitalizeFirstLetter(texto: string): string {
    if (!texto) {
      return texto;
    }
    if (texto.indexOf(' ') > 0) {
      let fraseFormatada = '';
      const palavra = texto.split(' ');
      for (let index = 0; index < palavra.length; index++) {
        fraseFormatada += palavra[index].charAt(0).toUpperCase() + palavra[index].toLowerCase().slice(1) + ' ';
      }

      return fraseFormatada.trim();
    } else {
      return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
  }

  static formatarString(str: string, ...args: string[]) {
    return str.replace(/{(\d+)}/g, (match, index) => args[index] || '');
  }

  static removerItensDuplicados(lista: Array<any>): Array<any> {
    return lista.filter((item, index) => {
      return lista.indexOf(item) === index;
    });
  }

  static removerPontuacao(item: string) {
    return item ? item.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') : item;
  }

  static removerPontuacaoNoArquivo(item: string) {
    return item.replace(/[^a-zA-Z0-9. _-]/g, '');
  }


  static sortBy(lista: Array<any>, chave: string, direcao: string = 'asc'): Array<any> {
    return direcao === 'asc'
      ? lista.sort((a, b) => (a[chave] > b[chave]) ? 1 : ((b[chave] > a[chave]) ? -1 : 0))
      : lista.sort((a, b) => (a[chave] < b[chave]) ? 1 : ((b[chave] < a[chave]) ? -1 : 0));
  }

  static deepCopy(dados: any): any {
    return JSON.parse(JSON.stringify(dados));
  }

  static removeAcentos(text: string) {
    text = text.replace(new RegExp('[ÁÀÂÃÄ]', 'g'), 'A');
    text = text.replace(new RegExp('[áàâãä]', 'g'), 'a');
    text = text.replace(new RegExp('[ÉÈÊË]', 'g'), 'E');
    text = text.replace(new RegExp('[éèêë]', 'g'), 'e');
    text = text.replace(new RegExp('[ÍÌÎÏ]', 'g'), 'I');
    text = text.replace(new RegExp('[íìîï]', 'g'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕÖ]', 'g'), 'O');
    text = text.replace(new RegExp('[óòôôö]', 'g'), 'o');
    text = text.replace(new RegExp('[ÚÙÛÜ]', 'g'), 'U');
    text = text.replace(new RegExp('[úùûü]', 'g'), 'u');
    text = text.replace(new RegExp('[Ç]', 'g'), 'C');
    text = text.replace(new RegExp('[ç]', 'g'), 'c');

    return text;
  }

  static obterNomeArquivoComExtensao(nomeArquivo: string, removerAcentuacao: boolean = true): { nomeSemExtensao: string, extensao: string, nomeComExtensao: string } {
    let nome = nomeArquivo;
    const splitedName = nome.split('.');
    const extensao = splitedName[splitedName.length - 1];
    const spliced = JSON.parse(JSON.stringify(splitedName));
    spliced.splice(splitedName.length - 1, 1);

    nome = spliced.join('.');

    if (removerAcentuacao) {
      nome = UtilFormatador.removeAcentos(nome);
      nome = UtilFormatador.removerPontuacaoNoArquivo(nome);
    }

    if (!nome.length) {
      nome = this.obterNomeArquivoGenerico();
    }

    return {
      extensao,
      nomeSemExtensao: nome,
      nomeComExtensao: nome += '.' + extensao
    };
  }

  static formatarCPFOuCNPJ(documento: string): string {
    return documento.length === 11 ? this.formatarCPF(documento) : this.formatarCNPJ(documento);
  }

  static obterNomeArquivoGenerico(extensao: string = '') {
    let nomeArquivo = 'Arquivo-' + moment().unix();
    if (extensao) {
      nomeArquivo += '.' + extensao
    }
    return nomeArquivo;
  }

  static formatarTelefoneComDDD(telefone: string): string {
    if (!telefone) {
      return telefone;
    }
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/^(\d{2})(\d)/g, '($1) $2');
    telefone = telefone.replace(/(\d)(\d{4})$/, '$1-$2');
    return telefone;
  }

  static verificaCaractereEspecial(input: string): boolean {
    const nome = /[^a-zA-Z0-9. _-]/;
    return nome.test(input);
  }

  static abreviarNome(nome: string, maxLength: number = 35): string {
    nome = nome ? nome.trim() : nome;

    if (!nome || !maxLength) {
      return null;
    }
    let partes: string[] = nome.split(/[\s,]+/);
    let tamanhoTotal: number = nome.length;
    if (tamanhoTotal <= maxLength) {
      // remontando o nome porque o nome original poderia ter mais de um espaço entre
      // cada parte
      return partes.reduce((a, b) => a + ' ' + b);
    }

    if (partes.length == 1) {
      return nome.substring(0, maxLength);
    }

    const primeiroNome = partes.splice(0, 1)[0];
    const ultimoSobrenome = partes.splice(partes.length - 1, 1)[0];
    const qtdeEspacos = 2;
    const sobrenomesParaIgnorar = ['da', 'de', 'di', 'do', 'du', 'e'];
    const tamanhoRestante = maxLength - (primeiroNome.length + ultimoSobrenome.length + qtdeEspacos);
    const partesTemp = [].concat(partes);

    let sobrenomeComAbreviacoes = '';
    let contador = 0;
    let sobrenomeComAbreviacoesConcatenado = '';
    while (partes.length > 0) {
      const sobrenome = partes.splice(0, 1)[0];
      const sobrenomeAbreviado = sobrenomesParaIgnorar.indexOf(sobrenome) === -1 ? sobrenome.substring(0, 1) : '';
      partesTemp[contador] = sobrenomeAbreviado;

      if (sobrenomeAbreviado) {
        sobrenomeComAbreviacoesConcatenado += `${sobrenomeAbreviado} `;
      }

      if (sobrenomeComAbreviacoesConcatenado.length >= tamanhoRestante) {
        const sobrenomeTemp = sobrenomeComAbreviacoesConcatenado.trim();
        const sobrenomeFinal = sobrenomeTemp.length > tamanhoRestante ? tamanhoRestante : sobrenomeTemp.length;
        sobrenomeComAbreviacoes = sobrenomeComAbreviacoesConcatenado.substring(0, sobrenomeFinal);
        break;
      }

      const sobrenomeAbreviadoTemp = partesTemp.filter(Boolean).join(' ').trim();
      if (sobrenomeAbreviadoTemp.length <= tamanhoRestante) {
        sobrenomeComAbreviacoes = sobrenomeAbreviadoTemp;
        break;
      }

      contador++;
    }

    return `${primeiroNome} ${sobrenomeComAbreviacoes.trim()} ${ultimoSobrenome}`;
  }
}
