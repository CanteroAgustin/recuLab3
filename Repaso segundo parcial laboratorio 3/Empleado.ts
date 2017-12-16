/// <reference path="node_modules\@types\jquery\index.d.ts" />

namespace segundoParcial {

    export class Empleado extends Persona {
        public id:number;
        public tipo:ETipoEmpleado;
        public foto:string|null;
        
        public constructor(id:number, tipo:ETipoEmpleado,nombre:string,edad:number,foto:string|null){
            super(nombre, edad);
            this.id = id;
            this.tipo = tipo;
            this.foto = foto;
        }
    }
}

    