
export default class StringUtils {
    static abreviarNome(nome: string, maxLength: number): string {

        if (!nome) {
            return null;
        }
        let partes: string[] = nome.split(/[\s,]+/);
        // let len: string = partes.reduce((a, b) => a + b, partes.length - 1);
        let tamanhoTotal: number = nome.length;
        if (tamanhoTotal <= maxLength) {
            // remontando o nome porque o nome original poderia ter mais de um espaço entre
            // cada parte
            return partes.reduce((a, b) => a + " " + b);
        }

        if (partes.length == 1) {
            return nome.substring(0, maxLength);
        }
    
        let comeco: string[] = [];
    
        let meio: number = Math.trunc(partes.length / 2);
        for (var i = 0; i < meio; i++) {
            let parte: string = partes.shift();
            comeco.unshift(parte);
        }
    
        let turn: Boolean = true;
        let resultado: string[] = [];
        while (tamanhoTotal > maxLength && partes.length > 0) {
            let delta: number;
            if (turn && comeco.length > 0) {
                let parte: string = comeco.shift();
                let abreviacao: string = parte.substring(0, 1);
                delta = parte.length - 1;
                resultado.unshift(abreviacao);
            } else {
                let parte: string = partes.shift();
                let abreviacao: string = parte.substring(0, 1);
                delta = parte.length - 1;
                resultado.push(abreviacao);
            }
    
            turn = !turn;
            tamanhoTotal -= delta;
        }
    
        comeco.forEach(e => resultado.unshift(e));
        partes.forEach(e => resultado.push(e));
    
        let nomeAbreviado: string = resultado.reduce((a, b) => a + " " + b);
    
        if (nomeAbreviado.length > maxLength) {
            nomeAbreviado = nomeAbreviado.substring(0, maxLength);
        }
        return nomeAbreviado;
     }
}
