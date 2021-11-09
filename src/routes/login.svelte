<script>
  import { onMount } from 'svelte';
	import axiosapi from '../utils/axiosapi';
  import { goto } from '$app/navigation';


  let emailReset = '';
	let instEmailElement;
	let flagInstEmail = false;
	let instEmailFeedback = [];
	let user = {
		email:'',
    password: ''
	};

	const login = () => {
		axiosapi.doPost("/auth/signin",user).then(({data})=>{
      if(data.token != null){
        let user = {"idUser":data.id, "username": data.user};
        Swal.fire({
          title: 'Bienvenido',
          confirmButtonColor: '#0D6EFD',
          icon: 'success'
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('ROLE', data.ROLE);
        localStorage.setItem('user', JSON.stringify(user));
        goto('/');
        location.reload();
      }else{
        Swal.fire({
          title: 'Error',
          text: '¡Correo y/o contraseña incorrectos!',
          confirmButtonColor: '#0D6EFD',
          icon: 'error'
        });
      }

		}).catch((err)=>{
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: '¡Correo y/o contraseña incorrectos!',
				confirmButtonColor: '#0D6EFD',
				icon: 'error'
			});
		});
	}

  const sendEmail = () => {
    axiosapi.doPost("/auth/sendEmail/password-recovery", {email: emailReset})
    .then(({emailSent})=>{

      console.log(emailSent);
      Swal.fire({
        title: 'Correo enviado corectamente',
        confirmButtonColor: '#0D6EFD',
        icon: 'success'
      });
      goto('/');
      location.reload();
		}).catch((err)=>{
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: '¡Algo ha salido mal en el servidor!',
				confirmButtonColor: '#0D6EFD',
				icon: 'error'
			});
		});
  }

  const verifyInstEmail = (valor) => {
		var regex = /^([a-zA-Z0-9_\.])+@utez\.edu\.mx$/;
		var correoVal = regex.test(valor);
		return correoVal;
	};

  const validate = () => {
    instEmailElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagInstEmail = true

			instEmailFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				instEmailFeedback.push('Completa el campo')
				flagInstEmail = false
			}
			if(!verifyInstEmail(value)){
				event.target.className =  classElement +' is-invalid'
				instEmailFeedback.push('El correo electrónico debe pertenecer al dominio @utez.edu.mx')
				flagInstEmail = false
			}
		})
  }

  onMount(() => {
		validate()
  });
</script>
<div id="main">
  <div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-4 fw-bold lh-1 mb-3">Talleres UTEZ</h1>
        <p class="col-lg-10 fs-4">Talleres deportivos y culturales.</p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form class="p-4 p-md-5 border rounded-3 bg-light">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" bind:value="{user.email}">
            <label for="floatingInput">Correo institucional</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" bind:value="{user.password}">
            <label for="floatingPassword">Contraseña</label>
          </div>
          <div class="checkbox mb-3">
            <!-- <label>
              <input type="checkbox" value="remember-me"> Recordarme
            </label> -->
          </div>
          <button on:click="{()=>{login()}}" class="w-100 btn btn-lg btn-primary" type="button">Iniciar sesión</button>
          <hr class="my-4">
          <span class="row text-center">
            <span>
              <small class="text-muted">No tengo cuenta</small>
              <a class="text-muted" href="/registro"> Registrarme</a>
            </span><br/>
            <span>
              <small class="text-muted"
                id="resetpsw"
                data-bs-toggle="modal" 
                data-bs-target="#exampleModal" 
                data-bs-whatever="@getbootstrap">
                Olvidé mi contraseña</small>
            </span>
          </span>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Reestablcer contraseña -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Reestablecer contraseña</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="mb-4">
            <p id="resetinfo">Se enviará un enlace para reestablecer la contraseña a la dirección indicada.</p>
          </div>
          <div class="mb-3">
            <label for="institutionalEmail" class="form-label"><i class="fas fa-envelope"></i> Correo electrónico institucional</label>
            <input bind:this= {instEmailElement} id="institutionalEmail" placeholder=" Ingresa tu correo electrónico institucional" type="email" class="form-control" autocomplete="off" bind:value="{emailReset}">
            {#each instEmailFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          <i class="fas fa-times"></i> Cancelar</button>
          {#if flagInstEmail}
          <button type="button" class="btn btn-primary" on:click|preventDefault="{() => sendEmail()}">
            <i class="fas fa-paper-plane"></i> Enviar</button>
            {:else}
            <button type="button" class="btn btn-primary" on:click|preventDefault="{() => sendEmail()}" disabled>
              <i class="fas fa-paper-plane"></i> Enviar</button>
          {/if}
      </div>
    </div>
  </div>
</div>

<style>
  #main {  
    background: linear-gradient(178deg, rgba(30,48,94,1) 0%, rgba(27,145,112,1) 100%);
    height: 100vh;
  }

  h1, p {
    color: #ffffff;
  }

  #resetpsw {
    cursor: pointer;
  }

  #resetinfo {
    color: #000000;
  }
</style>