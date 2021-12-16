<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte/internal';
    //import NotRecords from './../../components/notrecords.svelte'
    import NotRecords from '/src/components/notrecords.svelte'
    //import axiosapi from './../../utils/axiosapi'
    import axiosapi from '/src/utils/axiosapi'
    import swal from '/src/utils/sweetalert2'
    import srcIcon from '/static/img/HALCÓN_2016.png'

    const TITQDELETE = "¿Está seguro que desea eliminar este registro?"
	const TITDELETED = "Eliminado"
	const TXTDELETED = "El registro se ha eliminado exitosamente."
	const TITCREATED = "Creado"
	const TXTCREATED = "El registro se ha creado exitosamente."
	const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."
    

    let instructor = {
        id: 0,
        name: "",
        first_last_name: "",
        second_last_name: "",
        personal_email: "",
        email: "",
        phone: "",
        cellphone: ""
    }
    let workshops = []
    let groups = []

    let isEdit = false
    let dGroup = "d-none"
    let nameWorkshop = ""
    let typeWorkshop = ""
    let idWorkshop = 0
    let btnclearprofile
    let btnclearpassword
    let closemodalcreate

    let elementName
    let fbName = []
    let elementLastname
    let fbLastname = []
    let elementSecondLastname
    let fbSecondLastname = []
    let elementEmail
    let fbEmail = []
    let elementPersonalEmail
    let fbPersonalEmail = []
    let elementPhone
    let fbPhone = []
    let elementCellphone
    let fbCellphone = []

    let elementCurrentPassword
    let fbCurrentPassword = []
    let elementNewPassword
    let fbNewPassword = []
    let elementConfirmNewPassword
    let fbConfirmNewPassword = []

    // GRUPO
    let elementGName
    let fbGName = []
    let elementGMin
    let fbGMin = []
    let elementGMax
    let fbGMax = []
    let elementGSchedule
    let fbGSchedule = []
    let elementGCloseDate
    let fbGCloseDate = []
    let elementGStartDate
    let fbGStartDate = []
    let elementGFinalDate
    let fbGFinalDate = []

    let today = ''
    let tomorrow = ''

	let verifyEmailExistence = true
	let verifyEmailUserExistence = true
	let verifyCellphoneExistence = true
	let verifyPhoneExistence = true

    let emailU = ''
	let personalEmailU = ''
	let phoneU = ''
	let cellphoneU = ''

    const clearProfile = ()=>{
        let elementClass = "form-control"
        isEdit = !isEdit

        elementName.value = instructor.name
        elementName.className = elementClass
        fbName = []
        elementLastname.value = instructor.first_last_name
        elementLastname.className = elementClass
        fbLastname = []
        elementSecondLastname.value = instructor.second_last_name
        elementSecondLastname.className = elementClass
        fbSecondLastname = []
        elementEmail.value = instructor.email
        elementEmail.className = elementClass
        fbEmail = []
        elementPersonalEmail.value = instructor.personal_email
        elementPersonalEmail.className = elementClass
        fbPersonalEmail = []
        elementPhone.value = instructor.phone
        elementPhone.className = elementClass
        fbPhone = []
        elementCellphone.value = instructor.cellphone
        elementCellphone.className = elementClass
        fbCellphone = []

        verifyEmailExistence = true
        verifyEmailUserExistence = true
        verifyCellphoneExistence = true
        verifyPhoneExistence = true
        
    }

    const clearPassword = ()=>{
        let elementClass = "form-control"
        isEdit = !isEdit

        elementCurrentPassword.value = ""
        elementCurrentPassword.className = elementClass
        fbCurrentPassword = []

        elementNewPassword.value = ""
        elementNewPassword.className = elementClass
        fbNewPassword = []

        elementConfirmNewPassword.value = ""
        elementConfirmNewPassword.className = elementClass
        fbNewPassword = []


    }

    const clearGroup = ()=>{
        let elementClass = "form-control"

        elementGName.value = ''
        elementGName.className = elementClass
        fbGName = []

        elementGMin.value = ''
        elementGMin.className = elementClass
        fbGMin = []

        elementGMax.value = ''
        elementGMax.className = elementClass
        fbGMax = []

        elementGSchedule.value = ''
        elementGSchedule.className = elementClass
        fbGSchedule = []

        elementGCloseDate.value = ''
        elementGCloseDate.className = elementClass
        fbGCloseDate = []

        elementGStartDate.value = ''
        elementGStartDate.className = elementClass
        fbGStartDate = []

        elementGFinalDate.value = ''
        elementGFinalDate.className = elementClass
        fbGFinalDate = []

        elementGStartDate.disabled = true
        elementGFinalDate.disabled = true
    }

	const validName = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbName = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbName.push("El nombre no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbName.push("El nombre debe contener de 3 a 45 caracteres.")
		}
		
		return validated
	}

	const validLastname = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbLastname = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastname.push("El primer apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastname.push("El primer apellido contener de 3 a 45 caracteres.")
		}

		return validated
	}

	const validSecondLastname = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbSecondLastname = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastname.push("El segundo apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastname.push("El segundo apellido debe contener de 3 a 45 caracteres.")
		}

		return validated
	}

	const validEmail = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbEmail = []
		verifyEmailUserExistence = true
		target.className = `${elementClass} is-valid`

		// Formato de correo válido
		let emailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		if(!emailformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmail.push("El correo electrónico debe cumplir con un formato válido.")
		}
		if(v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmail.push("El correo electrónico es demasiado largo.")
		}
		if(v.split('@')[1] != 'utez.edu.mx'){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmail.push("El correo electrónico debe pertenecer al dominio @utez.edu.mx.")
		}

        console.log(emailU);
		if(v.toLowerCase() != emailU.toLowerCase()){
			if(v){
				const resp = await axiosapi.doGet('/user/verify/email/existence/'+ v).then((res)=>{
					return res.data
				}).catch(() => {
					swal.err()
				})

				if(resp > 0){
					validated = false
					target.className = `${elementClass} is-invalid`
					verifyEmailUserExistence = false
				}
			}else{
				validated = false
			}
		}
        

		return validated
	}

	const validPersonalEmail = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbPersonalEmail = []
		verifyEmailExistence = true
		target.className = `${elementClass} is-valid`

		// Formato de correo válido
		let emailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		if(!emailformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPersonalEmail.push("El correo electrónico debe cumplir con un formato válido.")
		}
		if(v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPersonalEmail.push("El correo electrónico es demasiado largo.")
		}

        if(v.toLowerCase() != personalEmailU.toLowerCase()){
            if(v){
                let obj = {
                    flag : "email",
                    data: v
                }

                const resp = await axiosapi.doPost('/instructor/verify/existence', obj).then((res)=>{
                    return res.data
                }).catch(() => {
                    swal.err()
                })

                if(resp > 0){
                    validated = false
                    target.className = `${elementClass} is-invalid`
                    verifyEmailExistence = false
                }
            }else{
                validated = false
            }
        }

		return validated
	}

	const validPhone = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbPhone = []
		verifyPhoneExistence = true
		target.className = `${elementClass} is-valid`

		// Formato de teléfono válido
		let phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
		if(!phoneformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPhone.push("El número telefónico debe cumplir con el formato (ej. 777-111-2233).")
		}
		if(v.length > 20){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPhone.push("El número telefónico es demasiado largo.")
		}

        if(v != phoneU){
            if(v){
                let obj = {
                    flag : "phone",
                    data: v
                }

                const resp = await axiosapi.doPost('/instructor/verify/existence', obj).then((res)=>{
                    return res.data
                }).catch(() => {
                    swal.err()
                })

                if(resp > 0){
                    validated = false
                    target.className = `${elementClass} is-invalid`
                    verifyPhoneExistence = false
                }
            }else{
                validated = false
            }
        }

		return validated
	}

	const validCellphone = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbCellphone = []
		verifyCellphoneExistence = true
		target.className = `${elementClass} is-valid`

		// Formato de teléfono válido
		let phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
		if(!phoneformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbCellphone.push("El número telefónico debe cumplir con el formato (ej. 777-111-2233).")
		}
		if(v.length > 20){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbCellphone.push("El número telefónico es demasiado largo (más de 20 caracteres).")
		}

        if(v != cellphoneU){
            if(v){
                let obj = {
                    flag : "cellphone",
                    data: v
                }

                const resp = await axiosapi.doPost('/instructor/verify/existence', obj).then((res)=>{
                    return res.data
                }).catch(() => {
                    swal.err()
                })

                if(resp > 0){
                    validated = false
                    target.className = `${elementClass} is-invalid`
                    verifyCellphoneExistence = false
                }
            }else{
                validated = false
            }
        }

		

		return validated
	}

    const validCurrentPassword = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbCurrentPassword = []
		target.className = `${elementClass} is-valid`

        if(v.length === 0){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbCurrentPassword.push("La contraseña no debe estar en blanco.")
        }



        return validated
    }

    const validNewPassword = (target)=>{
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNewPassword = []
		target.className = `${elementClass} is-valid`

		if(v.length < 8 || v.length > 255){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNewPassword.push("La contraseña debe contener de 8 a 255 caracteres.")
		}

        let mayu = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚ"
        let minu = "abcdefghijklmnopqrstuvwxyzáéíóú"
        let numb = "0123456789"
        let spec = "!@#$%^&*()_+|}{[]\:;?><,./-="

        let hasMayu = false
        for (let i = 0; i < mayu.length; i++) {
            if(v.includes(mayu[i])){
                hasMayu = true
            }
        }

        let hasMinu = false
        for (let i = 0; i < minu.length; i++) {
            if(v.includes(minu[i])){
                hasMinu = true
            }
        }

        let hasNumb = false
        for (let i = 0; i < numb.length; i++) {
            if(v.includes(numb[i])){
                hasNumb = true
            }
        }

        let hasSpec = false
        for (let i = 0; i < spec.length; i++) {
            if(v.includes(spec[i])){
                hasSpec = true
            }
        }

        
        if(!hasMayu || !hasMinu || !hasNumb || !hasSpec){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbNewPassword.push("La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales.")
        }

        validConfirmNewPassword(elementConfirmNewPassword)
        

        return validated
    }
    
    const validConfirmNewPassword = (target)=>{
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbConfirmNewPassword = []
		target.className = `${elementClass} is-valid`

        if(v === ""){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbConfirmNewPassword.push("El campo no debe estar en blanco.")
        }

        if(elementNewPassword.value != "" && !(v === elementNewPassword.value)){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbConfirmNewPassword.push("Los campos no coinciden.")
        }
        
        return validated
    }

    // GRUPO
    const validNameG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGName = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbGName.push("El nombre no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbGName.push("Completar el campo.")
        }
		if(v.length > 50){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbGName.push("El nombre debe contener máximo 50 caracteres.")
		}
		
		return validated
    }

    const validMinG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGMin = []
		target.className = `${elementClass} is-valid`
        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbGMin.push("Completar el campo.")
        }
        validMaxG(elementGMax)
        // if(elementGMax.value != '' ){
        //     if(parseInt(v) >= elementGMax.value){
        //         validated = false
        //         target.className = `${elementClass} is-invalid`
        //         fbGMin.push("El mínimo de integrantes debe ser menor al máximo de integrantes.")
        //     }

        //     validMaxG(elementGMax)
        // }
		
		return validated
    }

    const validMaxG = (target) => {
        let validated = true
        let v = target.value
        let elementClass = "form-control"
        fbGMax = []
        target.className = `${elementClass} is-valid`
        console.log(typeof(v));
        if(!v){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbGMax.push("Completar el campo.")
        }

        if(elementGMin.value != '' ){
            if(parseInt(v) < elementGMin.value){
                validated = false
                target.className = `${elementClass} is-invalid`
                fbGMax.push("El máximo de integrantes debe ser mayor al mínimo de integrantes.")
            }
        }

        return validated
    }

    const validScheduleG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGSchedule = []
		target.className = `${elementClass} is-valid`

        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbGSchedule.push("Completar el campo.")
        }
		if(v.length < 3 || v.length > 50){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbGSchedule.push("El horario debe contener de 3 a 50 caracteres.")
		}
		
		return validated
    }

    const validCloseDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGCloseDate = []
		target.className = `${elementClass} is-valid`
        dateTomorrow(v)

        if(!v){
            console.log('es menor');
            validated = false
            elementGStartDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbGCloseDate.push("Seleccione una fecha.")
        }else{
            if(v < today){
                validated = false
                elementGStartDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbGCloseDate.push("La fecha no puede ser atrasada.")
            }else{
                elementGStartDate.disabled = false
            }
        }
		
		return validated
    }

    const validStartDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGStartDate = []
		target.className = `${elementClass} is-valid`

        if(!v){
            validated = false
            elementGFinalDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbGStartDate.push("Seleccione una fecha.")
        }else{
            if(v < tomorrow){
                validated = false
                elementGFinalDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbGStartDate.push("La fecha debe ser mayor a la fecha límite de inscripción.")
            }else{
                elementGFinalDate.disabled = false
            }
        }
        
		return validated
    }

    const validFinalDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGFinalDate = []
		target.className = `${elementClass} is-valid`

        if(!v){
            validated = false
            elementGFinalDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbGFinalDate.push("Seleccione una fecha.")
        }else{
            if(v < tomorrow){
                validated = false
                elementGFinalDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbGFinalDate.push("La fecha debe ser mayor a la fecha límite de inscripción.")
            }else{
                elementGFinalDate.disabled = false
            }

            if(v < elementGStartDate.value){
                validated = false
                target.className = `${elementClass} is-invalid`
                fbGFinalDate.push("La fecha debe ser mayor a la fecha de inicio.")
            }
        }
		
		return validated
    }



    const checkPasswordValidity = ()=>{
        let ok = true
        ok = validCurrentPassword(elementCurrentPassword) && ok
        ok = validNewPassword(elementNewPassword) && ok
        ok = validConfirmNewPassword(elementConfirmNewPassword) && ok

        if(ok){
            updatePass()
            btnclearpassword.click()
        }

    }

    const checkProfileValidity = ()=>{
        let ok = true
        ok = validName(elementName) && ok
        ok = validLastname(elementLastname) && ok
        ok = validSecondLastname(elementSecondLastname) && ok
        ok = validEmail(elementEmail) && ok
        ok = validPersonalEmail(elementPersonalEmail) && ok
        ok = validPhone(elementPhone) && ok
        ok = validCellphone(elementCellphone) && ok

        if(ok){
            updateProfile()
            btnclearprofile.click()
        }
    }

    const checkGroupValidation = ()=>{
        let ok = true;
        ok = validNameG(elementGName) && ok
        ok = validMinG(elementGMin) && ok
        ok = validMaxG(elementGMax) && ok
        ok = validScheduleG(elementGSchedule) && ok
        ok = validCloseDateG(elementGCloseDate) && ok
        ok = validStartDateG(elementGStartDate) && ok
        ok = validFinalDateG(elementGFinalDate) && ok

        if(ok){
            console.log('ok');
            saveGroup()
            closemodalcreate.click()
        }
    }

    const saveGroup = ()=>{
        let data = {
            name: elementGName.value,
            minimum: elementGMin.value,
            maximum: elementGMax.value,
            schedule: elementGSchedule.value,
            id_instructor: instructor.id,
            id_workshop: idWorkshop,
            closing_date: elementGCloseDate.value,
            start_date: elementGStartDate.value,
            final_date: elementGFinalDate.value
        }
        axiosapi.doPost('/workshop/group/save',data).then(res=>{
            getGroups(data.id_workshop)
            swal.con('success',TITCREATED,TXTCREATED)
        }).catch(err=>{
            swal.err()
        })
    }

	const listenerValidity = ()=>{
        // Datos generales
		elementName.addEventListener('input',(e)=>{validName(e.target)})
		elementLastname.addEventListener('input',(e)=>{validLastname(e.target)})
		elementSecondLastname.addEventListener('input',(e)=>{validSecondLastname(e.target)})
		elementEmail.addEventListener('input',(e)=>{validEmail(e.target)})
		elementPersonalEmail.addEventListener('input',async(e)=>{validPersonalEmail(e.target)})
		elementPhone.addEventListener('input',async(e)=>{validPhone(e.target)})
		elementCellphone.addEventListener('input',async(e)=>{validCellphone(e.target)})

        // Contraseñas
        elementCurrentPassword.addEventListener('input',(e)=>{validCurrentPassword(e.target)})
        elementNewPassword.addEventListener('input',(e)=>{validNewPassword(e.target)})
        elementConfirmNewPassword.addEventListener('input',(e)=>{validConfirmNewPassword(e.target)})

        // Grupos
        elementGName.addEventListener('input', (e) => {validNameG(e.target)})
        elementGMin.addEventListener('input', (e) => {validMinG(e.target)})
        elementGMax.addEventListener('input', (e) => {validMaxG(e.target)})
        elementGSchedule.addEventListener('input', (e) => {validScheduleG(e.target)})
        elementGCloseDate.addEventListener('input', (e) => {validCloseDateG(e.target)})
        elementGStartDate.addEventListener('input', (e) => {validStartDateG(e.target)})
        elementGFinalDate.addEventListener('input', (e) => {validFinalDateG(e.target)})

	}

    const changeWorkshop = (i)=>{
        dGroup = ""
        workshops.forEach(w=>{
            w.selected = "border-bottom rounded border-5 border-white"
        })
        let elementClass = "border-bottom rounded border-5 border-primary"
        workshops[i].selected = elementClass
        nameWorkshop = workshops[i].name
        typeWorkshop = workshops[i].type
        idWorkshop = workshops[i].id
        setTimeout(()=>{
            location.href = "#grupos"
        },100)

        getGroups(workshops[i].id)

    }

    const getGroups = (idWorkshop)=>{
        let user = JSON.parse(localStorage.getItem('user')!=null?localStorage.getItem('user'):"{}")
        let data = {
            id_user: user['idUser'],
            id_workshop: idWorkshop
        }
        if(data.id_user){
            axiosapi.doPost(`/instructor/get/groups`,data).then(res=>{
                groups = res.data
            }).catch(err=>{
                swal.err()
            })
        }
    }

    const getProfile = ()=>{
        let user = JSON.parse(localStorage.getItem('user'))

        if(user && user['idUser']){
            axiosapi.doGet(`/instructor/profile/${user['idUser']}`).then(res=>{
                instructor = res.data['instructor']
                emailU = res.data['instructor'].email
                personalEmailU = res.data['instructor'].personal_email
                phoneU = res.data['instructor'].phone
                cellphoneU = res.data['instructor'].cellphone
                workshops = res.data['workshops']
            }).catch(err=>{
                swal.err()
            })
        }else{
            swal.err()
        }
    }

    const updateProfile = ()=>{
        let user = JSON.parse(localStorage.getItem('user')!=null?localStorage.getItem('user'):"{}")
        let data = {
            id_user: user['idUser'],
            name: elementName.value,
            first_last_name: elementLastname.value,
            second_last_name: elementSecondLastname.value,
            email: elementEmail.value,
            personal_email: elementPersonalEmail.value,
            phone: elementPhone.value,
            cellphone: elementCellphone.value
        }

        if(data.id_user){
            axiosapi.doPut(`/instructor/profile/update`,data).then(res=>{
                swal.con('success',TITUPDATED,TXTUPDATED)
                getProfile()
            }).catch(err=>{
                swal.err()
            })
        }
        
    }

    const updatePass = ()=>{
        let user = JSON.parse(localStorage.getItem('user')!=null?localStorage.getItem('user'):"{}")
        let data = {
            id_user: user['idUser'],
            currentPassword: elementCurrentPassword.value,
            newPassword: elementNewPassword.value
        }
        if(data.id_user){
            axiosapi.doPut(`/user/password/update`,data).then(res=>{
                swal.con('success',TITUPDATED,TXTUPDATED)
            }).catch(err=>{
                swal.err()
            })
        }
    }

    const dateToday = () => {
      var f = new Date();

      var anio = f.getFullYear();
      var _mes = f.getMonth();
      var _dia = f.getDate();
      _mes = _mes + 1;
      var mes = "";
      var dia = "";
      if (_mes < 10) {
        mes = "0" + _mes;
      } else {
        mes = _mes.toString();
      }
      if (_dia < 10) {
        dia = "0" + _dia;
      } else {
        dia = _dia;
      }

      var fecha = anio + "-" + mes + "-" + dia;
      console.log(fecha);
      today = fecha;
      dateTomorrow(fecha)
    }

    const dateTomorrow = (date) => {
        const hoy = new Date(date)
        const mañana = new Date(hoy)
        mañana.setDate(mañana.getDate() + 2)

        var anio = mañana.getFullYear();
        var _mes = mañana.getMonth();
        var _dia = mañana.getDate();
        _mes = _mes + 1;
        var mes = "";
        var dia = "";
        if (_mes < 10) {
            mes = "0" + _mes;
        } else {
            mes = _mes.toString();
        }
        if (_dia < 10) {
            dia = "0" + _dia;
        } else {
            dia = _dia;
        }

        var fecha = anio + "-" + mes + "-" + dia;
        tomorrow = fecha
        console.log(fecha);
    }

    onMount(()=>{
        listenerValidity()
        getProfile()
        dateToday()
    })

</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <h1><i class="fa fa-list"></i> Panel</h1>
        <hr>
        <div class="row">
            <div class="container main-card rounded border px-4 py-4 mb-4">
                <h2><i class="fa fa-user-tie"></i> Datos Personales</h2>
                <hr>
                <div class="row g-3 align-items-center">
                    <div class="col-lg-4">
                        <div class="text-center">
                            <img class="my-2 mx-auto d-block" src="{srcIcon}" width="150rem" alt="profile icon">
                            <div class="fw-bold">{instructor.name} {instructor.first_last_name}</div>
                            <div class="text-muted">{instructor.email}</div>
                            <div class="pt-2">
                                {#if !isEdit}
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <button on:click="{()=>{clearProfile()}}" class="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
                                                <i class="fa fa-edit"></i> Editar perfil
                                            </button>
                                        </div>
                                        <div class="col-12">
                                            <button on:click="{()=>{clearPassword()}}" class="btn btn-outline-secondary" data-bs-toggle="collapse" data-bs-target=".ck-2" aria-expanded="false" aria-controls="collap1 collap3">
                                                <i class="fa fa-key"></i> Cambiar contraseña
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
                                    <div>{instructor.name}</div>
                                </div>
                                <div class="col-md-6 col-lg-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-user"></i> Primer apellido
                                    </div>
                                    <div>{instructor.first_last_name}</div>
                                </div>
                                <div class="col-md-12 col-lg-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-user"></i> Segundo apellido
                                    </div>
                                    <div>{instructor.second_last_name}</div>
                                </div>
                            </div>
                            <hr>
                            <div class="row text-sm-center text-md-start g-3 mb-3">
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-envelope"></i> Correo electrónico institucional
                                    </div>
                                    <div>{instructor.email}</div>
                                </div>
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-envelope"></i> Correo electrónico personal
                                    </div>
                                    <div>{instructor.personal_email}</div>
                                </div>
                            </div>
                            <hr>
                            <div class="row text-sm-center text-md-start g-3 mb-3">
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-phone"></i> Teléfono fijo
                                    </div>
                                    <div>{instructor.phone}</div>
                                </div>
                                <div class="col-md-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-phone"></i> Teléfono celular
                                    </div>
                                    <div>{instructor.cellphone}</div>
                                </div>
                                <hr>
                            </div>
                        </div>
                        <div id="collap2" class="collapse multi-collapse ck-1">
                            <form on:submit="{(e)=>{e.preventDefault();checkProfileValidity()}}">
                                <div class="container">
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <label for="name" class="form-label">
                                                <i class="fa fa-user"></i> Nombre
                                            </label>
                                            <input bind:this="{elementName}" autocomplete="off" class="form-control" type="text" id="name" placeholder="Nombre">
                                            {#each fbName as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="lastname" class="form-label">
                                                <i class="fa fa-user"></i> Primer apellido
                                            </label>
                                            <input bind:this="{elementLastname}" autocomplete="off" class="form-control" type="text" id="lastname" placeholder="Primer apellido">
                                            {#each fbLastname as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="second_lastname" class="form-label">
                                                <i class="fa fa-user"></i> Segundo apellido
                                            </label>
                                            <input bind:this="{elementSecondLastname}" autocomplete="off" class="form-control" type="text" id="second_lastname" placeholder="Segundo apellido">
                                            {#each fbSecondLastname as item}
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
                                            <input bind:this="{elementEmail}" autocomplete="off" class="form-control" type="text" id="email" placeholder="Correo electrónico institucional">
                                            {#each fbEmail as item}
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
                                            <input bind:this="{elementPersonalEmail}" autocomplete="off" class="form-control" type="text" id="personal_email" placeholder="Correo electrónico personal">
                                            {#each fbPersonalEmail as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifyEmailExistence}
                                                <div class="invalid-feedback">
                                                    Correo electrónico en uso.
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <label for="phone" class="form-label">
                                                <i class="fa fa-phone"></i> Teléfono fijo
                                            </label>
                                            <input bind:this="{elementPhone}" autocomplete="off" class="form-control" type="text" id="phone" placeholder="Teléfono fijo">
                                            {#each fbPhone as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifyPhoneExistence}
                                                <div class="invalid-feedback">
                                                    Teléfono fijo en uso.
                                                </div>
                                            {/if}
                                        </div>
                                        <div class="col-md-6">
                                            <label for="cellphone" class="form-label">
                                                <i class="fa fa-phone"></i> Teléfono celular
                                            </label>
                                            <input bind:this="{elementCellphone}" autocomplete="off" class="form-control" type="text" id="cellphone" placeholder="Teléfono celular">
                                            {#each fbCellphone as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                            {#if !verifyCellphoneExistence}
                                                <div class="invalid-feedback">
                                                    Teléfono celular en uso.
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <button bind:this="{btnclearprofile}" type="button" on:click="{()=>{clearProfile()}}" class="btn btn-secondary w-100" data-bs-toggle="collapse" data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
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
                        <div id="collap3" class="collapse multi-collapse ck-2">
                            <form on:submit="{(e)=>{e.preventDefault();checkPasswordValidity()}}">
                                <div class="container">
                                    <div class="row g-3 mb-3">
                                        <div class="col-12">
                                            <label for="current_password" class="form-label">
                                                <i class="fa fa-key"></i> Contraseña actual
                                            </label>
                                            <input bind:this="{elementCurrentPassword}" autocomplete="off" class="form-control" type="password" id="current_password" placeholder="Contraseña actual">
                                            {#each fbCurrentPassword as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-12">
                                            <label for="new_password" class="form-label">
                                                <i class="fa fa-key"></i> Nueva contraseña
                                            </label>
                                            <input bind:this="{elementNewPassword}" autocomplete="off" class="form-control" type="password" id="new_password" placeholder="Nueva contraseña">
                                            {#each fbNewPassword as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-12">
                                            <label for="confirm_new_password" class="form-label">
                                                <i class="fa fa-key"></i> Repetir nueva contraseña
                                            </label>
                                            <input bind:this="{elementConfirmNewPassword}" autocomplete="off" class="form-control" type="password" id="confirm_new_password" placeholder="Repetir nueva contraseña">
                                            {#each fbConfirmNewPassword as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="row g-3 mb-3">
                                        <div class="col-md-6">
                                            <button bind:this="{btnclearpassword}" type="button" on:click="{()=>{clearPassword()}}" class="btn btn-secondary w-100" data-bs-toggle="collapse" data-bs-target=".ck-2" aria-expanded="false" aria-controls="collap1 collap3">
                                                <i class="fa fa-times"></i> Cancelar
                                            </button>
                                        </div>
                                        <div class="col-md-6">
                                            <button  type="submit" class="btn btn-primary w-100">
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
                <h2><i class="fa fa-chalkboard"></i> Talleres</h2>
                <hr>
                <div class="row g-3">
                    {#if workshops.length === 0}
                        <NotRecords/>
                    {:else}
                        {#each workshops as item,i}
                            <div class="col-md-6 col-lg-4 g-3 mb-3">
								<div on:click="{()=>{changeWorkshop(i)}}" class="card h-100">
									<img  src="{item.image_url}" alt="Taller" class="card-img-top">
									<div class="card-body {item.selected}">
										<h5 class="card-title text-uppercase">{item.name}</h5>
										<h6 class="card-subtitle mb-2 text-muted">{item.type}</h6>
									</div>
								</div>
							</div>                           
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
        <div class="row {dGroup}">
            <div class="container main-card rounded border px-4 py-4 mb-4">
                <div class="row g-2">
                    <div id="grupos" class="col-sm-10 text-center text-sm-start">
                        <h2><i class="fa fa-users"></i> Grupos - {nameWorkshop} <span class="h4 text-muted">| {typeWorkshop}</span></h2>
                    </div>
                    <div class="col-sm-2 text-center">
                        <button class="btn btn-outline-success rounded-pill float-sm-end" data-bs-toggle="modal" data-bs-target="#mo1">
                            <i class="fa fa-plus-circle"></i> Nuevo
                        </button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    {#if groups.length === 0}
                        <NotRecords/>
                    {:else}
                        {#each groups as item,i}
                            <div class="col-md-6 col-lg-4 g-3 mb-3">
                                <div class="card h-100" on:click="{()=>{goto(`/instructor/group/${item.id}`)}}">
                                    <div class="card-body border-start rounded border-5 border-primary">
                                        <h5 class="card-title text-uppercase border-2 border-bottom border-primary pb-2">
                                            Grupo: {item.name}
                                        </h5>
                                        <div class="mb-2 text-muted">
                                            Horario: {item.schedule}
                                        </div>
                                        <div class="mb-3 text-muted">
                                            Tamaño: {item.minimum} - {item.maximum}
                                        </div>
                                        <div style="position:absolute;bottom:0;right:0;width: 2rem;height: 2rem;" class="mb-2 me-2 text-center text-white pt-1 bg-primary rounded-circle shadow">
                                            {i+1}
                                        </div>
                                    </div>
                                </div>
                            </div>                           
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    </div>


	<!-- Modal Create -->
	<div class="modal fade" id="mo1" tabindex="-1" aria-labelledby="mol1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();checkGroupValidation();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol1">
							<i class="fas fa-plus-circle" /> Nuevo Grupo - {nameWorkshop}
						</h5>
						<button type="button" on:click="{()=>{clearGroup()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						<div class="row g-3">
							<div class="col-12">
								<label for="gname" class="form-label">
									<i class="fas fa-heading"></i> Nombre
								</label>
								<input
									bind:this="{elementGName}"
									id="gname"
									type="text"
									class="form-control"
									autocomplete="off"
									placeholder="Nombre"
								/>
								{#each fbGName as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6">
								<label for="gmin" class="form-label">
									<i class="fas fa-users"></i> Mínimo de integrantes
								</label>
								<input
									bind:this="{elementGMin}"
									id="gmin"
									type="number"
									class="form-control"
									autocomplete="off"
									placeholder="Mínimo de integrantes"
								/>
								{#each fbGMin as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6">
								<label for="gmax" class="form-label">
									<i class="fas fa-users"></i> Máximo de integrantes
								</label>
								<input
									bind:this="{elementGMax}"
									id="gmax"
									type="number"
									class="form-control"
									autocomplete="off"
									placeholder="Máximo de integrantes"
								/>
								{#each fbGMax as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-12">
								<label for="gschedule" class="form-label">
									<i class="fas fa-calendar-alt"></i> Horario
								</label>
								<input
									bind:this="{elementGSchedule}"
									id="gschedule"
									type="text"
									class="form-control"
									autocomplete="off"
                                    placeholder="Horario"
								/>
								{#each fbGSchedule as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-12">
								<label for="gclosedate" class="form-label">
									<i class="fas fa-calendar-alt"></i> Fecha límite de inscripción
								</label>
								<input
									bind:this="{elementGCloseDate}"
									id="gclosedate"
									type="date"
									class="form-control"
                                    min="{today}"
									autocomplete="off"
								/>
								{#each fbGCloseDate as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6">
								<label for="gstartdate" class="form-label">
									<i class="fas fa-calendar-alt"></i> Fecha de inicio
								</label>
								<input
									bind:this="{elementGStartDate}"
									id="gstartdate"
									type="date"
                                    min="{tomorrow}"
									class="form-control"
                                    disabled
									autocomplete="off"
								/>
								{#each fbGStartDate as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6">
								<label for="gfinaldate" class="form-label">
									<i class="fas fa-calendar-alt"></i> Fecha de fin
								</label>
								<input
									bind:this="{elementGFinalDate}"
									id="gfinaldate"
									type="date"
                                    min="{tomorrow}"
                                    disabled
									class="form-control"
									autocomplete="off"
								/>
								{#each fbGFinalDate as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button bind:this="{closemodalcreate}" on:click="{()=>{clearGroup()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
						<button type="submit" class="btn btn-primary">
							<i class="fa fa-save"></i> Guardar
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>