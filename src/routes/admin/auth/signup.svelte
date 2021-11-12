<script>
	import axiosapi from '../../../../src/utils/axiosapi';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

	let user = {
    name: '',
    first_last_name: '',
    second_last_name: '',
    email: '',
    password: '',
    password_repeat: '',
    employment: '',
    phone: '',
    cellphone: '',
    personal_email: '',
    id_role: 1
	};

  let password_match = true;

  $: if (user.password === user.password_repeat && user.password !== '') {
    password_match = false;
  }
 
  $: if (user.password !== user.password_repeat || user.password == '') {
    password_match = true;
  }

	const signup = () => {
		axiosapi.doPost("/auth/signup",user).then(({data})=>{
			if(!data.token){
        Swal.fire({
          title: 'Error',
          text: '¡Ocurrió un error al registrar administrador!',
          confirmButtonColor: '#0D6EFD',
          icon: 'error'
        });
      }else{
        Swal.fire({
        	title: 'Bienvenido',
        	confirmButtonColor: '#0D6EFD',
        	icon: 'success'
        });
        localStorage.setItem('token', data.token);
        goto('/');
        location.reload();
      }
		}).catch((err)=>{
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: '¡Ocurrió un error al registrar administrador!',
				confirmButtonColor: '#0D6EFD',
				icon: 'error'
			});
		});
	}

  // Validaciones
  onMount(() => {
    var forms = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
    });
  });
</script>

<div class="main-card container-lg my-4 p-4 rounded border shadow col-xl-10 col-xxl-8 px-4">
  <div class="col-md-7 col-lg-8">
    <h4 class="mb-3">Registro de administrador</h4>
    <form class="row g-3 needs-validation" novalidate>
      <div class="row g-3">
        
        <!-- Nombre -->
        <div class="col-sm-12">
          <label for="name" class="form-label">Nombre(s)</label>
          <input type="text" class="form-control" id="name" placeholder="" bind:value="{user.name}" required>
          <div class="invalid-feedback">
            Valid first name is required.
          </div>
        </div>

        <!-- Primer apellido -->
        <div class="col-sm-6">
          <label for="first_last_name" class="form-label">Primer apellido</label>
          <input type="text" class="form-control" id="first_last_name" placeholder="" bind:value="{user.first_last_name}" required>
          <div class="invalid-feedback">
            Valid last name is required.
          </div>
        </div>

        <!-- Segundo apellido -->
        <div class="col-sm-6">
          <label for="second_last_name" class="form-label">Segundo apellido</label>
          <input type="text" class="form-control" id="second_last_name" placeholder="" bind:value="{user.second_last_name}" required>
          <div class="invalid-feedback">
            Valid last name is required.
          </div>
        </div>

        <hr class="my-4">

        <!-- <h4 class="mb-3">Datos de acceso</h4> -->

        <!-- Correo institucional -->
        <div class="col-12">
          <label for="email" class="form-label">Correo institucional<span class="text-muted"></span></label>
          <input type="email" class="form-control" id="email" bind:value="{user.email}" required>
          <div class="invalid-feedback">
            Please enter a valid email address for shipping updates.
          </div>
        </div>
        
        <!-- Contraseña -->
        <div class="col-sm-6">
          <label for="password" class="form-label">Contraseña<span class="text-muted"></span></label>
          <input type="password" class="form-control" id="password" bind:value="{user.password}" required>
          <div class="invalid-feedback">
            Please enter a valid email address for shipping updates.
          </div>
        </div>
        
        <!-- Repetir contraseña -->
        <div class="col-sm-6">
          <label for="password_repeat" class="form-label">Contraseña<span class="text-muted"></span></label>
          <input type="password" class="form-control" id="password_repeat" bind:value="{user.password_repeat}" required>
          <div class="invalid-feedback">
            Please enter a valid email address for shipping updates.
          </div>
        </div>
        
        <!-- Cargo -->
        <div class="col-sm-12">
          <label for="employment" class="form-label">Cargo<span class="text-muted"></span></label>
          <input type="text" class="form-control" id="employment" bind:value="{user.employment}" required>
          <div class="invalid-feedback">
            Please enter a valid email address for shipping updates.
          </div>
        </div>

        <!-- Teléfono -->
        <div class="col-sm-6">
            <label for="phone" class="form-label">Teléfono</label>
            <input type="text" class="form-control" id="phone" placeholder="" bind:value="{user.phone}" required>
            <div class="invalid-feedback">
              Valid first name is required.
            </div>
        </div>
        
        <!-- Teléfono celular -->
        <div class="col-sm-6">
            <label for="cellphone" class="form-label">Teléfono celular</label>
            <input type="text" class="form-control" id="cellphone" placeholder="" bind:value="{user.cellphone}" required>
            <div class="invalid-feedback">
              Valid first name is required.
            </div>
        </div>

        <!-- Correo personal -->
        <div class="col-12">
          <label for="personal_email" class="form-label">Correo personal<span class="text-muted"></span></label>
          <input type="email" class="form-control" id="personal_email" bind:value="{user.personal_email}" required>
          <div class="invalid-feedback">
            Please enter a valid email address for shipping updates.
          </div>
        </div>

      <hr class="my-4">

      <button class="w-100 btn btn-primary btn-lg" disabled={password_match} type="button" on:click="{()=>{signup()}}">Registrarme</button>
    </form>
  </div>
</div>