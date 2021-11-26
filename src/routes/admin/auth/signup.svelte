<script>
	import axiosapi from '../../../../src/utils/axiosapi';
  import validator from 'validator';
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
  // $: if (user.password === user.password_repeat && user.password !== '') {
  //   password_match = false;
  // }
 
  $: if (user.password !== user.password_repeat || user.password == '') {
    password_match = true;
  }
	const signup = () => {
		axiosapi.doPost("/auth/signup",user).then(({data})=>{
      let name = document.getElementById('name');
      let first_last_name = document.getElementById('first_last_name');
      let second_last_name = document.getElementById('second_last_name');
      let email = document.getElementById('email');
      let password = document.getElementById('password');
      let password_repeat = document.getElementById('password_repeat');
      let employment = document.getElementById('employment');
      let phone = document.getElementById('phone');
      let cellphone = document.getElementById('cellphone');
      let personal_email = document.getElementById('personal_email');
			if(!data.token){
        if (data.status == 0) {
          Swal.fire({
            title: 'Error',
            text: '¡Usuario administrador ya existente!',
            confirmButtonColor: '#0D6EFD',
            icon: 'error'
          });
          name.value = '';
          first_last_name.value = '';
          second_last_name.value = '';
          email.value = '';
          password.value = '';
          password_repeat.value = '';
          employment.value = '';
          phone.value = '';
          cellphone.value = '';
          personal_email.value = '';
        }else{
          Swal.fire({
            title: 'Error',
            text: '¡Ocurrió un error al registrar administrador!',
            confirmButtonColor: '#0D6EFD',
            icon: 'error'
          });
        }
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
		}).catch(()=>{
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
    let name = document.getElementById('name');
    let first_last_name = document.getElementById('first_last_name');
    let second_last_name = document.getElementById('second_last_name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let password_repeat = document.getElementById('password_repeat');
    let employment = document.getElementById('employment');
    let phone = document.getElementById('phone');
    let cellphone = document.getElementById('cellphone');
    let personal_email = document.getElementById('personal_email');
    let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
    let emailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    let phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    name.addEventListener('change', () => {
      if(nameformat.test(name.value)){
        name.classList.remove('is-invalid');
        name.classList.add('is-valid');
      }else{
        name.classList.remove('is-valid');
        name.classList.add('is-invalid');
      }
    });
    first_last_name.addEventListener('change', () => {
      if(nameformat.test(first_last_name.value)){
        first_last_name.classList.remove('is-invalid');
        first_last_name.classList.add('is-valid');
      }else{
        first_last_name.classList.remove('is-valid');
        first_last_name.classList.add('is-invalid');
      }
    });
    second_last_name.addEventListener('change', () => {
      if(nameformat.test(second_last_name.value)){
        second_last_name.classList.remove('is-invalid');
        second_last_name.classList.add('is-valid');
      }else{
        second_last_name.classList.remove('is-valid');
        second_last_name.classList.add('is-invalid');
      }
    });
    email.addEventListener('change', () => {
      if(emailformat.test(email.value)){
        if(email.value.split('@')[1] != 'utez.edu.mx'){
          email.classList.remove('is-valid');
          email.classList.add('is-invalid');
        }else{
          email.classList.remove('is-invalid');
          email.classList.add('is-valid');
        }
      }else{
        email.classList.remove('is-valid');
        email.classList.add('is-invalid');
      }
    });
    password.addEventListener('change', () => {
      if(password.value.length > 5){
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
      }else{
        password.classList.remove('is-valid');
        password.classList.add('is-invalid');
      }
    });
    password_repeat.addEventListener('change', () => {
      if(password_repeat.value.length > 5 && password_repeat.value == password.value){
        password_repeat.classList.remove('is-invalid');
        password_repeat.classList.add('is-valid');
      }else{
        password_repeat.classList.remove('is-valid');
        password_repeat.classList.add('is-invalid');
      }
    });
    employment.addEventListener('change', () => {
      if(nameformat.test(employment.value)){
        employment.classList.remove('is-invalid');
        employment.classList.add('is-valid');
      }else{
        employment.classList.remove('is-valid');
        employment.classList.add('is-invalid');
      }
    });
    phone.addEventListener('change', () => {
      if(phoneformat.test(phone.value)){
        phone.classList.remove('is-invalid');
        phone.classList.add('is-valid');
      }else{
        phone.classList.remove('is-valid');
        phone.classList.add('is-invalid');
      }
    });
    cellphone.addEventListener('change', () => {
      if(phoneformat.test(cellphone.value)){
        cellphone.classList.remove('is-invalid');
        cellphone.classList.add('is-valid');
      }else{
        cellphone.classList.remove('is-valid');
        cellphone.classList.add('is-invalid');
      }
    });
    personal_email.addEventListener('change', () => {
      if(emailformat.test(personal_email.value)){
        personal_email.classList.remove('is-invalid');
        personal_email.classList.add('is-valid');
      }else{
        personal_email.classList.remove('is-valid');
        personal_email.classList.add('is-invalid');
      }
    });
    (function () {
      'use strict'
      var forms = document.querySelectorAll('.needs-validation')
      Array.prototype.slice.call(forms)
        .forEach((form) => {
          form.addEventListener('change', function (event) {            
            if (!form.checkValidity()) {
              event.preventDefault()
              event.stopPropagation()
            }else{
              password_match = false;
              form.classList.add('was-validated');
            }
          }, false)
        })
    })()
  });
  
</script>
<div class="main-card container-lg my-4 p-4 rounded border shadow">
  <div class="row">
    <div class="col-md-3">
      <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="my-3" width="150px" src="/img/HALCÓN_2016.png" alt="profile"></div>
    </div>
    <div class="col-md-7">
      <h4 class="mb-3">Registro de administrador</h4>
      <form class="row g-3 needs-validation" novalidate>
        <div class="row g-3">
          
          <!-- Nombre -->
          <div class="col-sm-12">
            <i class="fas fa-user"></i>
            <label for="name" class="form-label">Nombre(s)</label>
            <input type="text" class="form-control" id="name" placeholder="" bind:value="{user.name}" required>
            <!-- Mensajes para validación   -->
            <div class="invalid-feedback">El nombres (s) no deben contener ni caracteres especiales ni números.</div>
          </div>

          <!-- Primer apellido -->
          <div class="col-sm-6">
            <i class="fas fa-user"></i>
            <label for="first_last_name" class="form-label">Primer apellido</label>
            <input type="text" class="form-control" id="first_last_name" placeholder="" bind:value="{user.first_last_name}" required>
            <div class="invalid-feedback">El pimer apellido no debe contener ni caracteres especiales ni números.</div>
          </div>

          <!-- Segundo apellido -->
          <div class="col-sm-6">
            <i class="fas fa-user"></i>
            <label for="second_last_name" class="form-label">Segundo apellido</label>
            <input type="text" class="form-control" id="second_last_name" placeholder="" bind:value="{user.second_last_name}" required>
            <div class="invalid-feedback">El segundo apellido no debe contener ni caracteres especiales ni números.</div>
          </div>

          <!-- <h4 class="mb-3">Datos de acceso</h4> -->

          <!-- Correo institucional -->
          <div class="col-12">
            <i class="fas fa-envelope"></i>
            <label for="email" class="form-label">Correo institucional<span class="text-muted"></span></label>
            <input type="email" class="form-control" id="email" bind:value="{user.email}" required>
            <div class="invalid-feedback">
              El correo electrónico debe pertenecer al dominio @utez.edu.mx.
            </div>
          </div>
          
          <!-- Contraseña -->
          <div class="col-sm-6">
            <i class="fas fa-key"></i>
            <label for="password" class="form-label">Contraseña<span class="text-muted"></span></label>
            <input type="password" class="form-control" id="password" bind:value="{user.password}" required>
            <div class="invalid-feedback">
              La contraseña debe tener al menos 6 caracteres.
            </div>
          </div>
          
          <!-- Repetir contraseña -->
          <div class="col-sm-6">
            <i class="fas fa-key"></i>
            <label for="password_repeat" class="form-label">Contraseña<span class="text-muted"></span></label>
            <input type="password" class="form-control" id="password_repeat" bind:value="{user.password_repeat}" required>
            <div class="invalid-feedback">
              Las contraseñas deben ser iguales.
            </div>
          </div>
          
          <!-- Cargo -->
          <div class="col-sm-12">
            <i class="fas fa-suitcase"></i>
            <label for="employment" class="form-label">Cargo<span class="text-muted"></span></label>
            <input type="text" class="form-control" id="employment" bind:value="{user.employment}" required>
            <div class="invalid-feedback">
              El cargo no debe contener ni números ni caracteres especiales.
            </div>
          </div>

          <!-- Teléfono -->
          <div class="col-sm-6">
              <i class="fas fa-phone"></i>
              <label for="phone" class="form-label">Teléfono</label>
              <input type="text" class="form-control" id="phone" placeholder="" bind:value="{user.phone}" required>
              <div class="invalid-feedback">
                El télefono debe tener un formato válido.
              </div>
          </div>
          
          <!-- Teléfono celular -->
          <div class="col-sm-6">
              <i class="fas fa-mobile"></i>
              <label for="cellphone" class="form-label">Teléfono celular</label>
              <input type="text" class="form-control" id="cellphone" placeholder="" bind:value="{user.cellphone}" required>
              <div class="invalid-feedback">
                El télefono debe tener un fomato válido.
              </div>
          </div>

          <!-- Correo personal -->
          <div class="col-12">
            <i class="fas fa-envelope"></i>
            <label for="personal_email" class="form-label">Correo personal<span class="text-muted"></span></label>
            <input type="email" class="form-control" id="personal_email" bind:value="{user.personal_email}" required>
            <div class="invalid-feedback">
              El correo debe contener un formato válido. (direccion@dominio.com)
            </div>
          </div>
        </form>
    </div>
    <div class="col-md-2">
      <button class="btn btn-outline-success float-end rounded-pill align-middle mt-2" disabled={password_match} type="button" on:click="{()=>{signup()}}">
        <i class="fas fa-save" />
        <span>Guardar</span>
      </button>
    </div>
  </div>
</div>

<style>
  i {
    font-size: smaller;
  }
</style>