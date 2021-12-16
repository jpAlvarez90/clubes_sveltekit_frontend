<script context="module">
    export async function load({page}){
        let id = 0
        let param = parseInt(page.params.id)
        if(!isNaN(param)){
            id = param
        }
        return {props: {id}}
    }
</script>
<script>
    import { onMount } from "svelte";
    import axiosapi from '/src/utils/axiosapi'
    import swal from '/src/utils/sweetalert2'
    import srcIcon from '/static/img/HALCÓN_2016.png'
    import NotRecords from '/src/components/notrecords.svelte'
    import { goto } from '$app/navigation';

    export let id = 0
    const idUser = id
    const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."

    let student = {
        id: 0,
        name: "",
        first_last_name: "",
        second_last_name: "",
        school_id: "",
        grupo: "",
        personal_email: "",
        email: "",
        id_division: 0,
        acronym_division: "",
        id_academic_level: 0,
        level_name: "",
        id_career: 0,
        acronym_career: "",
        id_grade: 0,
        grade: ""
    }
    let groups = []
    let grades = []
    let divisions = []
    let levels = []
    let careers = []
    

    let isEdit = false
    let dGroup = "d-none"
    let btnclearpassword
    let btnclearprofile

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

    const getProfile = async()=>{
        if(idUser == 0){
            goto("/admin/alumnos/panel")
        }else{
            await axiosapi.doGet(`/student/get/profile/${idUser}`).then(res=>{
                student = res.data
                console.log(res.data);
                schoolId = res.data.school_id
				perEmail = res.data.personal_email
				instEmail = res.data.email
                getGroups(student.id)
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

                filterCareer()
                
            }).catch(err=>{
                swal.err()
                goto("/admin/alumnos/panel")
            })

            //await getLists()
        }
    }

    const getGroups = (idStudent)=>{
        axiosapi.doGet(`/student/get/groups/${idStudent}`).then(res=>{
            console.log(res.data);
            groups = res.data
        }).catch(()=>{
            swal.err()
        })
    }

    const getLists = async() => {
		// axiosapi.doGet('http://localhost:3001/grade/get/active')
		// 	.then((res) => {
		// 		grades = res.data;
		// 	})
		// 	.catch(() => {
		// 		swal.err();
		// });

		// // axiosapi.doGet('http://localhost:3001/academic/division/get')
		// // 	.then((res) => {
		// // 		divisions = res.data;
		// // 	})
		// // 	.catch(() => {
		// // 		swal.err();
		// // });

		// axiosapi.doGet('http://localhost:3001/academic/level/get/active')
		// 	.then((res) => {
		// 		levels = res.data;
		// 	})
		// 	.catch(() => {
		// 		swal.err();
		// });
	}
    const filterCareer = () => {
		if (student.id_division != 0 && student.id_academic_level != 0) {
			console.log('filtrando...');
			axiosapi
				.doGet('http://localhost:3001/career/get/' + student.id_division + '/' + student.id_academic_level)
				.then((res) => {
					careers = res.data;
					if(res.data.length === 0){
						student.id_career = ''
					}
				})
				.catch(() => {
					swal.err();
				});
		}
	};

    const clearProfile = async() => {
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

        await getProfile()
    }

    const onlyLetters = (value) => {
		let regex = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
		let resp = regex.test(value)
		if(resp){
			return true
		}else{
			return false
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
		student.grupo = value
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

    const checkProfileValidity = async()=>{
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
            updateProfile()
            console.log('ok');
            btnclearprofile.click()
        }
    }

    const listenerValidity = ()=>{
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

    const getColorCard = (i)=>{
        let start = new Date(groups[i].closing_date)
        let final = new Date(groups[i].final_date)
        let now = new Date()
        let acc = groups[i].accredited
        let str
        if(now>start && now<final && acc == 0){
            str = "primary"
        }else{
            str = acc==1?"success":"secondary"
        }
        return str
    }

    const updateProfile = ()=>{
        axiosapi.doPut('/student/update/'+ student.id, student).then((res) => {
			swal.con('success', TITUPDATED, TXTUPDATED)
			
		}).catch(() => {
			swal.err()
		})
    }

    onMount(async()=>{
        await getProfile()
        //await getLists()
        listenerValidity()
    })
</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <h1><i class="fa fa-list " data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top"></i> Panel</h1>
        <hr>
        <div class="row">
            <div class="container main-card rounded border px-4 py-4 mb-4">
                <h2><i class="fa fa-user-tie"></i> Datos Personales</h2>
                <hr>
                <div class="row g-3 align-items-center">
                    <div class="col-lg-4">
                        <div class="text-center">
                            <img class="my-2 mx-auto d-block" src="{srcIcon}" width="150rem" alt="profile icon">
                            <div class="fw-bold">{student.name} {student.first_last_name}</div>
                            <div class="text-muted">{student.email}</div>
                            <div class="pt-2">
                                {#if !isEdit}
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <button class="btn btn-outline-primary" 
                                                data-bs-toggle="collapse" 
                                                on:click="{()=>{getProfile()}}"
                                                data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
                                                <i class="fa fa-edit"></i> Editar perfil
                                            </button>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div id="collap1" class="collapse show multi-collapse ck-1 ck-2">
                            <hr>
                            <div class="row text-sm-center text-md-start g-3 mb-3">
                                <div class="col-md-6 col-lg-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-user"></i> Nombre
                                    </div>
                                    <div>{student.name}</div>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-user"></i> Primer apellido
                                    </div>
                                    <div>{student.first_last_name}</div>
                                </div>
                                <div class="col-md-12 col-lg-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-user"></i> Segundo apellido
                                    </div>
                                    <div>{student.second_last_name}</div>
                                </div>
                            </div>
                            <hr>
                            <div class="row text-sm-center text-md-start g-3 mb-3">
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-envelope"></i> Correo electrónico institucional
                                    </div>
                                    <div>{student.email}</div>
                                </div>
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-envelope"></i> Correo electrónico personal
                                    </div>
                                    <div>{student.personal_email}</div>
                                </div>
                            </div>
                            <hr>
                            <div class="row text-sm-center text-md-start g-3 mb-3">
                                <div class="col-md-3 col-lg-6 col-xl-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-graduation-cap"></i> Matrícula
                                    </div>
                                    <div>{student.school_id}</div>
                                </div>
                                <div class="col-md-3 col-lg-6 col-xl-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-graduation-cap"></i> Grado & Grupo
                                    </div>
                                    <div>{student.grade}°{student.grupo}</div>
                                </div>
                                <div class="col-md-3 col-lg-6 col-xl-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-graduation-cap"></i> Especialidad
                                    </div>
                                    <div>{student.acronym_division} - {student.level_name}</div>
                                </div>
                                <div class="col-md-3 col-lg-6 col-xl-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-graduation-cap"></i> Carrera
                                    </div>
                                    <div>{student.acronym_career}</div>
                                </div>
                            </div>
                            <hr>
                        </div>
                        <div id="collap2" class="collapse multi-collapse ck-1">
                            <form on:submit="{(e)=>{e.preventDefault();checkProfileValidity()}}">
                                <div class="container">
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <label for="name" class="form-label">
                                                <i class="fa fa-user"></i> Nombre
                                            </label>
                                            <input 
                                                bind:this="{nameElement}" 
                                                bind:value="{student.name}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="name" 
                                                placeholder="Nombre">
                                            {#each nameFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="lastname" class="form-label">
                                                <i class="fa fa-user"></i> Primer apellido
                                            </label>
                                            <input 
                                                bind:this="{firstLastNameElement}"
                                                bind:value="{student.first_last_name}" 
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="lastname" 
                                                placeholder="Primer apellido">
                                            {#each firstLastNameFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="second_lastname" class="form-label">
                                                <i class="fa fa-user"></i> Segundo apellido
                                            </label>
                                            <input 
                                                bind:this="{secondLastNameElement}" 
                                                bind:value="{student.second_last_name}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="second_lastname" 
                                                placeholder="Segundo apellido">
                                            {#each secondLastNameFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <label for="email" class="form-label">
                                                <i class="fa fa-envelope"></i> Correo electrónico institucional
                                            </label>
                                            <input 
                                                bind:this="{instEmailElement}" 
                                                bind:value="{student.email}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="email" 
                                                placeholder="Correo electrónico institucional">
                                            {#each instEmailFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifyEmailUserExistence}
                                                <div class="invalid-feedback">
                                                    Correo electrónico en uso.
                                                </div>
                                            {/if}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="personal_email" class="form-label">
                                                <i class="fa fa-envelope"></i> Correo electrónico personal
                                            </label>
                                            <input 
                                                bind:this="{perEmailElement}" 
                                                bind:value="{student.personal_email}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="personal_email" 
                                                placeholder="Correo electrónico personal">
                                            {#each perEmailFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifyPerEmailExistence}
                                                <div class="invalid-feedback">
                                                    Correo electrónico en uso.
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <label for="school" class="form-label">
                                                <i class="fa fa-graduation-cap"></i> Matrícula
                                            </label>
                                            <input 
                                                bind:this="{schoolIdElement}" 
                                                bind:value="{student.school_id}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="school" 
                                                placeholder="Matrícula">
                                            {#each schoolIdFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifySchoolId}
                                                <div class="invalid-feedback mx-2">La matrícula ya está en uso.</div>
                                            {/if}
                                        </div>
                                        <div class="col-md-6"></div>
                                        <div class="col-md-6">
                                            <label for="grade" class="form-label">
                                                <i class="fa fa-graduation-cap"></i> Grado
                                            </label>
                                            <select 
                                                bind:this={gradeElement}
                                                bind:value="{student.id_grade}"
                                                class="form-select" 
                                                id="grade">
                                                    {#if grades.length > 0}
                                                        {#if gradeElement == ''}
                                                            <option selected disabled value={gradeElement}>Selecciona un grado</option>
                                                        {:else}
                                                            <option disabled>Selecciona un grado</option>
                                                        {/if}
                                                        {#each grades as grade}
                                                            <option value={grade.id}>{grade.grade}</option>
                                                        {/each}
                                                    {:else}
                                                        <option selected disabled value={gradeElement}>No hay grados disponibles</option>
                                                    {/if}
                                                {#each gradeFeedback as item}
                                                    <div class="invalid-feedback">
                                                        {item}
                                                    </div>
                                                {/each}
                                            </select>
                                            {#each gradeFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="group" class="form-label">
                                                <i class="fa fa-graduation-cap"></i> Grupo
                                            </label>
                                            <input 
                                                bind:this="{groupElement}" 
                                                bind:value="{student.grupo}"
                                                autocomplete="off" 
                                                class="form-control" 
                                                type="text" 
                                                id="group" 
                                                placeholder="Grupo">
                                            {#each groupFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="division" class="form-label"> 
                                                <i class="fa fa-graduation-cap"></i> División
                                            </label>
                                            <select 
                                                bind:this= {divisionElement}
                                                bind:value="{student.id_division}"
                                                on:change={() => filterCareer()}
                                                class="form-select" 
                                                id="division">
                                                {#each divisions as item}
                                                    <option value={item.id}>{item.acronym}</option>
                                                {/each}
                                            </select>
                                            {#each divisionFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="level" class="form-label">
                                                <i class="fa fa-graduation-cap"></i> Nivel Académico
                                            </label>
                                            <select 
                                                bind:this={levelElement}
                                                bind:value="{student.id_academic_level}"
                                                on:change={() => filterCareer()}
                                                class="form-select" 
                                                id="level">
                                                {#each levels as item}
                                                <option value={item.id}>{item.name}</option>
                                                {/each}
                                            </select>
                                            {#each levelFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="career" class="form-label">
                                                <i class="fa fa-graduation-cap"></i> Carrera
                                            </label>
                                            <select 
                                                bind:this= {careerElement}
                                                bind:value="{student.id_career}"
                                                class="form-select" 
                                                id="career">
                                                {#if careers.length > 0}
                                                    {#if student.id_career == ''}
                                                        <option value={student.id_career} selected disabled>Selecciona una carrera</option>
                                                    {:else}
                                                        <option disabled>Selecciona una carrera</option>
                                                    {/if}
                                                    {#each careers as item}
                                                    <option value={item.id}>{item.acronym}</option>
                                                    {/each}
                                                {:else}
                                                    <option value={student.id_career} selected disabled
                                                        >No hay carreras disponibles</option
                                                    >
                                                {/if}
                                                
                                            </select>
                                            {#each careerFeedback as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <button 
                                                bind:this="{btnclearprofile}" type="button" on:click="{()=>{clearProfile()}}" class="btn btn-secondary w-100" data-bs-toggle="collapse" data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
                                                <i class="fa fa-times"></i> Cancelar
                                            </button>
                                        </div>
                                        <div class="col-md-6">
                                            <button type="submit" class="btn btn-primary w-100">
                                                <i class="fa fa-save"></i> Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="container main-card rounded border px-4 py-4 mb-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <h2>
                        <i class="fa fa-chalkboard"></i> Talleres
                    </h2>
                    <div class="d-flex">
                        <div data-bs-toggle="tooltip" data-bs-placement="top" title="Taller acreditado" 
                        style="width: 2rem;height: 2rem;" 
                        class="bg-success rounded-circle shadow me-2"></div>

                        <div data-bs-toggle="tooltip" data-bs-placement="top" title="Taller no acreditado" 
                        style="width: 2rem;height: 2rem;" 
                        class="bg-secondary rounded-circle shadow me-2"></div>

                        <div data-bs-toggle="tooltip" data-bs-placement="top" title="Taller en curso" 
                        style="width: 2rem;height: 2rem;" 
                        class="bg-primary rounded-circle shadow"></div>
                    </div>
                </div>
                
                <hr>
                <div class="row g-3">
                    {#if groups.length === 0}
                        <NotRecords/>
                    {:else}
                        {#each groups as item,i}
                            <div class="col-md-6 col-lg-4 g-3 mb-3">
                                <div on:click="{()=>{}}" class="card h-100">
                                    <img  src="{item.image_url}" alt="Taller" class="card-img-top">
                                    <div class="card-body border-bottom border-5 border-{getColorCard(i)} rounded">
                                        <h5 class="card-title text-uppercase">{item.w_name} - <span class="text-lowercase">{item.type}</span></h5>
                                        <h6 class="card-subtitle mb-2 text-muted fst-italic border-bottom border-2 border-{getColorCard(i)} pb-3">{item.term} {item.year}</h6>
                                        <div class="d-flex flex-wrap">
                                            <div class="me-2 mb-2 text-{getColorCard(i)}">
                                                <i class="fa fa-calendar-alt"></i> Inicio: {new Date(item.start_date).toLocaleString().substring(0,10)}
                                            </div>
                                            <div class="me-2 mb-2 text-{getColorCard(i)}">
                                                <i class="fa fa-calendar-alt"></i> Fin: {new Date(item.final_date).toLocaleString().substring(0,10)}
                                            </div>
                                            <div class="me-2 mb-2 w-100">
                                                <i class="fa fa-user"></i> Instructor:<br>{item.ins_name} {item.first_last_name} {item.second_last_name}
                                            </div>
                                            <div class="me-2 mb-2 w-100">
                                                <i class="fa fa-users"></i> Grupo:<br>{item.g_name}
                                            </div>
                                            <div class="me-2">
                                                <i class="fa fa-calendar"></i> Horario:<br>{item.schedule}
                                            </div>
                                        </div>
                                        <div style="position:absolute;bottom:0;right:0;width: 2rem;height: 2rem;" class="mb-3 me-3 text-center text-white bg-{getColorCard(i)} rounded-circle shadow"></div>
                                    </div>
                                </div>
                            </div>                           
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>
</main>