<div class="container py-5">
    <a href="/login" class="text-decoration-none text-muted">Regresar</a>
	<form class="my-3">
		<div class="row mb-3">
            <div class="col-4">
                <input class="form-control" type="text" placeholder="Nombre(s)" aria-label="Nombre">
            </div>
            <div class="col-4">
                <input class="form-control" type="text" placeholder="Primer Apellido" aria-label="Primer Apellido">
            </div>
            <div class="col-4">
                <input class="form-control" type="text" placeholder="Segundo Apellido" aria-label="Segundo Apellido">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-4">
                <input class="form-control" type="text" placeholder="Matricula" aria-label="Matricula">
            </div>
            <div class="col-4">
                <select class="form-select" aria-label="Grado">
                    <option selected value="#">Grado</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            <div class="col-4">
                <input class="form-control" type="text" placeholder="Grupo" aria-label="Grupo">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <input class="form-control" type="text" placeholder="Correo Personal" aria-label="Correo Personal">
            </div>
            <div class="col-6">
                <input class="form-control" type="text" placeholder="Correo Institucional" aria-label="Correo Institucional">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-6">
                <input class="form-control" type="password" placeholder="Contraseña" aria-label="Contraseña">
            </div>
            <div class="col-6">
                <input class="form-control" type="password" placeholder="Confirmar contraseña" aria-label="Confirmar contraseña">
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-4">
                <select class="form-select" aria-label="Division Academica">
                    <option selected value="#">Division Academica</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            <div class="col-4">
                <select class="form-select" aria-label="Nivel Academico">
                    <option selected value="#">Nivel Academico</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            <div class="col-4">
                <select class="form-select" aria-label="Carrera">
                    <option selected value="#">Carrera</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
        </div>
        <div class="d-block">
            <button type="submit" class="btn btn-primary">Registrarse</button>
        </div>
	</form>
</div>

<!--

nombres
primer apellido
segundo apellido

matricula
Select de grado cuatrimestral
grupo (sólo es texto no entidad)

correo personal
correo institucional (usuario)

contraseña
confirmar contraseña

Select de division académica
Select de nivel académico
Select de carrera

-->