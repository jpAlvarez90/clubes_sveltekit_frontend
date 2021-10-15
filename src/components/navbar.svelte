<script>
	import { browser } from "$app/env";
	let hasToken;
	if (browser){
		hasToken = localStorage.getItem("token");
	}
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Talleres Utez</a>
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
		<div class="collapse navbar-collapse" id="navbarNavAltMarkup">
			<div class="navbar-nav me-auto mb-2 mb-lg-0">
				<a class="nav-link" href="/avisos">Avisos</a>
				<a class="nav-link" href="/talleres">Talleres</a>
			</div>
			{#if hasToken}
				<ul class="navbar-nav">
					<li class="nav-item dropdown">
						<a
						class="nav-link dropdown-toggle"
						id="navbarDarkDropdownMenuLink"
						role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
							>
							Administrador
						</a>
						<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDarkDropdownMenuLink">
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
					<a class="nav-link" href="/login">Iniciar Sesion</a>
				</div>
			{/if}
		</div>
	</div>
</nav>

