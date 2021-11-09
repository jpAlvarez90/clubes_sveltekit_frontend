<script>
	import axiosapi from '../utils/axiosapi';
  import { goto } from '$app/navigation';
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
		})
	}
</script>

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
          <span class="text-center">
            <small class="text-muted">No tengo cuenta</small>
            <a class="text-muted" href="/signup"> Registrarme</a>
          </span>
        </form>
      </div>
    </div>
  </div>