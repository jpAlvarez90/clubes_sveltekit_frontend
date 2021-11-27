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
	let verifyEmailUserExistence = true
	let verifyPerEmailExistence = true

	const getLists = () => {
		axiosapi
			.doGet('http://localhost:3001/grade/get/active')
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
			.doGet('http://localhost:3001/academic/level/get/active')
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

	// -----------------
	const checkCreateValidation = async() => {
		let respSchoolId = await validSchoolId(schoolIdElement).then((res) => {
			return res
		})
		let respInstEmail = await validInstEmail(instEmailElement).then((res) => {
			return res
		})
		let ok = true
		ok = validName(nameElement) && ok
		ok = validFirstLastName(firstLastNameElement) && ok
		ok = validSecondLastName(secondLastNameElement) && ok
		ok = respSchoolId && ok
		ok = validGrade(gradeElement) && ok
		ok = validGroup(groupElement) && ok
		ok = validDivision(divisionElement) && ok
		ok = validLevel(levelElement) && ok
		ok = validCareer(careerElement) && ok
		ok = validPerEmail(perEmailElement) && ok
		ok = respInstEmail && ok
		ok = validPassword1(password1Element) && ok
		ok = validPassword2(password2Element) && ok

		if(ok){
			registerStudent()
		}
	}
	const validName = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		nameFeedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			nameFeedback.push('Completar el campo.')
		}
		if(!onlyLetters(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			nameFeedback.push('Introduzca solo letras.')
		}
		if(value.length < 3){
			validated = false
			target.className =  classElement +' is-invalid'
			nameFeedback.push('El nombre debe tener mínimo 3 caracteres.')
		}
		if(value.length > 45){
			validated = false
			target.className =  classElement +' is-invalid'
			nameFeedback.push('El nombre debe tener máximo 45 caracteres.')
		}

		return validated
	}

	const validFirstLastName = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		firstLastNameFeedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			firstLastNameFeedback.push('Completar el campo.')
		}
		if(!onlyLetters(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			firstLastNameFeedback.push('Introduzca solo letras.')
		}
		if(value.length < 3){
			validated = false
			target.className =  classElement +' is-invalid'
			firstLastNameFeedback.push('El primer apellido debe tener mínimo 3 caracteres.')
		}
		if(value.length > 45){
			validated = false
			target.className =  classElement +' is-invalid'
			firstLastNameFeedback.push('El primer apellido debe tener máximo 45 caracteres.')
		}

		return validated
	}

	const validSecondLastName = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		secondLastNameFeedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			secondLastNameFeedback.push('Completar el campo.')
		}
		if(!onlyLetters(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			secondLastNameFeedback.push('Introduzca solo letras.')
		}
		if(value.length < 3){
			validated = false
			target.className =  classElement +' is-invalid'
			secondLastNameFeedback.push('El segundo apellido debe tener mínimo 3 caracteres.')
		}
		if(value.length > 45){
			validated = false
			target.className =  classElement +' is-invalid'
			secondLastNameFeedback.push('El segundo apellido debe tener máximo 45 caracteres.')
		}

		return validated
	}

	const validSchoolId = async(target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		schoolIdFeedback = []
		verifySchoolId = true
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			schoolIdFeedback.push('Completar el campo.')
		}
		if(value.length < 10){
			validated = false
			target.className =  classElement +' is-invalid'
			schoolIdFeedback.push('La matrícula debe tener mínimo 10 caracteres.')
		}
		if(value.length > 11){
			validated = false
			target.className =  classElement +' is-invalid'
			schoolIdFeedback.push('La matrícula debe tener máximo 11 caracteres')
		}
		if(value){
			const resp = await axiosapi.doGet('http://localhost:3001/student/verify/school/id/'+value).then((res) => {
					return res.data
				}).catch(() => {
					swal.err()
				})

				if(resp > 0){
					target.className =  classElement +' is-invalid'
					verifySchoolId = false
					validated = false
				}
		}else{
			validated = false
		}

		return validated
	}

	const validGrade = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-select"
		gradeFeedback = []
		target.className =  classElement +' is-valid'

		if(!value){
			validated = false
			target.className =  classElement +' is-invalid'
			gradeFeedback.push('Selecciona un grado.')
		}

		return validated
	}

	const validGroup = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		value = value.toUpperCase()
		student.group = value
		groupFeedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			groupFeedback.push('Completar el campo.')
		}
		if(!onlyLetters(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			groupFeedback.push('Introduzca solo letras.')
		}
		if(value.length != 1){
			validated = false
			target.className =  classElement +' is-invalid'
			groupFeedback.push('Introduzca solo 1 letra.')
		}

		return validated
	}

	const validDivision = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-select"
		divisionFeedback = []
		target.className =  classElement +' is-valid'

		if(!value){
			validated = false
			target.className =  classElement +' is-invalid'
			divisionFeedback.push('Selecciona una división académica.')
		}

		return validated
	}

	const validLevel = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-select"
		levelFeedback = []
		target.className =  classElement +' is-valid'

		if(!value){
			validated = false
			target.className =  classElement +' is-invalid'
			levelFeedback.push('Selecciona un nivel académico.')
		}

		return validated
	}
	
	const validCareer = (target) =>{
		let validated = true
		let value = target.value
		let classElement = "form-select"
		careerFeedback = []
		target.className =  classElement +' is-valid'

		if(!value){
			validated = false
			target.className =  classElement +' is-invalid'
			careerFeedback.push('Selecciona una carrera.')
		}

		return validated
	}

	const validPerEmail = async(target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		perEmailFeedback = []
		verifyPerEmailExistence = true
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			perEmailFeedback.push('Completar el campo.')
		}
		if(!verifyEmail(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			perEmailFeedback.push('Ingrese un correo electrónico válido.')
		}
		if(value){
			const resp = await axiosapi.doGet('/student/verify/email/existence/'+value).then((res)=>{
				return res.data
			}).catch(() => {
				swal.err()
			})

			if(resp > 0){
				validated = false
				target.className = `${classElement} is-invalid`
				verifyPerEmailExistence = false
			}
		}else{
			validated = false
		}

		return validated
	}

	const validInstEmail = async(target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		instEmailFeedback = []
		verifyEmailUserExistence = true
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			instEmailFeedback.push('Completar el campo.')
		}
		if(value.split('@')[1] != 'utez.edu.mx'){
			validated = false
			target.className =  classElement +' is-invalid'
			instEmailFeedback.push('El correo electrónico debe pertenecer al dominio @utez.edu.mx.')
		}

		if(value){
			const resp = await axiosapi.doGet('/user/verify/email/existence/'+ value).then((res)=>{
				return res.data
			}).catch(() => {
				swal.err()
			})

			if(resp > 0){
				validated = false
				target.className = `${classElement} is-invalid`
				verifyEmailUserExistence = false
			}
		}else{
			validated = false
		}

		return validated
	}

	const validPassword1 = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		password1Feedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			password1Feedback.push('Completar el campo.')
		}
		if(!verifyPasswordStrength(value)){
			validated = false
			target.className =  classElement +' is-invalid'
			password1Feedback.push('La contraseña debe tener mínimo 8 caracteres con una combinación de letras, números, caracteres especiales, letras minúsculas y mayúsculas')
		}

		return validated
	}

	const validPassword2 = (target) => {
		let validated = true
		let value = target.value
		let classElement = "form-control"
		password2Feedback = []
		target.className =  classElement +' is-valid'

		if(!value || value == ' '){
			validated = false
			target.className =  classElement +' is-invalid'
			password2Feedback.push('Completar el campo.')
		}
		if(!verifyPasswordMatch()){
			validated = false
			target.className =  classElement +' is-invalid'
			password2Feedback.push('Las contraseñas no coinciden.')
		}

		return validated
	}

	const listenerValidity = () =>{
		nameElement.addEventListener('input', (event) => {validName(event.target)})
		firstLastNameElement.addEventListener('input', (event) => {validFirstLastName(event.target)})
		secondLastNameElement.addEventListener('input', (event) => {validSecondLastName(event.target)})
		schoolIdElement.addEventListener('input', async(event) => {validSchoolId(event.target)})
		gradeElement.addEventListener('change', (event) => {validGrade(event.target)})
		groupElement.addEventListener('input', (event) => {validGroup(event.target)})
		divisionElement.addEventListener('change', (event) => {validDivision(event.target)})
		levelElement.addEventListener('change', (event) => {validLevel(event.target)})
		careerElement.addEventListener('change', (event) => {validCareer(event.target)})
		perEmailElement.addEventListener('input', async(event) => {validPerEmail(event.target)})
		instEmailElement.addEventListener('input', async(event) => {validInstEmail(event.target)})
		password1Element.addEventListener('input', (event) => {validPassword1(event.target)})
		password2Element.addEventListener('input', (event) => {validPassword2(event.target)})
	}

	onMount(() => {
		getLists();
		listenerValidity()
		//validate()
	});
</script>
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
		<form class="my-3" on:submit="{(e)=>{e.preventDefault();checkCreateValidation();}}">
			<div class="form-row">
				<div class="row mb-1">
					<div class="col-md-4 mb-3">
						<i class="fa fa-user mx-2" aria-hidden="true" /><label for="name" class="form-label"
							>Nombre(s)</label
						>
						<input
							bind:this="{nameElement}"
							bind:value={student.name}
							id="name"
							placeholder="Ingresa tu nombre"
							type="text"
							class="form-control"
							autocomplete="off"
							aria-label="Nombre"
							
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
						/>
						{#each schoolIdFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}

						{#if !verifySchoolId}
							<div class="invalid-feedback mx-2">La matrícula ya está en uso.</div>
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
						/>
						{#each perEmailFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
						{#if !verifyPerEmailExistence}
							<div class="invalid-feedback">
								Correo electrónico en uso.
							</div>
						{/if}
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
						/>
						{#each instEmailFeedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}

						{#if !verifyEmailUserExistence}
							<div class="invalid-feedback">
								Correo electrónico en uso.
							</div>
						{/if}
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
						/>
						{#each password2Feedback as i}
							<div class="invalid-feedback mx-2">{i}</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="d-block">
				<button type="submit" class="btn btn-primary"
						><i class="fas fa-paper-plane" /> Registrarse
				</button>
			</div>

			<!-- <div class="d-block">
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
			</div> -->
		</form>
	</div>
</main>

