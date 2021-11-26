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
	import Notrecords from './../../../../components/notrecords.svelte'
	import axiosapi from './../../../../utils/axiosapi'
    import swal from './../../../../utils/sweetalert2'
    import {storage} from './../../../../utils/firebase'
    import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
    import { goto } from '$app/navigation';
 
    export let id = 0
    const idWorkshop = id

    const TITQDELETE = "¿Está seguro que desea eliminar este registro?"
	const TITDELETED = "Eliminado"
	const TXTDELETED = "El registro se ha eliminado exitosamente."
	const TITCREATED = "Creado"
	const TXTCREATED = "El registro se ha creado exitosamente."
	const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."

    let isSending = false
    let searched = false
    let searching = false
    let wordSearched = ""
    let workshop = {
        id: 0,
        name: "",
        description: "",
        type: "",
        image_url: "",
        id_wo_ty: 0
    }
	let instructor = {
		name: "",
		first_last_name: "",
        second_last_name: "",
        email: "",
        personal_email: "",
        phone: "",
        cellphone: ""
	}
    let instructors = {
        search: '',
		page: 1,
		totalRecords: 0,
		totalPages: 1,
		limit: 0,
		offset: 0,
		rows: []
    }
    let types = []

    const getTypes = () => {
        axiosapi.doGet('/workshop/get/type').then((res) => {
            types = res.data
        }).catch((err)=>{
			swal.err()
		})
    }

    let btnShowHideWorkshopForm

    let elementName
    let fbName = []
    let elementType
    let fbType = []
    let elementDescription
    let fbDescription = []
    let elementImage
    let fbImage = []


    const clearWorkshop = ()=>{
        let classElement = 'form-control'
        elementName.value = workshop.name
        elementName.className = classElement
        fbName = []

        elementType.value = workshop.id_wo_ty
        elementType.className = classElement
        fbType = []

        elementDescription.value = workshop.description
        elementDescription.className = classElement
        fbDescription = []

        elementImage.value = ''
        elementImage.className = classElement
        fbImage = []
        

    }

    const getWorkshop = ()=>{
        if(idWorkshop === 0){
            goto("/admin/talleres/panel")
        }else{
            axiosapi.doGet(`/workshop/get/${idWorkshop}`).then(res=>{
                if(res.data === ""){
                    goto("/admin/talleres/panel")
                }else{
                    workshop = res.data
                }
            }).catch(err=>{
                swal.err()
                goto("/admin/talleres/panel")
            })
        }

    }

    const validName = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        fbName = []
        target.className = `${classElement} is-valid`
        let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú0-9¡!¿?-]+[\s]*)+$/

        if(!value || value == ' '){
            isValid = false
            target.className =  classElement +' is-invalid'
            fbName.push('Completar el campo.')
        }
        if(!nameformat.test(value)){
            isValid = false
            target.className =  classElement +' is-invalid'
            fbName.push('El nombre no debe contener caracteres especiales.')
        }
        if(value.length < 3){
            isValid = false
            target.className =  classElement +' is-invalid'
            fbName.push('El nombre debe tener mínimo 3 caracteres.')
        }
        if(value.length > 50){
            isValid = false
            target.className =  classElement +' is-invalid'
            fbName.push('El nombre debe tener máximo 50 caracteres.')
        }

        return isValid
    }

    const validType = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        fbType = []
        target.className = `${classElement} is-valid`

        if(!value || value == ' '){
            target.className =  classElement +' is-invalid'
            fbType.push('Seleccione una categoría.')
            isValid = false
        }

        return isValid
    }

    const validDescription = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        fbDescription = []
        target.className = `${classElement} is-valid`

        if(!value || value == ' '){
            target.className =  classElement +' is-invalid'
            fbDescription.push('Completar el campo.')
            isValid = false
        }
        if(value.length < 3){
            target.className =  classElement +' is-invalid'
            fbDescription.push('La descripción debe tener mínimo 3 caracteres.')
            isValid = false
        }
        if(value.length > 1700){
            target.className =  classElement +' is-invalid'
            fbDescription.push('La descripción debe tener máximo 1700 caracteres.')
            isValid = false
        }

        return isValid
    }

    const validImagen = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        fbImage = []
        target.className = `${classElement} is-valid`

        if(target.files.length > 0 && target.files[0].size > 2000000){
            isValid = false
			target.className = `${classElement} is-invalid`
			fbImage.push("La imagen pesa demasiado.")
        }

        return isValid
    }

    const listenerValidity = () => {
        elementName.addEventListener('input', (e) => {validName(e.target)})
        elementType.addEventListener('change', (e) => validType(e.target))
        elementDescription.addEventListener('input', (e) => validDescription(e.target))
        elementImage.addEventListener('input', (e) => {validImagen(e.target)})
    }

    const updateWorkshop = async () => {
        let urlImage = workshop.image_url

		if(elementImage.files.length > 0 && 
		elementImage.files[0]!=null && 
		elementImage.files[0]!=undefined && 
		elementImage.files[0]!=NaN
		){
			let reference = ref(storage,`/workshop/${Date.now()}`)
			await uploadBytes(reference,elementImage.files[0])
			urlImage = await getDownloadURL(reference)
		}


        let ws = {
            id: 0,
            name: elementName.value,
            description: elementDescription.value,
            image_url: urlImage,
            id_wo_ty: elementType.value
        }
        await axiosapi.doPut(`/workshop/update/${idWorkshop}`, ws).then(() =>{
            swal.con('success', TITUPDATED, TXTUPDATED)
            getWorkshop()
        }).catch(() => {
            swal.err()
        })
    }

    const checkUpdateWorkshopValidation = async ()=>{
		let ok = true
		ok = validName(elementName) && ok
        ok = validType(elementType) && ok
        ok = validDescription(elementDescription) && ok
        ok = validImagen(elementImage) && ok
		if(ok && !isSending){
			isSending = true
			await updateWorkshop()
			isSending = false
			btnShowHideWorkshopForm.click()
		}
    }

    const getInstructors = ()=>{
		axiosapi.doGet(`/instructor/get/workshop/${idWorkshop}`).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{searched = false})
    }

    const getInstructor = (id)=>{
		axiosapi.doGet(`/instructor/get/${id}`).then(res=>{
			instructor = res.data;
		}).catch((err)=>{
			swal.err()
		})
    }

    const getInstructorsByPage = (page)=>{
		let endpoint = `/instructor/get/workshop/${idWorkshop}?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		})
    }

    const getInstructorsByPreviousPage = ()=>{
        getInstructorsByPage(instructors.page-1)
    }

    const getInstructorsByNextPage = ()=>{
        getInstructorsByPage(instructors.page+1)
    }

    const getInstructorsBySearch = ()=>{
		searching = true
		let endpoint = `/instructor/get/workshop/${idWorkshop}`
		if(instructors.search != undefined && instructors.search != ""){
			endpoint += `?search=${instructors.search}`
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
    

    onMount(()=>{
        getWorkshop()
        getInstructors()
        getTypes()
        listenerValidity()
    })
    
</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <div class="container">
            <div class="row justify-content-start align-items-center gy-3">
                <div class="col-lg-2">
                    <a class="btn btn-outline-secondary h-100 w-100 fs-5" href="/admin/talleres/panel">
                        <i class="fas fa-long-arrow-alt-left"></i> Regresar
                    </a>
                </div>
                <div class="col-lg-10">
                    <h1 class="text-sm-center text-lg-start">
                        <i class="fas fa-list"></i>
                        Detalles
                    </h1>
                </div>
            </div>
        </div>
        <hr>
        <div class="container main-card rounded border px-4 py-4 mb-4">
            <h2>
                <i class="fa fa-chalkboard"></i> Datos del taller
            </h2>
            <hr>
            <div id="colap1" class="collapse show multi-collapse row mt-3 gy-3">
                <div class="col-sm-12 col-md-12 col-lg-3 ">
                    <img class="img-fluid rounded card" 
                    src="{workshop.image_url}" alt="imagen taller">
                </div>
                <div class="col-sm-12 col-md-8 col-lg-7 ">
                    <div class="container gy-3">
                        <div class="row align-items-center ">
                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-7 ">
                                <h1>{workshop.name}</h1>
                            </div>
                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-5">
                                <h3 class="text-muted">| Taller {workshop.type.toLowerCase()}</h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <p style="text-align: justify;">{workshop.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-2 ">
                    <div class="container">
                        <div class="row g-2 justify-content-center">
                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                <button bind:this="{btnShowHideWorkshopForm}" aria-controls="colap1 colap2" data-bs-target=".multi-collapse" data-bs-toggle="collapse" on:click="{()=>{clearWorkshop()}}" type="button" class="btn btn-outline-primary w-100">
                                    <i class="fa fa-edit"></i>
                                </button>
                            </div>
                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                <button type="button" class="btn btn-outline-danger w-100">
                                    <i class="fa fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="colap2" class="collapse multi-collapse row mt-3 gy-3">
                <div class="col-sm-12 col-md-12 col-lg-3 col-xl-4">
                    <img class="img-fluid rounded card" 
                    src="{workshop.image_url}" alt="imagen taller">
                </div>
                <div class="col-sm-12 col-md-12 col-lg-9 col-xl-8">
                    <div class="container">
                        <form on:submit="{(e)=>{e.preventDefault();checkUpdateWorkshopValidation();}}">
                            <div class="row gy-3 align-items-center ">
                                <div class="col-12">
                                    <label class="form-label" for="name">
                                        <i class="fas fa-heading"></i> Nombre
                                    </label>
                                    <input bind:this="{elementName}" id="name" autocomplete="off" placeholder="Nombre" type="text" class="form-control">
                                    {#each fbName as item}
                                        <div class="invalid-feedback">
                                            {item}
                                        </div>
                                    {/each}
                                </div>
                                <div class="col-12">
                                    <label for="type" class="form-label">
                                        <i class="fas fa-whistle"></i> Tipo
                                    </label>
                                    <select bind:this="{elementType}" id="type" class="form-control">
                                        {#each types as item}
                                            <option value="{item.id}">{item.type}</option>
                                        {/each}
                                    </select>
                                    {#each fbType as item}
                                        <div class="invalid-feedback">
                                            {item}
                                        </div>
                                    {/each}
                                </div>
                                <div class="col-12">
                                    <label for="description" class="form-label">
                                        <i class="fas fa-align-left"></i> Descripción
                                    </label>
                                    <textarea bind:this="{elementDescription}" placeholder="Agrega una descripción..." style="height: 184px;" class="form-control" id="description">{workshop.description}</textarea>
                                    {#each fbDescription as item}
                                        <div class="invalid-feedback">
                                            {item}
                                        </div>
                                    {/each}
                                </div>
                                <div class="col-12">
                                    <label for="image" class="form-label">
                                        <i class="fas fa-image"></i> Imagen
                                    </label>
                                    <input bind:this="{elementImage}" accept="image/*" type="file" class="form-control" id="image"/>
                                    {#each fbImage as item}
                                        <div class="invalid-feedback">
                                            {item}
                                        </div>
                                    {/each}
                                </div>
                                <div class="col-12">
                                    <div class="container">
                                        <div class="row g-2 justify-content-center">
                                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                                <button aria-controls="colap1 colap2" data-bs-target=".multi-collapse" data-bs-toggle="collapse" on:click="{()=>{clearWorkshop()}}" type="button" class="btn btn-outline-secondary w-100">
                                                    <i class="fa fa-times"></i> Cancelar
                                                </button>
                                            </div>
                                            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
                                                <button disabled="{isSending}" type="submit" class="btn btn-outline-primary w-100">
                                                    {#if isSending}
                                                        <i class="fa fa-redo-alt fa-spin"></i>
                                                    {:else}
                                                        <i class="fa fa-save"></i>
                                                    {/if}
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div> 
        </div>
        <hr>
        <div class="container main-card rounded border px-4 py-4 mb-4">
            <div class="container">
                <div class="row gy-2 justify-content-between align-items-center">
                    <h2 class="col-md-4"><i class="fa fa-user-tie"></i> Instructores</h2>        
                    <div class="col-md-4">
                        <button class="float-md-end btn btn-outline-success rounded-pill" >
                            <i class="fa fa-plus-circle"></i> Asignar
                        </button>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row mt-3 gy-3">
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
                    <Notrecords/>
                {:else}
                <div class="table-responsive">
                    <table class="table table-stripped table-hover">
                        <caption>
							Mostrando {instructors.offset+1} - {
								instructors.offset+instructors.limit>instructors.totalRecords?instructors.totalRecords:instructors.offset+instructors.limit
								} de {instructors.totalRecords} registros totales.
                        </caption>
                        <thead>
                            <tr class="text-center">
                                <th>No.</th>
                                <th>Nombre</th>
                                <th>Correo Electrónico Institucional</th>
                                <th>Teléfono</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each instructors.rows as ins,i}
                            <tr class="text-center">
                                <td>{i+1}</td>
                                <td>{ins.name} {ins.first_last_name} {ins.second_last_name}</td>
                                <td>{ins.email}</td>
                                <td>{ins.cellphone}</td>
                                <td>
									<div class="btn-group" role="group">
										<button on:click="{()=>{getInstructor(ins.id)}}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-eye"></i>
										</button>
										<button on:click="{()=>{ins.id}}" type="button" class="btn btn-outline-danger">
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
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
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

	<!-- Modal Instructor -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mol2">
                        <i class="fas fa-user-tie" /> Datos del Instructor
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-lg-3 text-center">
                            <span class="h1">
                                <i class="my-4 fas fa-4x fa-user-tie"></i>
                            </span>
                        </div>
                        <div class="col-lg-9 fs-6">
                            <div class="row gy-2 ">
                                <div class="col">
                                    <div class="fw-bold">
                                        <i class="fas fa-user-tie"></i> Nombre
                                    </div>
                                    <div>
                                        {instructor.name} {instructor.first_last_name} {instructor.second_last_name}
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="row gy-2 ">
                                <div class="col-lg-6">
                                    <div class="fw-bold">
                                        <i class="fas fa-envelope"></i> Correo electrónico institucional
                                    </div>
                                    <div>
                                        {instructor.email}
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="fw-bold">
                                        <i class="fas fa-envelope"></i> Correo electrónico personal
                                    </div>
                                    <div>
                                        {instructor.personal_email}
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="row gy-2 ">
                                <div class="col-lg-6">
                                    <div class="fw-bold">
                                        <i class="fas fa-phone"></i> Teléfono fijo
                                    </div>
                                    <div>
                                        {instructor.phone}
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="fw-bold">
                                        <i class="fas fa-phone"></i> Teléfono celular
                                    </div>
                                    <div>
                                        {instructor.cellphone}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cerrar</button>
                </div>
			</div>
		</div>
	</div>
</main>
