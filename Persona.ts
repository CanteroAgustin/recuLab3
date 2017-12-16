namespace segundoParcial {

    export abstract class Persona {
        public nombre:string;
        public edad:number;

        public constructor(nombre:string,edad:number){
            this.nombre = nombre;
            this.edad = edad;
        }
    }
}


