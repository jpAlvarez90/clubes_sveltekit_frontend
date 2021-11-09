<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import swal from '../../../utils/sweetalert2';
    import axiosapi from '../../../utils/axiosapi';

    const TITCREATED = 'Actualizada';
	const TXTCREATED = 'La contraseña se ha actualizado exitosamente.';

    let password = '';
    let passwordRepeat = '';
    let password1Element;
	let password1Feedback = [];
	let password2Element;
	let password2Feedback = [];
    let flagPass1 = false;
	let flagPass2 = false;

    const resetPassword = () => {
        axiosapi.doPost('http://localhost:3001/auth/password-recovery', {id: $page.params.slug, password})
        .then(() => {
            swal.con('success',TITCREATED,TXTCREATED)
            goto('/')
        }).catch(() => {
            swal.err()
        })
		goto('/');
    }

    const validate = () => {
        password1Element.addEventListener('input', (event) => {
            let value = event.target.value
            let classElement = "form-control"
            flagPass1 = true
    
            password1Feedback = []
            event.target.className =  classElement +' is-valid'
    
            if(!value || value == ' '){
                event.target.className =  classElement +' is-invalid'
                password1Feedback.push('Completa el campo')
                flagPass1 = false
            }
            if(!verifyPasswordStrength(value)){
                event.target.className =  classElement +' is-invalid'
                password1Feedback.push('La contraseña debe tener mínimo 8 caracteres con una combinación de letras, números, caracteres especiales, letras minúsculas y mayúsculas')
                flagPass1 = false
            }
        });
    
        password2Element.addEventListener('input', (event) => {
            let value = event.target.value
            let classElement = "form-control"
            flagPass2 = true
    
            password2Feedback = []
            event.target.className =  classElement +' is-valid'
    
            if(!value || value == ' '){
                event.target.className =  classElement +' is-invalid'
                password2Feedback.push('Completa el campo')
                flagPass2 = false
            }
            if(!verifyPasswordMatch()){
                event.target.className =  classElement +' is-invalid'
                password2Feedback.push('Las contraseñas no coinciden')
                flagPass2 = false
            }
        });
    }

    const verifyPasswordMatch = () => {
		if (password === passwordRepeat && password != '' && passwordRepeat != '') {
			return true;
		} else {
			return false;
		}
	};

	const verifyPasswordStrength = (value) => {
		var regex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g');
		var pass = regex.test(value);

		if (pass) {
			return true;
		} else {
			return false;
		}
	};

    onMount(() => {
		validate();
    });

</script>

<div class="container d-flex flex-column">
    <div class="row align-items-center justify-content-center g-0 my-5">
        <div class="col-lg-5 col-md-8 py-xl-0">
            <div class="card shadow">
                <div class="card-body p-6">
                    <div class="mb-4">
                        <h2 class="mb-1 fw-bold">Reestablecer contraseña</h2>
                        <p>Al restablecer tu contraseña deberás volver a iniciar sesión.</p>
                    </div>
                    <form>
                        <input id="id" name="id" type="hidden" value="{$page.params.slug}">
                        <div class="mb-3">
                            <label for="password1" class="form-label"><i class="fas fa-lock mx-2"></i> Contraseña</label>
                            <input type="password" class="form-control password1" name="password1" id="password1" autocomplete="off"
                            bind:this= {password1Element} 
                            aria-label="Contraseña" placeholder="Ingresa tu contraseña" required="true" bind:value="{password}">
                            {#each password1Feedback as i}
							    <div class="invalid-feedback mx-2">{i}</div>
						    {/each}
                        </div>
                        <div class="mb-3">
                            <label for="password2" class="form-label"><i class="fas fa-key mx-2"></i> Repetir contraseña</label>
                            <input type="password" class="form-control" id="password2" autocomplete="off" 
							bind:this= {password2Element}
                            aria-label="Contraseña confirmacion" placeholder="Confirma tu contraseña" required="true" bind:value="{passwordRepeat}">
                            {#each password2Feedback as i}
							    <div class="invalid-feedback mx-2">{i}</div>
						    {/each}
                        </div>
                        <div class="mb-3 d-grid">
                            {#if flagPass1 && flagPass2}
                            <button type="submit" class="btn btn-primary"
                                on:click|preventDefault="{() => resetPassword()}"
                                ><i class="fas fa-paper-plane" /> Enviar</button
                            >
                            {/if}
                        </div>
                        <span>Regresar al <a href="/">Login</a></span>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>