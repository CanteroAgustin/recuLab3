"use strict";
/// <reference path="node_modules\@types\jquery\index.d.ts" />
var segundoParcial;
(function (segundoParcial) {
    segundoParcial.foto = null;
    segundoParcial.empleados = new Array();
    var array;
    var indiceAModificar;
    /**
     * Al cargar la pagina se recuperan los datos de local storage
     * y se carga la tabla
     */
    $(function () {
        var lsArray;
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
    function Limpiar() {
        localStorage.clear();
        location.reload();
    }
    segundoParcial.Limpiar = Limpiar;
    /**
     * agrega una persona nueva y vuelve a dibujar la tabla
     */
    function Agregar() {
        $("#form").validate({
            rules: {
                id: { number: true, required: true },
                nombre: { lettersonly: true, required: true, minlength: 2 },
                edad: { number: true, required: true },
                tipoForm: { required: true },
                foto: { required: true }
            }
        });
        if ($("#form").valid()) {
            var id = Number($('#id').val());
            var nombre = String($('#nombre').val());
            var edad = Number($('#edad').val());
            var tipo = Number($('#tipoForm').val());
            var empleado = new segundoParcial.Empleado(id, tipo, nombre, edad, segundoParcial.foto);
            var arr = void 0;
            segundoParcial.empleados.push(empleado);
            arr = JSON.stringify(segundoParcial.empleados);
            localStorage.setItem("Empleados", arr);
            arr = JSON.parse(arr);
            armarTabla(arr);
        }
    }
    segundoParcial.Agregar = Agregar;
    /**
     * Carga el promedio de las edades de todas las personas
     */
    function cargarPromedio() {
        var prom = segundoParcial.empleados.reduce(function (anterior, actual) {
            return Number(anterior) + Number(actual.edad);
        }, 0) / segundoParcial.empleados.length;
        if (!isNaN(prom)) {
            $("#promedio").val(prom + " años");
        }
        else {
            $("#promedio").val("Sin datos");
        }
    }
    segundoParcial.cargarPromedio = cargarPromedio;
    /**
     * Dibuja la tabla con el Json de personas recibido
     * @param arr Json con los empleados para completar la tabla
     */
    function armarTabla(arr) {
        var cont;
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
                }
                else {
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
            $(".tipo").hide();
        }
        else {
            $(".tipo").show();
        }
        if (checkNombre == false) {
            $(".nombre").hide();
        }
        else {
            $(".nombre").show();
        }
        if (checkEdad == false) {
            $(".edad").hide();
        }
        else {
            $(".edad").show();
        }
        if (checkFoto == false) {
            $(".foto").hide();
        }
        else {
            $(".foto").show();
        }
        cargarPromedio();
    }
    segundoParcial.armarTabla = armarTabla;
    /**
     * Toma la imagen cargada y la codifica para ser guardada.
     */
    function encodeImageFileAsURL() {
        var filesSelected = $("#inputFileToLoad").prop('files');
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                var target = fileLoadedEvent.target;
                var srcData = target.result;
                segundoParcial.foto = srcData;
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    }
    segundoParcial.encodeImageFileAsURL = encodeImageFileAsURL;
    /**
     * Arma la tabla filtrada
     * @param arr Json de personas con los filtros aplicados para armar la tabla
     */
    function ocultarColumnas(arr) {
        var ls = localStorage.getItem("Empleados");
        if (ls != null) {
            armarTabla(JSON.parse(ls));
        }
    }
    segundoParcial.ocultarColumnas = ocultarColumnas;
    /**
     * Filtra la tabla segun el tipo de empleado seleccionado
     */
    function filterBySelect() {
        if ($("#tipo").val() != 0) {
            var arr = segundoParcial.empleados.filter(function (e) {
                if (e.tipo == $("#tipo").val()) {
                    var tipoSelect = $("#tipo").val();
                    var tipoObtained = e.tipo;
                    return e;
                }
            });
            arr = JSON.stringify(arr);
            arr = JSON.parse(arr);
            armarTabla(arr);
        }
        else {
            armarTabla(segundoParcial.empleados);
        }
    }
    segundoParcial.filterBySelect = filterBySelect;
    /**
     * Carga en el formulario los datos de la persona seleccionada y
     * cambia el manejador del evento del boton agregar para que apunte al manejador
     * capaz de modificar la persona seleccionada
     * @param i indice de la persona a modificar
     */
    function modificar(i) {
        $("#id").val(segundoParcial.empleados[i].id);
        $("#tipoForm").val(segundoParcial.empleados[i].tipo);
        $("#nombre").val(segundoParcial.empleados[i].nombre);
        $("#edad").val(segundoParcial.empleados[i].edad);
        indiceAModificar = i;
        $("#btnAgregar").unbind("click", segundoParcial.Agregar);
        $("#btnAgregar").bind("click", segundoParcial.AgregarModificado);
        $("#btnAgregar").val("Modificar");
    }
    segundoParcial.modificar = modificar;
    /**
     * Modifica la persona con los datos cargados en el formulario
     * cambia el manejador del boton agregar al original
     */
    function AgregarModificado() {
        var arr;
        segundoParcial.empleados[indiceAModificar].id = Number($("#id").val());
        segundoParcial.empleados[indiceAModificar].tipo = Number($("#tipoForm").val());
        segundoParcial.empleados[indiceAModificar].nombre = String($("#nombre").val());
        if (segundoParcial.foto != null) {
            segundoParcial.empleados[indiceAModificar].foto = segundoParcial.foto;
        }
        segundoParcial.empleados[indiceAModificar].edad = Number($("#edad").val());
        arr = JSON.stringify(segundoParcial.empleados);
        localStorage.setItem("Empleados", arr);
        arr = JSON.parse(arr);
        armarTabla(arr);
        $("#btnAgregar").unbind("click", segundoParcial.AgregarModificado);
        $("#btnAgregar").bind("click", segundoParcial.Agregar);
        $("#btnAgregar").val("Agregar");
    }
    segundoParcial.AgregarModificado = AgregarModificado;
    /**
     * Borra el empleado seleccionado
     * @param i indice del empleado a borrar
     */
    function borrar(i) {
        var arr;
        segundoParcial.empleados.splice(i, 1);
        arr = JSON.stringify(segundoParcial.empleados);
        localStorage.setItem("Empleados", arr);
        arr = JSON.parse(arr);
        armarTabla(arr);
    }
    segundoParcial.borrar = borrar;
})(segundoParcial || (segundoParcial = {}));
