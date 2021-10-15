<script>
	import { PublicFunctions } from './../scripts/PublicFunctions.js';
	
	const doTest = async ()=>{
		console.log((await PublicFunctions.doTest()))
	}

</script>


<div class="container py-5">
	<form>
		<div class="mb-3">
			<label for="email" class="form-label">Email</label>
			<input
				type="email"
				class="form-control"
				id="email"
				aria-describedby="emailHelp"
			/>
			<div id="emailHelp" class="form-text">Nunca muestres tu email a alguien más</div>
		</div>
		<div class="mb-3">
			<label for="password" class="form-label">Contraseña</label>
			<input type="password" class="form-control" id="password" />
		</div>
		<div class="mb-3 form-check">
			<input type="checkbox" class="form-check-input" id="checkbox" />
			<label class="form-check-label" for="checkbox">Recordarme</label>
		</div>
        <div class="d-block">
            <button type="submit" class="btn btn-primary">Iniciar sesión</button>
            <a href="/registro" class="px-3 text-decoration-none text-muted">Registrarse</a>
        </div>
	</form>

	<button on:click="{()=>doTest()}">Click me!</button>
</div>
