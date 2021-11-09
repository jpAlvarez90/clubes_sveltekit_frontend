<script>
	import { onMount, beforeUpdate } from 'svelte';
	import axiosapi from './../utils/axiosapi';
	import swal from './../utils/sweetalert2';
	import { goto } from '$app/navigation';

	const TITCREATED = 'Creado';
	const TXTCREATED = 'El registro se ha creado exitosamente.';

	let grades = [];
	let divisions = [];
	let academicLevels = [];
	let careers = [];

	let student = {
		email: '',
		password: '',
		name: '',
		first_last_name: '',
		second_last_name: '',
		school_id: '',
		group: '',
		personal_email: '',
		id_career: '',
		id_qu_gr: ''
	};

	let flagName = false
	let flagFirstLastName = false
	let flagSecondLastName = false
	let flagSchoolId = false
	let flagGrade = false
	let flagGroup = false
	let flagDivision = false
	let flagLevel = false
	let flagCareer = false
	let flagPerEmail = false
	let flagInstEmail = false
	let flagPass1 = false
	let flagPass2 = false

	let nameElement;
	let nameFeedback = [];
	let firstLastNameElement;
	let firstLastNameFeedback = [];
	let secondLastNameElement;
	let secondLastNameFeedback = [];
	let schoolIdElement;
	let schoolIdFeedback = [];
	let gradeElement;
	let gradeFeedback = [];
	let groupElement;
	let groupFeedback = [];
	let divisionElement;
	let divisionFeedback = [];
	let levelElement;
	let levelFeedback = [];
	let careerElement;
	let careerFeedback = [];
	let perEmailElement;
	let perEmailFeedback = [];
	let instEmailElement;
	let instEmailFeedback = [];
	let password1Element;
	let password1Feedback = [];
	let password2Element;
	let password2Feedback = [];

	let divisionSelected = '';
	let levelSelected = '';
	let repeatPasswod = '';
	let verifySchoolId = true

	const getLists = () => {
		axiosapi
			.doGet('http://localhost:3001/grade/get')
			.then((res) => {
				grades = res.data;
			})
			.catch(() => {
				swal.err();
			});

		axiosapi
			.doGet('http://localhost:3001/academic/division/get')
			.then((res) => {
				divisions = res.data;
			})
			.catch(() => {
				swal.err();
			});

		axiosapi
			.doGet('http://localhost:3001/academic/level/get')
			.then((res) => {
				academicLevels = res.data;
			})
			.catch(() => {
				swal.err();
			});
	};

	const filterCareer = () => {
		if (divisionSelected != 0 && levelSelected != 0) {
			console.log('filtrando...');
			axiosapi
				.doGet('http://localhost:3001/career/get/' + divisionSelected + '/' + levelSelected)
				.then((res) => {
					careers = res.data;
				})
				.catch(() => {
					swal.err();
				});
		}
	};

	const registerStudent = () => {
			console.log(student);
			axiosapi.doPost('http://localhost:3001/student/create', student).then((res) => {
				swal.con('success',TITCREATED,TXTCREATED)
				goto('/')
			}).catch(() => {
				swal.err()
			})
	};

	const test = () => {
		goto('/')
	}

	const verifyPasswordMatch = () => {
		if (student.password === repeatPasswod && student.password != '' && repeatPasswod != '') {
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

	const verifyInstEmail = (valor) => {
		var regex = /^([a-zA-Z0-9_\.])+@utez\.edu\.mx$/;
		var correoVal = regex.test(valor);
		return correoVal;
	};

	const verifyEmail = (valor) => {
		let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		let resp = regex.test(valor)

		if(resp){
			return true
		}else{
			return false
		}
	}


	const clear = () => {
		student = {
			email: '',
			password: '',
			name: '',
			first_last_name: '',
			second_last_name: '',
			school_id: '',
			group: '',
			personal_email: '',
			id_career: '',
			id_qu_gr: ''
		};
		divisionSelected = '';
		levelSelected = '';
		repeatPasswod = '';
	};

	const onlyLetters = (value) => {
		let regex = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
		let resp = regex.test(value)
		if(resp){
			return true
		}else{
			return false
		}
	}

	const validate = () => {
		nameElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagName = true

			nameFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				nameFeedback.push('Completa el campo')
				flagName = false
			}
			if(!onlyLetters(value)){
				event.target.className =  classElement +' is-invalid'
				nameFeedback.push('Introduzca solo letras')
				flagName = false
			}
		})

		firstLastNameElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagFirstLastName = true

			firstLastNameFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				firstLastNameFeedback.push('Completa el campo')
				flagFirstLastName = false
			}
			if(!onlyLetters(value)){
				event.target.className =  classElement +' is-invalid'
				firstLastNameFeedback.push('Introduzca solo letras')
				flagFirstLastName = false
			}
		})

		secondLastNameElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagSecondLastName = true

			secondLastNameFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				secondLastNameFeedback.push('Completa el campo')
				flagSecondLastName = false
			}
			if(!onlyLetters(value)){
				event.target.className =  classElement +' is-invalid'
				secondLastNameFeedback.push('Introduzca solo letras')
				flagSecondLastName = false
			}
		})

		schoolIdElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagSchoolId = true

			schoolIdFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				schoolIdFeedback.push('Completa el campo')
				flagSchoolId = false
			}
			if(value.length < 10){
				event.target.className =  classElement +' is-invalid'
				schoolIdFeedback.push('La matrícula debe tener mínimo 10 caracteres')
				flagSchoolId = false
			}
			if(value.length > 11){
				event.target.className =  classElement +' is-invalid'
				schoolIdFeedback.push('La matrícula debe tener máximo 11 caracteres')
				flagSchoolId = false
			}
		})

		schoolIdElement.addEventListener('change', async (event) => {
			if(student.school_id != '' || student.school_id != ' '){
				let value = event.target.value
				verifySchoolId = true

				console.log(event.target.className);
				let classElement = "form-control"
				event.target.className =  classElement +' is-valid'
				//console.log(verifySchoolId(value));

				const resp = await axiosapi.doGet('http://localhost:3001/student/verify/school/id/'+value).then((res) => {
					return res.data
				}).catch(() => {
					swal.err()
				})
				console.log(resp);

				if(resp > 0){
					event.target.className =  classElement +' is-invalid'
					verifySchoolId = false
					flagSchoolId = false
				}
			}
		})

		gradeElement.addEventListener('change', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagGrade = true

			gradeFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				gradeFeedback.push('Selecciona un grado')
				flagGrade = false
			}
		})

		groupElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagGroup = true

			value = value.toUpperCase()
			student.group = value

			groupFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				groupFeedback.push('Completa el campo')
				flagGroup = false
			}
			if(!onlyLetters(value)){
				event.target.className =  classElement +' is-invalid'
				groupFeedback.push('Introduzca solo letras')
				flagGroup = false
			}
			if(value.length != 1){
				event.target.className =  classElement +' is-invalid'
				groupFeedback.push('Introduzca solo 1 letra')
				flagGroup = false
			}
		})	
		
		divisionElement.addEventListener('change', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagDivision = true

			divisionFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				divisionFeedback.push('Selecciona una división académica')
				flagDivision = false
			}
		})

		levelElement.addEventListener('change', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagLevel = true

			levelFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				levelFeedback.push('Selecciona un nivel académico')
				flagLevel = false
			}
		})

		careerElement.addEventListener('change', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagCareer = true

			careerFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				careerFeedback.push('Selecciona una carrera')
				flagCareer = false
			}
		})

		perEmailElement.addEventListener('input', (event) => {
			let value = event.target.value
			let classElement = "form-control"
			flagPerEmail = true

			perEmailFeedback = []
			event.target.className =  classElement +' is-valid'

			if(!value || value == ' '){
				event.target.className =  classElement +' is-invalid'
				perEmailFeedback.push('Completa el campo')
				flagPerEmail = false
			}
			if(!verifyEmail(value)){
				event.target.className =  classElement +' is-invalid'
				perEmailFeedback.push('Ingrese un correo electrónico válido')
				flagPerEmail = false
			}
		})

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
		})

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
		})
		
	}

	onMount(() => {
		getLists();
		validate()

		//var forms = document.querySelectorAll('.needs-validation');
		/*const test = document.querySelector('.password1');
		test.addEventListener('change', (event)=>{
			console.log('entra');
		})*/

		/*document.getElementById('password1').addEventListener('change', (event)=>{
			
			//event.target.required = true

			console.log(event.target.validity.valid);
			event.target.validity.valid = true

			console.log(event.target.validity.valid);
		})

		Array.prototype.slice.call(forms).forEach(function (form) {
			form.addEventListener(
				'submit',
				function (event) {
					if (!verifyInstEmail()) {
						var div = document.getElementById('institutional_email');

						console.log(div.className);
						div.className = 'form-control is-invalid';
						//div.style.setProperty("border-color", "#dc3545");
						div.style.cssText = `border-color:#dc3545;
					background-image: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e)!important;`;
						//div.style.backgroundImage = "url('tuUrl')";
						event.preventDefault();
						event.stopPropagation();
					}
					if (
						!form.checkValidity() &&
						!verifyPasswordMatch() &&
						!verifyInstEmail() &&
						!verifyPasswordStrength()
					) {
						//event.preventDefault()
						event.stopPropagation();
					}

					if (
						form.checkValidity() &&
						verifyPasswordMatch() &&
						verifyInstEmail() &&
						verifyPasswordStrength()
					) {
						registerStudent();
						clear();
					}

					form.classList.add('was-validated');
				},
				false
			);
		});*/
	});
</script>

<head>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/js/bootstrapValidator.min.js"></script>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/jquery.bootstrapvalidator/0.5.3/css/bootstrapValidator.min.css"
	/>
</head>
<main class="container py-5">
	<a href="/login" class="text-decoration-none text-muted mx-1 fs-5"
		><i class="fas fa-arrow-left" /> Regresar</a
	>
	<div style="background-color: #F8F9FA;" class="container-xl my-4 p-4 mt-1 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3>¡Regístrate!</h3>
			</div>
		</div>
		<form class="my-3" id="formulario">
			<div class="form-row">
				<div class="row mb-1">
					<div class="col-md-4 mb-3">
						<i class="fa fa-user mx-2" aria-hidden="true" /><label for="name" class="form-label"
							>Nombre(s)</label
						>
						<input
							bind:this="{nameElement}"
							type="text"
							class="form-control"
							autocomplete="off"
							id="name"
							bind:value={student.name}
							aria-label="Nombre"
							placeholder="Ingresa tu nombre"
							required
						/>
						{#each nameFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-4 mb-3">
						<i class="fa fa-user mx-2" aria-hidden="true" /><label
							for="firs_lastName"
							class="form-label">Primer apellido</label
						>
						<input
							bind:this="{firstLastNameElement}"
							type="text"
							class="form-control"
							id="firs_lastName"
							bind:value={student.first_last_name}
							aria-label="Primer apellido"
							placeholder="Ingresa tu primer apellido"
							autocomplete="off"
							required
						/>
						{#each firstLastNameFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-4 mb-3">
						<i class="fa fa-user mx-2" aria-hidden="true" /><label
							for="second_lastName"
							class="form-label">Segundo apellido</label
						>
						<input
							bind:this="{secondLastNameElement}"
							type="text"
							class="form-control"
							id="second_lastName"
							bind:value={student.second_last_name}
							aria-label="Segundo apellido"
							placeholder="Ingresa tu segundo apellido"
							autocomplete="off"
							required
						/>
						{#each secondLastNameFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="row mb-1">
					<div class="col-md-4 mb-3">
						<i class="fa fa-id-card mx-2" aria-hidden="true" /><label
							for="school_id"
							class="form-label">Matrícula</label
						>
						<input
							bind:this="{schoolIdElement}"
							type="text"
							class="form-control"
							id="school_id"
							bind:value={student.school_id}
							aria-label="Matricula"
							placeholder="Ingresa tu matrícula"
							autocomplete="off"
							required
						/>
						{#each schoolIdFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}

						{#if !verifySchoolId}
							<div class="invalid-feedback mx-2">La matrícula ya está en uso</div>
						{/if}
					</div>
					<div class="col-md-4 mb-3">
						<i class="fas fa-graduation-cap mx-2" aria-hidden="true" /><label
							for="grade"
							class="form-label">Grado</label
						>
						<select
							bind:this={gradeElement}
							class="form-select"
							aria-label="Grado"
							id="grade"
							bind:value={student.id_qu_gr}
							required
						>
							{#if grades.length > 0}
								{#if student.id_qu_gr == ''}
									<option selected disabled value={student.id_qu_gr}>Selecciona tu grado</option>
								{:else}
									<option disabled>Selecciona tu grupo</option>
								{/if}
								{#each grades as grade}
									<option value={grade.id}>{grade.grade}</option>
								{/each}
							{:else}
								<option selected disabled value={student.id_qu_gr}>No hay grados disponibles</option>
							{/if}
						</select>
						{#each gradeFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
						<div class="invalid-feedback mx-2">Selecciona un grado</div>
					</div>
					<div class="col-md-4 mb-3">
						<i class="fas fa-user-friends mx-2" aria-hidden="true" /><label
							for="group"
							class="form-label">Grupo</label
						>
						<input
						bind:this= {groupElement}
							type="text"
							class="form-control"
							id="group"
							bind:value={student.group}
							aria-label="Grupo"
							placeholder="Ingresa tu grupo"
							autocomplete="off"
							required
						/>
						{#each groupFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="row mb-1">
					<div class="col-md-4 mb-3">
						<i class="fas fa-university mx-2" /><label for="division" class="form-label"
							>División académica</label
						>
						<select
							bind:this= {divisionElement}
							class="form-select"
							aria-label="Division académica"
							id="division"
							bind:value={divisionSelected}
							on:change={() => filterCareer()}
							required
						>
							{#if divisions.length > 0}
								{#if divisionSelected == ''}
									<option selected disabled value={divisionSelected}
										>Selecciona tu división académica</option
									>
								{:else}
									<option disabled>Selecciona tu división académica</option>
								{/if}
								{#each divisions as div}
									<option value={div.id}>{div.acronym}</option>
								{/each}
							{:else}
								<option selected disabled value={divisionSelected}
									>No hay divisiones académicas disponibles</option
								>
							{/if}
						</select>
						{#each divisionFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-4 mb-3">
						<i class="fas fa-graduation-cap mx-2" /><label for="level" class="form-label"
							>Nivel académico</label
						>
						<select
							bind:this={levelElement}
							class="form-select"
							aria-label="Nivel académico"
							id="level"
							bind:value={levelSelected}
							on:change={() => filterCareer()}
							required
						>
							{#if academicLevels.length > 0}
								{#if levelSelected == ''}
									<option selected disabled value={levelSelected}
										>Selecciona tu nivel académico</option
									>
								{:else}
									<option disabled>Selecciona tu nivel académico</option>
								{/if}
								{#each academicLevels as level}
									<option value={level.id}>{level.name}</option>
								{/each}
							{:else}
								<option selected disabled value={levelSelected}
									>No hay niveles académicos disponibles</option
								>
							{/if}
						</select>
						{#each levelFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-4 mb-3">
						<i class="fas fa-briefcase mx-2" /><label for="career" class="form-label">Carrera</label
						>
						<select
							bind:this= {careerElement}
							class="form-select"
							aria-label="Carrera"
							id="career"
							bind:value={student.id_career}
							required
						>
							{#if careers.length > 0}
								{#if student.id_career == ''}
									<option value={student.id_career} selected disabled>Selecciona tu carrera</option>
								{:else}
									<option disabled>Selecciona tu carrera</option>
								{/if}
								{#each careers as career}
									<option value={career.id}>{career.acronym}</option>
								{/each}
							{:else}
								<option value={student.id_career} selected disabled
									>No hay carreras disponibles</option
								>
							{/if}
						</select>
						{#each careerFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="row mb-1">
					<div class="col-md-6 mb-3">
						<i class="fas fa-envelope mx-2" /><label for="personal_email" class="form-label"
							>Correo electrónico personal</label
						>
						<input
							bind:this= {perEmailElement}
							type="email"
							class="form-control"
							id="personal_email"
							bind:value={student.personal_email}
							aria-label="Correo personal"
							placeholder="Ingresa tu correo personal"
							autocomplete="off"
							required
						/>
						{#each perEmailFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-6 mb-3">
						<i class="fas fa-envelope mx-2" /><label for="institutional_email" class="form-label"
							>Correo electrónico institucional</label
						>
						<input
							bind:this= {instEmailElement}
							type="email"
							class="form-control"
							id="institutional_email"
							bind:value={student.email}
							aria-label="Correo institucional"
							placeholder="Ingresa tu correo institucional"
							autocomplete="off"
							required 
						/>
						{#each instEmailFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="row mb-3">
					<div class="col-md-6 mb-3">
						<i class="fas fa-lock mx-2" /><label for="password1" class="form-label"
							>Contraseña</label
						>
						<input
							bind:this= {password1Element}
							type="password"
							class="form-control password1"
							name="password1"
							id="password1"
							autocomplete="off"
							bind:value={student.password}
							aria-label="Contraseña"
							placeholder="Ingresa tu contraseña"
							required
							
							
						/>
						{#each password1Feedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
					<div class="col-md-6 mb-3">
						<i class="fas fa-key mx-2" /><label for="password2" class="form-label"
							>Repetir contraseña</label
						>
						<input
							bind:this= {password2Element}
							type="password"
							class="form-control"
							id="password2"
							autocomplete="off"
							bind:value={repeatPasswod}
							aria-label="Contraseña confirmacion"
							placeholder="Confirma tu contraseña"
							required
						/>
						{#each password2Feedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="d-block">
				{#if flagName && flagFirstLastName && flagSecondLastName && flagSchoolId && flagGrade && flagGroup && 
					flagDivision && flagLevel && flagCareer && flagPerEmail && flagInstEmail && flagPass1 && flagPass2 && verifySchoolId}
					<button type="submit" class="btn btn-primary"
						on:click|preventDefault="{() => registerStudent()}"
						><i class="fas fa-paper-plane" /> Registrarse</button
					>
				{:else}
					<button type="submit" class="btn btn-primary disabled"
						><i class="fas fa-paper-plane" /> Registrarse</button
					>
				{/if}
			</div>
		</form>
	</div>
</main>

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
