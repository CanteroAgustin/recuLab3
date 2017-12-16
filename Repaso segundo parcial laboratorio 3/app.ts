/// <reference path="node_modules\@types\jquery\index.d.ts" />

namespace segundoParcial {
    export let foto: string | null = null;
    export let empleados = new Array<Empleado>();
    let array;
    let indiceAModificar: number;

    /**
     * Al cargar la pagina se recuperan los datos de local storage
     * y se carga la tabla
     */
    $(function () {
        let lsArray;
        $("#btnAgregar").bind("click", segundoParcial.Agregar);
        $('#checkTipo').attr("checked", "true");
        $('#checkNombre').attr("checked", "true");
        $('#checkFoto').attr("checked", "true");
        $('#checkEdad').attr("checked", "true");

        lsArray = JSON.parse(String(localStorage.getItem("Empleados")));

        if (lsArray != null) {
            segundoParcial.empleados = lsArray;
            segundoParcial.armarTabla(segundoParcial.empleados);
        }

    });

    /**
     * Limpia todos los datos de local storage
     */
    export function Limpiar(): void {
        localStorage.clear();
        location.reload();
    }

    /**
     * agrega una persona nueva y vuelve a dibujar la tabla
     */
    export function Agregar(): void {
        $("#form").validate({
            rules: {
                id: {number: true, required: true},
                nombre: {lettersonly: true, required: true, minlength: 2},
                edad: {number: true, required: true},
                tipoForm: {required: true},
                foto: {required: true}
            }
        });

        if($("#form").valid()){   // test for validity
            let id: number = Number($('#id').val());
            let nombre: string = String($('#nombre').val());
            let edad: number = Number($('#edad').val());
            let tipo: segundoParcial.ETipoEmpleado = Number($('#tipoForm').val());
            let empleado: segundoParcial.Empleado = new segundoParcial.Empleado(id, tipo, nombre, edad, foto);

            let arr: any;
            empleados.push(empleado);
            arr = JSON.stringify(empleados);
            localStorage.setItem("Empleados", arr);
            arr = JSON.parse(arr);
            armarTabla(arr);
        } 
    }

    /**
     * Carga el promedio de las edades de todas las personas
     */
    export function cargarPromedio() {
        let prom: number = empleados.reduce(function (anterior: any, actual: Empleado) {
            return Number(anterior) + Number(actual.edad);
        }, 0) / empleados.length;
        if (!isNaN(prom)) {
            $("#promedio").val(prom + " años");
        }
        else {
            $("#promedio").val("Sin datos");
        }
    }

    /**
     * Dibuja la tabla con el Json de personas recibido
     * @param arr Json con los empleados para completar la tabla
     */
    export function armarTabla(arr: Array<Empleado>): void {
        let cont: number;
        if (!(arr.length > 0)) {
            $("#empleadosTable").html("");
        }
        var str = "<thead><tr>";
        $.each(arr[0], function (key2, value2) {
            str += "<th class='" + key2 + "'>" + key2 + "</th>";
        });
        str += "</tr></thead><tbody>";
        cont = 0;
        $.each(arr, function (key, value) {
            str += "<tr>";
            $.each(arr[key], function (key2, value2) {
                if (key2 != "foto") {
                    str += "<td class='" + key2 + "'>" + value2 + "</td>";
                } else {
                    str += "<td class=' " + key2 + " col-md-2  thumbnail '><img src='" + value2 + "'></td>";
                }
            });
            str += "<td <button class='borrar' onclick='segundoParcial.borrar(" + cont + ")'><button>Borrar</td>";
            str += "<td <button class='modificar' onclick='segundoParcial.modificar(" + cont + ")'><button>Modificar</td>";
            str += "</tr>";
            cont++;
        });
        str += "</tbody>";
        $("#empleadosTable").html(str);
        var checkTipo = $('#checkTipo').prop("checked");
        var checkNombre = $('#checkNombre').prop("checked");
        var checkFoto = $('#checkFoto').prop("checked");
        var checkEdad = $('#checkEdad').prop("checked");
        if (checkTipo == false) {
            $(".tipo").hide()
        } else {
            $(".tipo").show()
        }
        if (checkNombre == false) {
            $(".nombre").hide()
        } else {
            $(".nombre").show()
        }
        if (checkEdad == false) {
            $(".edad").hide()
        } else {
            $(".edad").show()
        }
        if (checkFoto == false) {
            $(".foto").hide()
        } else {
            $(".foto").show()
        }
        cargarPromedio();
    }

    /**
     * Toma la imagen cargada y la codifica para ser guardada.
     */
    export function encodeImageFileAsURL() {
        let filesSelected = $("#inputFileToLoad").prop('files');

        if (filesSelected.length > 0) {
            let fileToLoad = filesSelected[0];
            let fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                let target: any = fileLoadedEvent.target;
                let srcData = target.result;
                segundoParcial.foto = srcData;
            }
            fileReader.readAsDataURL(fileToLoad);
        }
    }

    /**
     * Arma la tabla filtrada
     * @param arr Json de personas con los filtros aplicados para armar la tabla
     */
    export function ocultarColumnas(arr: Array<Empleado>): void {
        let ls: string | null = localStorage.getItem("Empleados");
        if (ls != null) {
            armarTabla(JSON.parse(ls));
        }
    }

    /**
     * Filtra la tabla segun el tipo de empleado seleccionado
     */
    export function filterBySelect() {
        if ($("#tipo").val() != 0) {
            let arr: any = empleados.filter(function (e) {
                if (e.tipo == $("#tipo").val()) {
                    let tipoSelect = $("#tipo").val()
                    let tipoObtained = e.tipo;
                    return e
                }
            });
            arr = JSON.stringify(arr);
            arr = JSON.parse(arr);
            armarTabla(arr);
        } else {
            armarTabla(empleados);
        }
    }

    /**
     * Carga en el formulario los datos de la persona seleccionada y
     * cambia el manejador del evento del boton agregar para que apunte al manejador
     * capaz de modificar la persona seleccionada
     * @param i indice de la persona a modificar
     */
    export function modificar(i: number) {
        $("#id").val(empleados[i].id);
        $("#tipoForm").val(empleados[i].tipo);
        $("#nombre").val(empleados[i].nombre);
        $("#edad").val(empleados[i].edad);
        indiceAModificar = i;
        $("#btnAgregar").unbind("click", segundoParcial.Agregar);
        $("#btnAgregar").bind("click", segundoParcial.AgregarModificado);
        $("#btnAgregar").val("Modificar");
    }

    /**
     * Modifica la persona con los datos cargados en el formulario
     * cambia el manejador del boton agregar al original
     */
    export function AgregarModificado() {
        let arr: any;
        empleados[indiceAModificar].id = Number($("#id").val());
        empleados[indiceAModificar].tipo = Number($("#tipoForm").val());
        empleados[indiceAModificar].nombre = String($("#nombre").val());
        if (foto != null) {
            empleados[indiceAModificar].foto = foto;
        }
        empleados[indiceAModificar].edad = Number($("#edad").val());

        arr = JSON.stringify(empleados)
        localStorage.setItem("Empleados", arr);
        arr = JSON.parse(arr);
        armarTabla(arr);
        $("#btnAgregar").unbind("click", segundoParcial.AgregarModificado);
        $("#btnAgregar").bind("click", segundoParcial.Agregar);
        $("#btnAgregar").val("Agregar");
    }

    /**
     * Borra el empleado seleccionado
     * @param i indice del empleado a borrar
     */
    export function borrar(i: number) {
        let arr: any;
        empleados.splice(i, 1);
        arr = JSON.stringify(empleados)
        localStorage.setItem("Empleados", arr);
        arr = JSON.parse(arr);
        armarTabla(arr);
    }

}