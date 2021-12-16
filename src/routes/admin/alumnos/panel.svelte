<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Notrecords from './../../../components/notrecords.svelte';
	import axiosapi from './../../../utils/axiosapi';
	import swal from './../../../utils/sweetalert2';

	const TITQDELETE = '¿Está seguro que desea eliminar este registro?';
	const TITDELETED = 'Eliminado';
	const TXTDELETED = 'El registro se ha eliminado exitosamente.';
	const TITUPDATED = 'Actualizado';
	const TXTUPDATED = 'El registro se ha actualizado exitosamente.';

	let students = {
		search: '',
		page: 1,
		totalRecords: 0,
		totalPages: 0,
		limit: 0,
		offset: 0,
		rows: []
	};

	let oldStudent = {
		id_user: 0,
		id: 0,
		name: '',
		first_last_name: '',
		second_last_name: '',
		school_id: '',
		career: '',
		acronym_career: '',
		grade: 0,
		level: '',
		acronym_division: ''
	};

	let searched = false;
	let wordSearched = '';
	let searching = false;

	let grades = []
	let divisions = []
	let levels = []
	let careers = []
	//let divisionSelected = '';
	//let levelSelected = '';

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
	let verifySchoolId = true
	let verifyEmailUserExistence = true
	let verifyPerEmailExistence = true
	let schoolId = ''
	let perEmail = ''
	let instEmail = ''

	let btnBack


	const getStudents = async () => {
		axiosapi
			.doGet('http://localhost:3001/student/get')
			.then((res) => {
				students = res.data;
				searched = false;
			})
			.catch(() => {
				swal.err();
			});
	};

	const getStudensBySearch = async () => {
		searching = true;
		let endpoint = 'http://localhost:3001/student/get';

		if (students.search != undefined && students.search != '') {
			endpoint = 'http://localhost:3001/student/get?search=' + students.search;
			searched = true;
			wordSearched = students.search;
		} else {
			searched = false;
		}

		axiosapi
			.doGet(endpoint)
			.then((res) => {
				students = res.data;
			})
			.catch(() => {
				swal.err();
			})
			.finally(() => {
				searching = false;
			});
	};

	const getStudentsByPage = async (page) => {
		let endpoint = 'http://localhost:3001/student/get?page=' + page;
		if (searched) {
			endpoint += '&search=' + wordSearched;
		}

		axiosapi
			.doGet(endpoint)
			.then((res) => {
				students = res.data;
			})
			.catch(() => {
				swal.err();
			});
	};

	const getStudentsByNextPage = async () => {
		getStudentsByPage(students.page + 1);
	};

	const getStudentsByPreviousPage = async () => {
		getStudentsByPage(students.page - 1);
	};

	const getStudent = async (id) => {
		axiosapi.doGet('/student/get/' + id)
			.then((res) => {
				oldStudent = res.data;
				schoolId = res.data.school_id
				perEmail = res.data.personal_email
				instEmail = res.data.email
				console.log(oldStudent);
				// divisionSelected = res.data.id_division
				// levelSelected = res.data.id_level
				filterCareer()
			})
			.catch(() => {
				swal.err();
		});

		getLists()
	};

	const getLists = () => {
		axiosapi.doGet('http://localhost:3001/grade/get/active')
			.then((res) => {
				grades = res.data;
			})
			.catch(() => {
				swal.err();
		});

		axiosapi.doGet('http://localhost:3001/academic/division/get')
			.then((res) => {
				divisions = res.data;
			})
			.catch(() => {
				swal.err();
		});

		axiosapi.doGet('http://localhost:3001/academic/level/get/active')
			.then((res) => {
				levels = res.data;
			})
			.catch(() => {
				swal.err();
		});
	}

	const deleteStudent = async (id) => {
		swal.concan('question', TITQDELETE).then((res) => {
			if (res.isConfirmed) {
				axiosapi
					.doDelete('http://localhost:3001/student/delete/' + id)
					.then(() => {
						getStudents();
						swal.con('success', TITDELETED, TXTDELETED);
					})
					.catch(() => {
						swal.err();
					});
			}
		});
	};

	const updateStudent = () => {
		//oldStudent.id_division = divisionSelected
		oldStudent
		console.log(oldStudent);
		axiosapi.doPut('/student/update/'+ oldStudent.id, oldStudent).then((res) => {
			swal.con('success', TITUPDATED, TXTUPDATED)
			
		}).catch(() => {
			swal.err()
		})
	}

	const filterCareer = () => {
		if (oldStudent.id_division != 0 && oldStudent.id_level != 0) {
			console.log('filtrando...');
			axiosapi
				.doGet('http://localhost:3001/career/get/' + oldStudent.id_division + '/' + oldStudent.id_level)
				.then((res) => {
					careers = res.data;
					if(res.data.length === 0){
						oldStudent.id_career = ''
					}
				})
				.catch(() => {
					swal.err();
				});
		}
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

	
	const checkUpdateValidation = async() => {
		let respSchoolId = await validSchoolId(schoolIdElement).then((res) => {
			return res
		})
		let respInstEmail = await validInstEmail(instEmailElement).then((res) => {
			return res
		})
		let respPerEmail = await validPerEmail(perEmailElement).then((res) => {
			return res
		})
		let ok = true
		ok = validName(nameElement) && ok
		ok = respPerEmail && ok
		ok = validFirstLastName(firstLastNameElement) && ok
		ok = validSecondLastName(secondLastNameElement) && ok
		ok = respSchoolId && ok
		ok = validGrade(gradeElement) && ok
		ok = validGroup(groupElement) && ok
		ok = validDivision(divisionElement) && ok
		ok = validLevel(levelElement) && ok
		ok = validCareer(careerElement) && ok
		
		ok = respInstEmail && ok

		if(ok){
			updateStudent()
			btnBack.click()
		}
	}

	const verifyEmail = (valor) => {
		let regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		let resp = regex.test(valor)

		if(resp){
			return true
		}else{
			return false
		}
	}

	const clear = async() => {
		let classElement = "form-control"
		let classElementSelect = "form-select"

		nameElement.value = ''
		nameElement.className = classElement		
		nameFeedback = [];

		firstLastNameElement.value = ''
		firstLastNameElement.className = classElement
		firstLastNameFeedback = []

		secondLastNameElement.value = ''
		secondLastNameElement.className = classElement
		secondLastNameFeedback = []

		schoolIdElement.value = ''
		schoolIdElement.className = classElement
		schoolIdFeedback = []

		gradeElement.value = ''
		gradeElement.className = classElementSelect
		gradeFeedback = []

		groupElement.value = ''
		groupElement.className = classElement
		groupFeedback = []

		divisionElement.value = ''
		divisionElement.className = classElementSelect
		divisionFeedback = []

		levelElement.value = ''
		levelElement.className = classElementSelect
		levelFeedback = []

		careerElement.value = ''
		careerElement.className = classElementSelect
		careerFeedback = []

		perEmailElement.value = ''
		perEmailElement.className = classElement
		perEmailFeedback = []

		instEmailElement.value = ''
		instEmailElement.className = classElement
		instEmailFeedback = []

		verifySchoolId = true
		verifyEmailUserExistence = true
		verifyPerEmailExistence = true
		schoolId = ''
		perEmail = ''
		instEmail = ''
		// divisionSelected = '';
		// levelSelected = '';

		await getStudents()
		getStudent(oldStudent.id)
		

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

		if(value.toLowerCase() != schoolId.toLowerCase()){
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
		oldStudent.grupo = value
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

		if(value.toLowerCase() != perEmail.toLowerCase()){
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
		if(value.toLowerCase() != instEmail.toLowerCase()){
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
		}

		return validated
	}

	const listenerValidity = () => {
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
	}

	onMount(async () => {
		await getStudents();
		listenerValidity()
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow" >
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-user-graduate" /> Alumnos</h3>
			</div>
		</div>
		<hr />
		<div class="row mb-3">
			<div class="col">
				<div class="container">
					<div class="row justify-content-end">
						<div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-6 col-xxl-6">
							<div class="input-group mb-3">
								{#if searched}
									<button class="btn btn-outline-success" on:click={() => getStudents()}>
										<i class="fas fa-sync-alt" /> Mostrar todos
									</button>
								{/if}
								<input
									type="text"
									class="form-control"
									placeholder="Busca algo..."
									aria-label="Buscador"
									aria-describedby="button-search"
									bind:value={students.search}
								/>
								<button
									class="btn btn-outline-primary"
									type="button"
									id="button-search"
									on:click={() => getStudensBySearch()}
								>
									{#if searching}
										<span
											class="spinner-border spinner-border-sm"
											role="status"
											aria-hidden="true"
										/>
										<span class="visually-hidden">Loading...</span>
									{:else}
										<i class="fas fa-search" />
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>

				{#if students.rows.length == 0}
					<Notrecords />
				{:else}
					<div class="table-responsive my-2">
						<table id="filter-table" class="table table-hover table-striped">
							<caption>
								Mostrando {students.offset + 1} - {students.offset + students.limit >
								students.totalRecords
									? students.totalRecords
									: students.offset + students.limit} de {students.totalRecords} registros totales.
							</caption>
							<thead>
								<tr class="text-center">
									<th>No.</th>
									<th>Nombre Completo</th>
									<th>Matrícula</th>
									<th>Grado</th>
									<th>Carrera</th>
									<th>Nivel</th>
									<th>División Académica</th>
									<th>Opciones</th>
								</tr>
							</thead>
							<tbody>
								{#each students.rows as s, i}
									<tr class="text-center">
										<td>{i + 1}</td>
										<td>{s.name} {s.first_last_name} {s.second_last_name}</td>
										<td>{s.school_id}</td>
										<td>{s.grade}°</td>
										<td>{s.acronym_career}</td>
										<td>{s.level}</td>
										<td>{s.acronym_division}</td>
										<td>
											<div class="btn-group" role="group">
												<!-- <button
													type="button"
													on:click={() => getStudent(s.id)}
													class="btn btn-outline-primary"
													data-bs-toggle="modal" data-bs-target="#updateModal"
												>
													<i class="fas fa-eye" />
												</button> -->
												<button on:click="{()=>{goto(`/admin/alumnos/perfil/${s.id_user}`)}}" type="button" class="btn btn-outline-primary">
													<i class="fas fa-eye"></i>
												</button>
												<button
													type="button"
													class="btn btn-outline-danger"
													on:click={() => deleteStudent(s.id_user)}
												>
													<i class="fas fa-trash-alt" />
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<nav aria-label="...">
						<ul class="pagination justify-content-end">
							{#if students.page - 1 === 0}
								<li class="page-item disabled">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">Anterior</a>
								</li>
							{:else}
								<li class="page-item">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="" on:click={() => getStudentsByPreviousPage()}
										>Anterior</a
									>
								</li>
							{/if}

							{#each Array.from({ length: students.totalPages }, (_, i) => 1 + i * 1) as item}
								{#if students.page == item}
									<li class="page-item active" aria-current="page">
										<!-- svelte-ignore a11y-invalid-attribute -->
										<a class="page-link" href="">{item}</a>
									</li>
								{:else}
									<li class="page-item" aria-current="page">
										<!-- svelte-ignore a11y-invalid-attribute -->
										<a class="page-link" href="" on:click={() => getStudentsByPage(item)}>{item}</a>
									</li>
								{/if}
							{/each}

							{#if students.page === students.totalPages}
								<li class="page-item disabled">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">Siguiente</a>
								</li>
							{:else}
								<li class="page-item">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="" on:click={() => getStudentsByNextPage()}>Siguiente</a
									>
								</li>
							{/if}
						</ul>
					</nav>
				{/if}
			</div>
		</div>
	</div>

	<!-- Modal Update-->
	<div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered">
		  <div class="modal-content">
			<div class="modal-header">
			  <h5 class="modal-title" id="exampleModalLabel">
				<i class="fas fa-edit" /> Alumno
			  </h5>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body ms-2 mb-0">
				<div id="collap1" class="collapse show multi-collapse ck-1 ck-2">
					<div class="row mb-1">
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fa fa-user"></i> Nombre
							</div>
							<div>{oldStudent.name}</div>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fa fa-user"></i> Primer apellido
							</div>
							<div>{oldStudent.first_last_name}</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-6">
							<div class="fw-bold">
								<i class="fa fa-user"></i> Segundo apellido
							</div>
							<div>{oldStudent.second_last_name}</div>
						</div>
					</div>
					<hr>
					<div class="row mb-1">
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fa fa-id-card"></i> Matrícula
							</div>
							<div>{oldStudent.school_id}</div>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-graduation-cap"></i> Grado
							</div>
							<div>{oldStudent.grade}°</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-user-friends"></i> Grupo
							</div>
							<div>{oldStudent.grupo}</div>
						</div>
					</div>
					<hr>
					<div class="row mb-1">
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-university"></i> División académica
							</div>
							<div>{oldStudent.name_division}</div>
						</div>
						<div class="col-lg-4 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-graduation-cap"></i> Nivel académico
							</div>
							<div>{oldStudent.level}</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-briefcase"></i> Carrera
							</div>
							<div>{oldStudent.career}</div>
						</div>
					</div>
					<hr>
					<div class="row mb-1">
						<div class="col-lg-6 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-envelope"></i> Correo electrónico personal
							</div>
							<div>{oldStudent.personal_email}</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6">
							<div class="fw-bold">
								<i class="fas fa-envelope"></i> Correo electrónico institucional
							</div>
							<div>{oldStudent.email}</div>
						</div>
					</div>

					<div class="modal-footer mb-0 pb-0 pe-0">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
							<i class="fas fa-times" /> Cerrar
						</button>
						<button type="button" on:click="{async() => { await clear()}}" class="btn btn-primary"  data-bs-toggle="collapse" data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
							<i class="fas fa-edit" /> Editar
						</button>
					</div>
				</div>
				<div id="collap2" class="collapse multi-collapse ck-1">
					<form on:submit="{(e)=>{e.preventDefault();checkUpdateValidation()}}">
						<div class="row mb-3">
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="name" class="form-label">
									<i class="fa fa-user"/> Nombre
								</label>
								<input 
									bind:value="{oldStudent.name}"
									bind:this="{nameElement}"
									type="text" 
									id="name" 
									class="form-control"
									autocomplete="off">
								{#each nameFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="firstLastname" class="form-label">
									<i class="fa fa-user"/> Primer apellido
								</label>
								<input 
									bind:value="{oldStudent.first_last_name}"
									bind:this="{firstLastNameElement}"
									type="text" 
									id="firstLastname" 
									class="form-control"
									autocomplete="off"
								>
								{#each firstLastNameFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
							<div class="col-lg-4 col-md-12 col-sm-6">
								<label for="secondLastname" class="form-label">
									<i class="fa fa-user"/> Segundo apellido
								</label>
								<input 
									bind:value="{oldStudent.second_last_name}"
									bind:this="{secondLastNameElement}"
									type="text" 
									id="secondLastname" 
									class="form-control"
									autocomplete="off">
								{#each secondLastNameFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="schoolId" class="form-label">
									<i class="fa fa-id-card"/> Matrícula
								</label>
								<input 
									bind:value="{oldStudent.school_id}"
									bind:this="{schoolIdElement}"
									type="text" 
									id="schoolId" 
									class="form-control"
									autocomplete="off">
								{#each schoolIdFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
		
								{#if !verifySchoolId}
									<div class="invalid-feedback mx-2">La matrícula ya está en uso.</div>
								{/if}
							</div>
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="grade" class="form-label">
									<i class="fa fa-graduation-cap"/> Grado
								</label>
								<select
									bind:value="{oldStudent.id_grade}" 
									bind:this={gradeElement}
									id="grade" 
									class="form-select"
								>
								{#if grades.length > 0}
									{#if oldStudent.id_grade == ''}
										<option selected disabled value={oldStudent.id_grade}>Selecciona un grado</option>
									{:else}
										<option disabled>Selecciona un grado</option>
									{/if}
									{#each grades as grade}
										<option value={grade.id}>{grade.grade}</option>
									{/each}
								{:else}
									<option selected disabled value={oldStudent.id_grade}>No hay grados disponibles</option>
								{/if}
								</select>
								{#each gradeFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
							<div class="col-lg-4 col-md-12 col-sm-6">
								<label for="group" class="form-label">
									<i class="fas fa-user-friends"/> Grupo
								</label>
								<input 
									bind:value="{oldStudent.grupo}"
									bind:this= {groupElement}
									type="text" 
									id="group" 
									class="form-control"
									autocomplete="off">
								{#each groupFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="academicDivision" class="form-label">
									<i class="fas fa-university"/> División académica
								</label>
								<select 
									bind:value="{oldStudent.id_division}"
									bind:this= {divisionElement}
									on:change={() => filterCareer()}
									id="academicDivision" 
									class="form-select"
								>
								{#each divisions as div}
									<option value={div.id}>{div.acronym}</option>
								{/each}
								<!-- {#if divisions.length > 0}
									{#if oldStudent.id_division == ''}
										<option selected disabled value={oldStudent.id_division}
											>Selecciona una división académica</option
										>
									{:else}
										<option disabled>Selecciona una división académica</option>
									{/if}
									{#each divisions as div}
										<option value={div.id}>{div.acronym}</option>
									{/each}
								{:else}
									<option selected disabled value={oldStudent.id_division}
										>No hay divisiones académicas disponibles</option
									>
								{/if} -->
								</select>
								{#each divisionFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
							<div class="col-lg-4 col-md-6 col-sm-6">
								<label for="academicLevel" class="form-label">
									<i class="fas fa-graduation-cap"/> Nivel académico
								</label>
								<select 
									bind:value="{oldStudent.id_level}"
									bind:this={levelElement}
									on:change={() => filterCareer()}
									id="academicLevel" 
									class="form-select"
								>
								{#if levels.length > 0}
									{#if oldStudent.id_level == ''}
										<option selected disabled value={oldStudent.id_level}
											>Selecciona un nivel académico</option
										>
									{:else}
										<option disabled>Selecciona un nivel académico</option>
									{/if}
									{#each levels as level}
										<option value={level.id}>{level.name}</option>
									{/each}
								{:else}
									<option selected disabled value={oldStudent.id_level}
										>No hay niveles académicos disponibles</option
									>
								{/if}
								</select>
								{#each levelFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
							<div class="col-lg-4 col-md-12 col-sm-6">
								<label for="career" class="form-label">
									<i class="fas fa-briefcase"/> Carrera
								</label>
								<select 
									bind:value="{oldStudent.id_career}"
									bind:this= {careerElement}
									id="career" 
									class="form-select"
								>
								{#if careers.length > 0}
									{#if oldStudent.id_career == ''}
										<option value={oldStudent.id_career} selected disabled>Selecciona una carrera</option>
									{:else}
										<option disabled>Selecciona una carrera</option>
									{/if}
									{#each careers as career}
										<option value={career.id}>{career.acronym}</option>
									{/each}
								{:else}
									<option value={oldStudent.id_career} selected disabled
										>No hay carreras disponibles</option
									>
								{/if}
								</select>
								{#each careerFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-lg-6 col-md-6 col-sm-6">
								<label for="personalEmail" class="form-label">
									<i class="fas fa-envelope"/> Correo electrónico personal
								</label>
								<input 
									bind:value="{oldStudent.personal_email}"
									bind:this= {perEmailElement}
									type="text" 
									id="personalEmail" 
									class="form-control"
									autocomplete="off">
								{#each perEmailFeedback as i}
									<div class="invalid-feedback mx-2">{i}</div>
								{/each}
								{#if !verifyPerEmailExistence}
									<div class="invalid-feedback">
										Correo electrónico en uso.
									</div>
								{/if}
							</div>
							<div class="col-lg-6 col-md-6 col-sm-6">
								<label for="instEmail" class="form-label">
									<i class="fas fa-envelope"/> Correo electrónico institucional
								</label>
								<input 
									bind:value="{oldStudent.email}"
									bind:this= {instEmailElement}
									type="text" 
									id="instEmail" 
									class="form-control"
									autocomplete="off">
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
	
						<div class="modal-footer mb-0 pb-0 pe-0">
							<button 
								type="button" 
								on:click="{async() => { await clear()}}"
								bind:this="{btnBack}" 
								class="btn btn-secondary" 
								data-bs-toggle="collapse" 
								data-bs-target=".ck-1" 
								aria-expanded="false" 
								aria-controls="collap1 collap2">
								<i class="fas fa-times" /> Cancelar
							</button>
							<button type="submit" class="btn btn-primary">
								<i class="fas fa-save" /> Guardar
							</button>
						</div>
					</form>
				</div>
			</div>
		  </div>
		</div>
	  </div>
</main>
