"use strict";
/// <reference path="node_modules\@types\jquery\index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var segundoParcial;
(function (segundoParcial) {
    var Empleado = /** @class */ (function (_super) {
        __extends(Empleado, _super);
        function Empleado(id, tipo, nombre, edad, foto) {
            var _this = _super.call(this, nombre, edad) || this;
            _this.id = id;
            _this.tipo = tipo;
            _this.foto = foto;
            return _this;
        }
        return Empleado;
    }(segundoParcial.Persona));
    segundoParcial.Empleado = Empleado;
})(segundoParcial || (segundoParcial = {}));
