<script>
	import { browser } from "$app/env";
	//import logoUT from '$lib/assets/img/LOGO_UTEZ.png'
	let logoUT = "/img/LOGO_BLANCO2016.png"
	let logoDeportes = "/img/HALCÓN_BLANCO2016.png"

	let hasToken;
	if (browser){
		hasToken = localStorage.getItem("token");
	}
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-blue" >
	<div class="container-fluid " >
		<img alt="Logo universitario" width="70em;" src="{logoUT}"/>
		
		<div class="d-flex text-white ms-2" style="height: 3em;">
			<div class="vr"></div>
		</div>

		<img alt="Logo de deportes" width="60em;" src="{logoDeportes}"/>

		<a class="navbar-brand ms-2" href="/">
			Talleres Utez
		</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNavAltMarkup"
			aria-controls="navbarNavAltMarkup"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse " id="navbarNavAltMarkup">
			<div class="navbar-nav me-auto mb-2 mb-lg-0">
				<a class="nav-link " href="/avisos">Avisos</a>
				<a class="nav-link " href="/talleres">Talleres</a>
			</div>
			
			{#if hasToken}
			<ul class="navbar-nav  ">
				<li class="nav-item dropdown ">
					<a
						class="nav-link dropdown-toggle "
						id="navbarDarkDropdownMenuLink"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Administrador
					</a>
					<ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end bg-blue-2" aria-labelledby="navbarDarkDropdownMenuLink">
						<li><a class="dropdown-item" href="/admin/talleres/panel">Talleres</a></li>
						<li><a class="dropdown-item" href="/admin/avisos/panel">Avisos</a></li>
						<li><a class="dropdown-item" href="/admin/instructores/panel">Instructores</a></li>
						<li><a class="dropdown-item" href="/admin/alumnos/panel">Alumnos</a></li>
						<li><a class="dropdown-item" href="/admin/divisiones/panel">Divisiones Académicas</a></li>
						<li><a class="dropdown-item" href="/admin/niveles/panel">Niveles Académicos</a></li>
						<li><a class="dropdown-item" href="/admin/cuatrimestres/panel">Cuatrimestres</a></li>
						<li><a class="dropdown-item" href="/admin/carreras/panel">Carreras</a></li>
						<li><a class="dropdown-item" href="/admin/periodo/panel">Periodo</a></li>
					</ul>
				</li>
			</ul>
			{:else}
			<div class="navbar-nav">
				<a class="nav-link " href="/login">Iniciar Sesión</a>
			</div>
			{/if}
		</div>
	</div>
</nav>

<style>
	.bg-blue{
		background:#094670 !important;
	}

	.bg-blue-2{
		background:#0A4F7D !important;
		
	}

	.txt-white{
		color:#eeeeee !important;
	}

	.txt-white:hover{
		color:#fafafa !important;
	}
</style>
