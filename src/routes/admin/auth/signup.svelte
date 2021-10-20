<script>
	import axiosapi from '../../../../src/utils/axiosapi';
  import { goto } from '$app/navigation';
	let user = {
		email:'',
        password: ''
	};

	const login = () => {
		axiosapi.doPost("/auth/signin",user).then(({data})=>{
			Swal.fire({
				title: 'Bienvenido',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			});
			localStorage.setItem('token', data.token);
      goto('/');
      location.reload();
		}).catch((err)=>{
			console.log(err);
			Swal.fire({
				title: 'Error',
				text: '¡Correo y/o contraseña incorrectos!',
				confirmButtonColor: '#0D6EFD',
				icon: 'error'
			})
		})
	}
</script>

<div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="col-md-7 col-lg-8">
        <h4 class="mb-3">Registrarse</h4>
        <form class="needs-validation" novalidate="">
          <div class="row g-3">
            <div class="col-sm-12">
              <label for="firstName" class="form-label">Nombre(s)</label>
              <input type="text" class="form-control" id="firstName" placeholder="" value="" required="">
              <div class="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Primer apellido</label>
              <input type="text" class="form-control" id="lastName" placeholder="" value="" required="">
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Segundo apellido</label>
              <input type="text" class="form-control" id="lastName" placeholder="" value="" required="">
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <hr class="my-4">

            <!-- <h4 class="mb-3">Datos de acceso</h4> -->

            <div class="col-12">
              <label for="email" class="form-label">Correo institucional<span class="text-muted"></span></label>
              <input type="email" class="form-control" id="email" placeholder="email@utez.edu.mx">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>
            
            <div class="col-sm-6">
              <label for="password" class="form-label">Contraseña<span class="text-muted"></span></label>
              <input type="password" class="form-control" id="password">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>
            
            <div class="col-sm-6">
              <label for="password_repeat" class="form-label">Repetir contraseña<span class="text-muted"></span></label>
              <input type="password" class="form-control" id="password_repeat">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>

            <div class="col-sm-6">
                <label for="phone" class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="phone" placeholder="" value="" required="">
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
            </div>
            
            <div class="col-sm-6">
                <label for="employment" class="form-label">Empleo</label>
                <input type="text" class="form-control" id="employment" placeholder="" value="" required="">
                <div class="invalid-feedback">
                  Valid first name is required.
                </div>
            </div>         

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit">Registrarme</button>
        </form>
      </div>
</div>