<script>
	import { onMount } from 'svelte'
	import Notrecords from './../../../components/notrecords.svelte'
	import axiosapi from './../../../utils/axiosapi'
    import swal from './../../../utils/sweetalert2'

	const TITQDELETE = "¿Está seguro que desea eliminar este registro?"
	const TITDELETED = "Eliminado"
	const TXTDELETED = "El registro se ha eliminado exitosamente."
	const TITCREATED = "Creado"
	const TXTCREATED = "El registro se ha creado exitosamente."
	const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."

    let instructors = {
		search: "",
		page: 1,
		totalRecords: 0,
		totalPages: 0,
		limit: 0,
		offset: 0,
		rows: []
	};
	let searched = false
	let wordSearched = ""
	let searching = false
	let newinstructor = {
		name: "",
		first_last_name: "",
        second_last_name: "",
        email: "",
        personal_email: "",
        phone: "",
        cellphone: "",
        password: ""
	};
	let oldinstructor = {
		id:0,
		name:"",
		acronym:""
	};
	let closemodalcreate
	let closemodalupdate

	const getInstructors = ()=>{
		axiosapi.doGet("/instructor/get").then(res=>{
			instructors = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getInstructorsBySearch = ()=>{
		searching = true
		let endpoint = `/instructor/get`
		if(instructors.search != undefined && instructors.search != ""){
			endpoint = `/instructor/get?search=${instructors.search}`
			searched = true
			wordSearched = instructors.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getInstructorsByPage = (page)=>{
		let endpoint = `/instructor/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getInstructorsByNextPage = ()=>{
		getInstructorsByPage(instructors.page+1)
	}

	const getInstructorsByPreviousPage = ()=>{
		getInstructorsByPage(instructors.page-1)
	}

	const getInstructor =  (id)=>{
		axiosapi.doGet("/instructor/get/"+id).then(res=>{		
			oldinstructor = res.data;
			emailU = res.data.email
			personalEmailU = res.data.personal_email
			phoneU = res.data.phone
			cellphoneU = res.data.cellphone
		}).catch((err)=>{
			swal.err()
		})
	}

	const updateInstructor = ()=>{
		console.log(oldinstructor);
		axiosapi.doPut("/instructor/profile/update",oldinstructor).then(res=>{		
			swal.con('success',TITUPDATED,TXTUPDATED)
			getInstructors()
		}).catch(()=>{
			swal.err()
		})
	}

	const createInstructor = ()=>{
		let pass = generatePassword()

		let obj = {
			email : newinstructor.email,
			password: pass
		}
		newinstructor.password = pass
		axiosapi.doPost("/instructor/create",newinstructor).then(()=>{
			axiosapi.doPost('/instructor/sendEmail/credentials', obj).then(() => {
				swal.con('success',TITCREATED,TXTCREATED)
				getInstructors()
			}).catch((error) => {
				console.log(error);
				swal.err()
			})
		}).catch((error)=>{
			console.log(error);
			swal.err()
		})
	}
	
    const deleteInstructor = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
			if(result.isConfirmed){
				axiosapi.doDelete("/user/delete/"+id).then((res)=>{
					getInstructors()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
			}
		})
    }

	const generatePassword = () => {
		var chars = [
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			"abcdefghijklmnopqrstuvwxyz",
			"0123456789",
			"!@#$%^&*()_+|}{[]\:;?><,./-=",
		];
		var randPwd = [2, 2, 3, 1]
			.map(function(len, i) {
			return Array(len)
				.fill(chars[i])
				.map(function(x) {
				return x[Math.floor(Math.random() * x.length)];
				})
				.join("");
			})
			.concat()
			.join("")
			.split("")
			.sort(function() {
			return 0.5 - Math.random();
			})
			.join("");
		
		return randPwd
	}

	const checkCreateValidation = async()=>{
		let ok = true
		let respPerEmail = await validPersonalEmail(elementPersonalEmail).then((res) =>{
			return res
		})
		let respEmail = await validEmail(elementEmail).then((res) =>{
			return res
		})
		let respPhone = await validPhone(elementPhone).then((res) =>{
			return res
		})
		let respCellphone = await validCellphone(elementCellphone).then((res) =>{
			return res
		})

		ok = validName(elementName) && ok
		ok = validLastname(elementLastName) && ok
		ok = validSecondLastname(elementSecondLastName) && ok
		ok = respEmail && ok
		ok = respPerEmail && ok
		ok = respPhone && ok
		ok = respCellphone && ok
		if(ok){
			createInstructor()
			closemodalcreate.click()	
		}
	}

	const checkUpdateValidation = async()=>{
		let ok = true
		let respPerEmail = await validPersonalEmailU(elementPersonalEmailU).then((res) =>{
			return res
		})
		let respEmail = await validEmailU(elementEmailU).then((res) =>{
			return res
		})
		let respPhone = await validPhoneU(elementPhoneU).then((res) =>{
			return res
		})
		let respCellphone = await validCellphoneU(elementCellphoneU).then((res) =>{
			return res
		})

		ok = validNameU(elementNameU) && ok
		ok = validLastnameU(elementLastNameU) && ok
		ok = validSecondLastnameU(elementSecondLastNameU) && ok
		ok = respEmail && ok
		ok = respPerEmail && ok
		ok = respPhone && ok
		ok = respCellphone && ok
		if(ok){
			updateInstructor()
			btnBack.click()	
		}
	}

	const clear = ()=>{
		let elementClass = "form-control"

		elementName.value = ""
		newinstructor.name = ""
		elementName.className = `${elementClass}`
		fbName = []

		elementLastName.value = ""
		newinstructor.first_last_name = ""
		elementLastName.className = `${elementClass}`
		fbLastName = []

		elementSecondLastName.value = ""
		newinstructor.second_last_name = ""
		elementSecondLastName.className = `${elementClass}`
		fbSecondLastName = []

		elementEmail.value = ""
		newinstructor.email = ""
		elementEmail.className = `${elementClass}`
		fbEmail = []

		elementPersonalEmail.value = ""
		newinstructor.personal_email = ""
		elementPersonalEmail.className = `${elementClass}`
		fbPersonalEmail = []

		elementPhone.value = ""
		newinstructor.phone = ""
		elementPhone.className = `${elementClass}`
		fbPhone = []

		elementCellphone.value = ""
		newinstructor.cellphone = ""
		elementCellphone.className = `${elementClass}`
		fbCellphone = []

		// --------------------------------------------

		// elementEmailU.value = ''
		// elementEmailU.className = elementClass
		// fbEmailU = []

		// elementNameU.value = ''
		// elementNameU.className = "form-control"
		// fbNameU = []

		// elementName.value = ''
		// elementName.className = elementClass
		// fbName = []

		// elementLastNameU.value = ''
		// elementLastNameU.className = elementClass
		// fbLastNameU = []

		// elementSecondLastNameU.value = ''
		// elementSecondLastNameU.className = elementClass
		// fbSecondLastNameU = []

		// elementPersonalEmailU.value = ''
		// elementPersonalEmailU.className = elementClass
		// fbPersonalEmailU = []

		// elementPhoneU.value = ''
		// elementPhoneU.className = elementClass
		// fbPhoneU = []

		// elementCellphoneU
		// elementCellphoneU.className = elementClass
		// fbCellphoneU = []

		// verifyEmailExistenceU = true
		// verifyEmailUserExistenceU = true
		// verifyCellphoneExistenceU = true
		// verifyPhoneExistenceU = true

		// emailU = ''
		// personalEmailU = ''
		// phoneU = ''
		// cellphoneU = ''

		// getInstructors()


	}

	let elementEmail
	let fbEmail = []
	let elementName
	let fbName = []
	let elementLastName
	let fbLastName = []
	let elementSecondLastName
	let fbSecondLastName = []
	let elementPersonalEmail
	let fbPersonalEmail = []
	let elementPhone
	let fbPhone = []
	let elementCellphone
	let fbCellphone = []

	let verifyEmailExistence = true
	let verifyEmailUserExistence = true
	let verifyCellphoneExistence = true
	let verifyPhoneExistence = true

	let elementEmailU
	let fbEmailU = []
	let elementNameU
	let fbNameU = []
	let elementLastNameU
	let fbLastNameU = []
	let elementSecondLastNameU
	let fbSecondLastNameU = []
	let elementPersonalEmailU
	let fbPersonalEmailU = []
	let elementPhoneU
	let fbPhoneU = []
	let elementCellphoneU
	let fbCellphoneU = []

	let verifyEmailExistenceU = true
	let verifyEmailUserExistenceU = true
	let verifyCellphoneExistenceU = true
	let verifyPhoneExistenceU = true

	let emailU = ''
	let personalEmailU = ''
	let phoneU = ''
	let cellphoneU = ''
	let btnBack

	const clearU = ()=>{
		let classElement = "form-control"

		elementEmailU.value = ''
		elementEmailU.className = classElement
		fbEmailU = []

		elementNameU.value = ''
		elementNameU.className = classElement
		fbNameU = []

		elementName.value = ''
		elementName.className = classElement
		fbName = []

		elementLastNameU.value = ''
		elementLastNameU.className = classElement
		fbLastNameU = []

		elementSecondLastNameU.value = ''
		elementSecondLastNameU.className = classElement
		fbSecondLastNameU = []

		elementPersonalEmailU.value = ''
		elementPersonalEmailU.className = classElement
		fbPersonalEmailU = []

		elementPhoneU.value = ''
		elementPhoneU.className = classElement
		fbPhoneU = []

		elementCellphoneU
		elementCellphoneU.className = classElement
		fbCellphoneU = []

		verifyEmailExistenceU = true
		verifyEmailUserExistenceU = true
		verifyCellphoneExistenceU = true
		verifyPhoneExistenceU = true

		emailU = ''
		personalEmailU = ''
		phoneU = ''
		cellphoneU = ''

		getInstructors()
		getInstructor(oldinstructor.id)
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
		fbLastName = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastName.push("El primer apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastName.push("El primer apellido contener de 3 a 45 caracteres.")
		}

		return validated
	}

	const validSecondLastname = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbSecondLastName = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastName.push("El segundo apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastName.push("El segundo apellido debe contener de 3 a 45 caracteres.")
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

		return validated
	}

	// VALIDACIONES UPDATE

	const validNameU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNameU = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre debe contener de 3 a 45 caracteres.")
		}
		
		return validated
	}

	const validLastnameU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbLastNameU = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastNameU.push("El primer apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLastNameU.push("El primer apellido contener de 3 a 45 caracteres.")
		}

		return validated
	}

	const validSecondLastnameU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbSecondLastNameU = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastNameU.push("El segundo apellido no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSecondLastNameU.push("El segundo apellido debe contener de 3 a 45 caracteres.")
		}

		return validated
	}

	const validEmailU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbEmailU = []
		verifyEmailUserExistenceU = true
		target.className = `${elementClass} is-valid`

		// Formato de correo válido
		let emailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		if(!emailformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmailU.push("El correo electrónico debe cumplir con un formato válido.")
		}
		if(v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmailU.push("El correo electrónico es demasiado largo.")
		}
		if(v.split('@')[1] != 'utez.edu.mx'){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbEmailU.push("El correo electrónico debe pertenecer al dominio @utez.edu.mx.")
		}

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
					verifyEmailUserExistenceU = false
				}
			}else{
				validated = false
			}
		}
		

		return validated
	}

	const validPersonalEmailU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbPersonalEmailU = []
		verifyEmailExistenceU = true
		target.className = `${elementClass} is-valid`

		// Formato de correo válido
		let emailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
		if(!emailformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPersonalEmailU.push("El correo electrónico debe cumplir con un formato válido.")
		}
		if(v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPersonalEmailU.push("El correo electrónico es demasiado largo.")
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
					verifyEmailExistenceU = false
				}
			}else{
				validated = false
			}
		}

		return validated
	}

	const validPhoneU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbPhoneU = []
		verifyPhoneExistenceU = true
		target.className = `${elementClass} is-valid`

		// Formato de teléfono válido
		let phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
		if(!phoneformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPhoneU.push("El número telefónico debe cumplir con el formato (ej. 777-111-2233).")
		}
		if(v.length > 20){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbPhoneU.push("El número telefónico es demasiado largo.")
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
					verifyPhoneExistenceU = false
				}
			}else{
				validated = false
			}
		}


		return validated
	}

	const validCellphoneU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbCellphoneU = []
		verifyCellphoneExistenceU = true
		target.className = `${elementClass} is-valid`

		// Formato de teléfono válido
		let phoneformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
		if(!phoneformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbCellphoneU.push("El número telefónico debe cumplir con el formato (ej. 777-111-2233).")
		}
		if(v.length > 20){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbCellphoneU.push("El número telefónico es demasiado largo (más de 20 caracteres).")
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
					verifyCellphoneExistenceU = false
				}
			}else{
				validated = false
			}
		}
		return validated
	}

	const listenerValidity = ()=>{
		elementName.addEventListener('input',(e)=>{validName(e.target)})
		elementLastName.addEventListener('input',(e)=>{validLastname(e.target)})
		elementSecondLastName.addEventListener('input',(e)=>{validSecondLastname(e.target)})
		elementEmail.addEventListener('input',(e)=>{validEmail(e.target)})
		elementPersonalEmail.addEventListener('input',async(e)=>{validPersonalEmail(e.target)})
		elementPhone.addEventListener('input',async(e)=>{validPhone(e.target)})
		elementCellphone.addEventListener('input',async(e)=>{validCellphone(e.target)})

		elementNameU.addEventListener('input',(e)=>{validNameU(e.target)})
		elementLastNameU.addEventListener('input',(e)=>{validLastnameU(e.target)})
		elementSecondLastNameU.addEventListener('input',(e)=>{validSecondLastnameU(e.target)})
		elementEmailU.addEventListener('input',(e)=>{validEmailU(e.target)})
		elementPersonalEmailU.addEventListener('input',async(e)=>{validPersonalEmailU(e.target)})
		elementPhoneU.addEventListener('input',async(e)=>{validPhoneU(e.target)})
		elementCellphoneU.addEventListener('input',async(e)=>{validCellphoneU(e.target)})
	}

	onMount(()=>{
		getInstructors()
		listenerValidity()
	})
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-user-tie"></i> Instructores</h3>
			</div>
			<div class="col">
				<button
					class="btn btn-outline-success float-end rounded-pill align-middle"
					data-bs-toggle="modal"
					data-bs-target="#mo1"
				>
					<i class="fas fa-plus-circle" />
					<span>Nuevo</span>
				</button>
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
									<button on:click="{()=>getInstructors()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getInstructorsBySearch()}}}" bind:value="{instructors.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button on:click="{()=>getInstructorsBySearch()}" class="btn btn-outline-primary" type="submit" id="button-search">
									{#if searching}
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										<span class="visually-hidden">Loading...</span>
									{:else}
										<i class="fas fa-search"></i>
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>
				
				{#if instructors.rows.length == 0}
					<Notrecords />
				{:else}
				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<caption>
							Mostrando {instructors.offset+1} - {
								instructors.offset+instructors.limit>instructors.totalRecords?instructors.totalRecords:instructors.offset+instructors.limit
								} de {instructors.totalRecords} registros totales.
						</caption>
						<thead>
							<tr class="text-center">
								<th>No.</th>
								<th>Nombre</th>
								<th>Primer Apellido</th>
								<th>Segundo Apellido</th>
                                <th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each instructors.rows as ins,i}
							<tr class="text-center">
								<td>{i+1}</td>
								<td>{ins.name}</td>
								<td>{ins.first_last_name}</td>
                                <td>{ins.second_last_name}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click="{()=>getInstructor(ins.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-eye"></i>
										</button>
										<button on:click="{()=>deleteInstructor(ins.id_user)}" type="button" class="btn btn-outline-danger">
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
						{#if instructors.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getInstructorsByPreviousPage()}" class="page-link" href="">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: instructors.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if instructors.page == item}
							<!-- svelte-ignore a11y-invalid-attribute -->
								<li class="page-item active" aria-current="page">
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
							<!-- svelte-ignore a11y-invalid-attribute -->
								<li class="page-item" aria-current="page">
									<a class="page-link" 
									on:click="{()=>getInstructorsByPage(item)}" 
									href=""
									>{item}</a>
								</li>	
							{/if}
						{/each}
						{#if instructors.page === instructors.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getInstructorsByNextPage()}" class="page-link" href="">Siguiente</a>
							</li>
						{/if}
					</ul>
				</nav>
				{/if}

			</div>
		</div>
	</div>

	<!-- Modal Create -->
	<div class="modal fade" id="mo1" tabindex="-1" aria-labelledby="mol1" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<form on:submit="{(e)=>{e.preventDefault();checkCreateValidation();}}">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol1">
						<i class="fas fa-plus-circle" /> Nuevo Instructor
					</h5>
					<button type="button" on:click="{()=>{clear()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="row g-4 mb-5">
						<div class="col-lg-6">
							<label for="name" class="form-label">
								<i class="fas fa-user"></i> Nombre
							</label>
							<input
								bind:this="{elementName}"
								bind:value="{newinstructor.name}"
								id="name"
								placeholder="Ingresa tu nombre"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
							{#each fbName as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
						<div class="col-lg-6">
							<label for="firstlastname" class="form-label">
								<i class="fas fa-user"></i> Primer apellido
							</label>
							<input
								bind:this="{elementLastName}"
								bind:value="{newinstructor.first_last_name}"
								id="firstlastname"
								placeholder="Ingresa tu primer apellido"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
							{#each fbLastName as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
						<div class="col-lg-6">
							<label for="secondlastname" class="form-label">
								<i class="fas fa-user"></i> Segundo apellido
							</label>
							<input
								bind:this="{elementSecondLastName}"
								bind:value="{newinstructor.second_last_name}"
								id="secondlastname"
								placeholder="Ingresa tu segundo apellido"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
							{#each fbSecondLastName as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
					</div>
					<hr>					
					<div class="row g-4 mb-4">
						<div class="col-lg-6">
							<label for="email" class="form-label">
								<i class="fas fa-envelope"></i> Correo electrónico institucional
							</label>
							<input
								bind:this={elementEmail}
								bind:value="{newinstructor.email}"
								id="email"
								placeholder="Ingresa tu correo electrónico institucional"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
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
						<div class="col-lg-6">
							<label for="personalemail" class="form-label">
								<i class="fas fa-envelope"></i> Correo electrónico personal
							</label>
							<input
								bind:this={elementPersonalEmail}
								bind:value="{newinstructor.personal_email}"
								id="personalemail"
								placeholder=" Ingresa tu correo electrónico personal"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
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
					<div class="row g-4 mb-5">
						<div class="col-lg-6">
							<label for="phone" class="form-label">
								<i class="fas fa-phone"></i> Teléfono fijo
							</label>
							<input
								bind:this="{elementPhone}"
								bind:value="{newinstructor.phone}"
								id="phone"
								placeholder="Ingresa tu teléfono fijo"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
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
						<div class="col-lg-6">
							<label for="cellphone" class="form-label">
								<i class="fas fa-phone"></i> Teléfono móvil
							</label>
							<input
								bind:this="{elementCellphone}"
								bind:value="{newinstructor.cellphone}"
								id="cellphone"
								placeholder="Ingresa tu teléfono móvil"
								type="text"
								class="form-control"
								autocomplete="off"
							/>
							{#each fbCellphone as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
							{#if !verifyCellphoneExistence}
								<div class="invalid-feedback">
									Teléfono móvil en uso.
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button bind:this="{closemodalcreate}" on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
					<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>				
				</div>
			</div>
			</form>
		</div>
	</div>


	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol">
						<i class="fas fa-edit" /> Instructor
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="col-lg-12 ms-2">
						<div id="collap1" class="collapse show multi-collapse ck-1 ck-2">
								<div class="row text-sm-left text-md-start g-3 mb-3">
									<div class="col-md-6 col-lg-4">
										<div class="fw-bold">
											<i class="fa fa-user"></i> Nombre
										</div>
										<div>{oldinstructor.name}</div>
									</div>
									<div class="col-md-6 col-lg-4">
										<div class="fw-bold">
											<i class="fa fa-user"></i> Primer apellido
										</div>
										<div>{oldinstructor.first_last_name}</div>
									</div>
									<div class="col-md-12 col-lg-4">
										<div class="fw-bold">
											<i class="fa fa-user"></i> Segundo apellido
										</div>
										<div>{oldinstructor.second_last_name}</div>
									</div>
								</div>
								<hr>
								<div class="row text-sm-left text-md-start g-3 mb-3">
									<div class="col-md-6">
										<div class="fw-bold">
											<i class="fa fa-envelope"></i> Correo electrónico institucional
										</div>
										<div>{oldinstructor.email}</div>
									</div>
									<div class="col-md-6">
										<div class="fw-bold">
											<i class="fa fa-envelope"></i> Correo electrónico personal
										</div>
										<div>{oldinstructor.personal_email}</div>
									</div>
								</div>
								<hr>
								<div class="row text-sm-left text-md-start g-3 mb-3">
									<div class="col-md-6">
										<div class="fw-bold">
											<i class="fa fa-phone"></i> Teléfono fijo
										</div>
										<div>7771234567</div>
									</div>
									<div class="col-md-6">
										<div class="fw-bold">
											<i class="fa fa-phone"></i> Teléfono celular
										</div>
										<div>7771364829</div>
									</div>
								</div>
							
							<div class="modal-footer mb-0 pb-0 pe-0">
								<button type="button" class="btn btn-secondary" bind:this="{closemodalupdate}"  data-bs-dismiss="modal"
									><i class="fas fa-times" /> Cerrar</button
								>
								<button type="submit" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target=".ck-1" aria-expanded="false" aria-controls="collap1 collap2">
									<i class="fas fa-edit" /> Editar</button>
							</div>
						</div>
						<div id="collap2" class="collapse multi-collapse ck-1">
							<form on:submit="{(e) => {e.preventDefault();checkUpdateValidation()}}">
								<div class="container">
									
									<div class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3">
										<div class="col-md-4">
											<label for="nameU" class="form-label">
												<i class="fas fa-user" /> Nombre
											</label>
											<input
												bind:value="{oldinstructor.name}"
												bind:this="{elementNameU}"
												id="nameU"
												placeholder="Ingresa tu nombre"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbNameU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
										</div>
										<div class="col-md-4">
											<label for="firstlastnameU" class="form-label">
												<i class="fas fa-user" /> Primer apellido
											</label>
											<input
												bind:value="{oldinstructor.first_last_name}"
												bind:this="{elementLastNameU}"
												id="firstlastnameU"
												placeholder="Ingresa tu primer apellido"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbLastNameU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
										</div>
										<div class="col-md-4">
											<label for="secondlastnameU" class="form-label">
												<i class="fas fa-user" /> Segundo apellido
											</label>
											<input
												bind:value="{oldinstructor.second_last_name}"
												bind:this="{elementSecondLastNameU}"
												id="secondlastnameU"
												placeholder="Ingresa tu segundo apellido"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbSecondLastNameU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
										</div>
									</div>
									<div class="row g-3 mb-3">
										<div class="col-md-6">
											<label for="emailU" class="form-label">
												<i class="fas fa-envelope" /> Correo electrónico institucional
											</label>
											<input
												bind:value="{oldinstructor.email}"
												bind:this="{elementEmailU}"
												id="emailU"
												placeholder="Ingresa tu correo electrónico institucional"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbEmailU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
											{#if !verifyEmailUserExistenceU}
											<div class="invalid-feedback">
												Correo electrónico en uso.
											</div>
											{/if}
										</div>
										<div class="col-md-6">
											<label for="personalemailU" class="form-label">
												<i class="fas fa-envelope" /> Correo electrónico personal
											</label>
											<input
												bind:value="{oldinstructor.personal_email}"
												bind:this="{elementPersonalEmailU}"
												id="personalemailU"
												placeholder=" Ingresa tu correo electrónico personal"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbPersonalEmailU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
											{#if !verifyEmailExistenceU}
											<div class="invalid-feedback">
												Correo electrónico en uso.
											</div>
											{/if}
										</div>
									</div>
									<div class="row g-3 mb-3">
										<div class="col-md-6">
											<label for="phoneU" class="form-label">
												<i class="fas fa-phone" /> Teléfono fijo
											</label>
											<input
												bind:value="{oldinstructor.phone}"
												bind:this="{elementPhoneU}"
												id="phoneU"
												placeholder="Ingresa tu teléfono fijo"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbPhoneU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
			
											{#if !verifyPhoneExistenceU}
												<div class="invalid-feedback">
													Teléfono fijo en uso.
												</div>
											{/if}
										</div>
										<div class="col-md-6">
											<label for="cellphoneU" class="form-label">
												<i class="fas fa-phone" /> Teléfono móvil
											</label>
											<input
												bind:value="{oldinstructor.cellphone}"
												bind:this="{elementCellphoneU}"
												id="cellphoneU"
												placeholder="Ingresa tu teléfono móvil"
												type="text"
												class="form-control"
												autocomplete="off"
											/>
											{#each fbCellphoneU as item}
												<div class="invalid-feedback">
													{item}
												</div>
											{/each}
											{#if !verifyCellphoneExistenceU}
												<div class="invalid-feedback">
													Teléfono móvil en uso.
												</div>
											{/if}
										</div>
									</div>
								</div>
								
								<div class="modal-footer mb-0 pb-0 pe-0">
									<button 
										type="button" 
										on:click="{() => {clearU()}}"
										bind:this="{btnBack}" 
										class="btn btn-secondary" 
										data-bs-toggle="collapse" 
										data-bs-target=".ck-1" 
										aria-expanded="false" 
										aria-controls="collap1 collap2">
										<i class="fas fa-times" /> Cancelar
									</button>
									<button type="submit" class="btn btn-primary" >
										<i class="fas fa-save" /> Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</main>
