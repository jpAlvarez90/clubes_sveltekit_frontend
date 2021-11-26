<script>
    import { onMount } from 'svelte'
	import Notrecords from './../../../components/notrecords.svelte'
	import axiosapi from './../../../utils/axiosapi'
    import swal from './../../../utils/sweetalert2'
    import {storage} from './../../../utils/firebase'
    import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
    import { goto } from '$app/navigation';

    const TITQDELETE = "¿Está seguro que desea eliminar este registro?"
	const TITDELETED = "Eliminado"
	const TXTDELETED = "El registro se ha eliminado exitosamente."
	const TITCREATED = "Creado"
	const TXTCREATED = "El registro se ha creado exitosamente."
	const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."
	let btncreate = false
	let btnupdate = false

    let defaultimage = "https://sg.com.mx/sites/default/files/inline-images/LOGO_UTEZ%202016%20-%20300_0.jpg"

    let workshops = {
        search: '',
		page: 1,
		totalRecords: 0,
		totalPages: 0,
		limit: 0,
		offset: 0,
		rows: []
    }

    let newWorkshop = {
        name:'', 
        description:'', 
        image_url:'',
        id_wo_ty:''
    }

    let oldWorkshop = {
        id:'',
        name:'', 
        description:'', 
        image_url:'',
        id_wo_ty:''
    }

    let types = []

    let closemodalcreate
	let closemodalupdate

    let searched = false;
	let wordSearched = '';
	let searching = false;

    let elementName
    let feedbackName = []
    let elementType
    let feedbackType = []
    let elementDescription
    let feedbackDescription = []
    let elementImage 
    let feedbackImage = []

    const getWorkshops = () => {
        axiosapi.doGet('/workshop/get').then((res) => {
            workshops = res.data
            searched = false
        }).catch((err)=>{
			swal.err()
		})
    }

    const getType = () => {
        axiosapi.doGet('/workshop/get/type').then((res) => {
            types = res.data
        }).catch((err)=>{
			swal.err()
		})
    }

    const getWorkshopsBySearch = () => {
        searching = true
        let endpoint = '/workshop/get'

        if (workshops.search != undefined && workshops.search != ''){
            endpoint = '/workshop/get?search=' + workshops.search
            searched = true
            wordSearched = workshops.search
        }else{
            searched = false
        }

        axiosapi.doGet(endpoint).then((res) => {
            workshops = res.data
        }).catch(()=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
    }

    const getWorkshopsByPage = (page) => {
        let endpoint = '/workshop/get?page=' + page
        if (searched){
            endpoint += '&search=' + wordSearched
        }
        axiosapi.doGet(endpoint).then((res) => {
            workshops = res.data;
        }).catch(()=>{
			swal.err()
		})
    }

    const getWorkshopsByNextPage = () => {
        getWorkshopsByPage(workshops.page + 1)
    }

    const getWorkshopsByPreviousPage = () => {
        getWorkshopsByPage(workshops.page - 1)
    }

    const getWorkshop = (id) => {
        goto(`/admin/talleres/detalle/${id}`)
    }

    const createWorkshop = async () => {
		let imageUrl = defaultimage
		if(elementImage.files.length > 0 && 
		elementImage.files[0]!=null && 
		elementImage.files[0]!=undefined && 
		elementImage.files[0]!=NaN
		){
			let reference = ref(storage,`/workshop/${Date.now()}`)
			await uploadBytes(reference,elementImage.files[0])
			imageUrl = await getDownloadURL(reference)
		}
		newWorkshop.image_url = imageUrl

        axiosapi.doPost('/workshop/create', newWorkshop).then(() =>{
            swal.con('success', TITCREATED, TXTCREATED)
            getWorkshops()
        }).catch(() => {
            swal.err()
        })
    }
    
    const updateWorkshop = () => {
        axiosapi.doPut('/workshop/update/' + oldWorkshop.id, oldWorkshop).then(() =>{
            swal.con('success', TITUPDATED, TXTUPDATED)
            getWorkshops()
        }).catch(() => {
            swal.err()
        })
    }

    const deleteWorkshop = (id) => {
        swal.concan('question', TITQDELETE).then((res) => {
            if (res.isConfirmed){
                axiosapi.doDelete('/workshop/delete/' + id).then(() => {
                    getWorkshops()
                    swal.con('success', TITDELETED, TXTDELETED)
                }).catch(() => {
                    swal.err()
                })
            }
        })
    }

    const validName = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        feedbackName = []
        target.className = `${classElement} is-valid`
        let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú0-9¡!¿?-]+[\s]*)+$/

        if(!value || value == ' '){
            isValid = false
            target.className =  classElement +' is-invalid'
            feedbackName.push('Completar el campo.')
        }
        if(!nameformat.test(value)){
            isValid = false
            target.className =  classElement +' is-invalid'
            feedbackName.push('El nombre no debe contener caracteres especiales.')
        }
        if(value.length < 3){
            isValid = false
            target.className =  classElement +' is-invalid'
            feedbackName.push('El nombre debe tener mínimo 3 caracteres.')
        }
        if(value.length > 50){
            isValid = false
            target.className =  classElement +' is-invalid'
            feedbackName.push('El nombre debe tener máximo 50 caracteres.')
        }

        return isValid
    }

    const validType = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        feedbackType = []
        target.className = `${classElement} is-valid`

        if(!value || value == ' '){
            target.className =  classElement +' is-invalid'
            feedbackType.push('Seleccione una categoría.')
            isValid = false
        }

        return isValid
    }

    const validDescription = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        feedbackDescription = []
        target.className = `${classElement} is-valid`

        if(!value || value == ' '){
            target.className =  classElement +' is-invalid'
            feedbackDescription.push('Completar el campo.')
            isValid = false
        }
        if(value.length < 3){
            target.className =  classElement +' is-invalid'
            feedbackDescription.push('La descripción debe tener mínimo 3 caracteres.')
            isValid = false
        }
        if(value.length > 1700){
            target.className =  classElement +' is-invalid'
            feedbackDescription.push('La descripción debe tener máximo 1700 caracteres.')
            isValid = false
        }

        return isValid
    }

    const validImagen = (target) => {
        let isValid = true
        let value = target.value
        let classElement = 'form-control'
        feedbackImage = []
        target.className = `${classElement} is-valid`

        if(target.files.length == 0 || value === "" || value === undefined || value === null){
			isValid = false
			target.className = `${classElement} is-invalid`
			feedbackImage.push("Se debe cargar una imagen.")
		}
        if(target.files.length > 0 && target.files[0].size > 2000000){
            isValid = false
			target.className = `${classElement} is-invalid`
			feedbackImage.push("La imagen pesa demasiado.")
            console.log(target.files[0]);
        }

        return isValid
    }

    const checkValidationC = async () => {
        let ok = true
        ok = validName(elementName) && ok
        ok = validType(elementType) && ok
        ok = validDescription(elementDescription) && ok
        ok = validImagen(elementImage) && ok
        if(ok && !btncreate){
            btncreate = true
            await createWorkshop()
            btncreate = false
            closemodalcreate.click()
        }
    }

    const listenerValidity = () => {
        elementName.addEventListener('input', (e) => {validName(e.target)})
        elementType.addEventListener('change', (e) => validType(e.target))
        elementDescription.addEventListener('input', (e) => validDescription(e.target))
        elementImage.addEventListener('input', (e) => {validImagen(e.target)})
    }

    const clear = () => {
        let classElement = 'form-control'
        newWorkshop = {
            name:'', 
            description:'', 
            image_url:'',
            id_wo_ty:''
        }

        oldWorkshop = {
            id:'',
            name:'', 
            description:'', 
            image_url:'',
            id_wo_ty:''
        }

        elementName.value = ''
        elementName.className = classElement
        feedbackName = []
        elementType.value = ''
        elementType.className = classElement
        feedbackType = []
        elementDescription.value = ''
        elementDescription.className = classElement
        feedbackDescription = []
        elementImage.value = ''
        elementImage.className = classElement
        feedbackImage = []
    }

    onMount(() => {
        getWorkshops()
        getType()
        listenerValidity()
    })
</script>
<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-chalkboard"></i> Talleres</h3>
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
        <hr>
        <div class="row mb-3">
            <div class="col">
                <div class="container">
                    <div class="row justify-content-end">
                        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-6 col-xxl-6">
                            <div class="input-group mb-3">
                                {#if searched}
									<button on:click="{()=>getWorkshops()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getWorkshopsBySearch()}}}" 
                                    bind:value="{workshops.search}" type="search" 
                                    class="form-control" placeholder="Busca algo..." 
                                    aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getWorkshopsBySearch()}" 
                                        class="btn btn-outline-primary" type="button" 
                                        id="button-search">
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
                {#if workshops.rows.length == 0}
                    <Notrecords/>
                {:else}
                    <div class="container">
                        <div class="row">
                            {#each workshops.rows as w}
                                <div class="col-md-6 col-lg-4 g-3 mb-3">
                                    <div class="card h-100">
                                        <img src="{w.image_url}" alt="Taller" class="card-img-top">
                                        <div class="card-body">
                                            <h5 class="card-title text-uppercase">{w.name}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">{w.type}</h6>
                                            <p class="card-text withGradient">
                                                {w.description.slice(0,300)}...
                                            </p>
                                        </div>
                                        <div class="card-footer bg-transparent">
                                            <div class="btn-group w-100">
                                                <button on:click="{()=>getWorkshop(w.id)}" 
                                                    type="button" class="btn btn-outline-primary">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button on:click="{()=>deleteWorkshop(w.id)}" type="button" 
                                                    class="btn btn-outline-danger">
                                                    <i class="fas fa-trash-alt" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <nav aria-label="...">
                      <ul class="pagination justify-content-end">
                          {#if workshops.page === 1}
                            <li class="page-item disabled">
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <a href="" class="page-link">Anterior</a>
                            </li>
                          {:else}
                            <li class="page-item">
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <a href="" class="page-link" 
                                    on:click="{() => getWorkshopsByPreviousPage()}"> Anterior</a>
                            </li>
                          {/if}
                          {#each Array.from({ length: workshops.totalPages }, (_, i) => 1 + (i * 1)) as item}
                              {#if workshops.page == item}
                                <li class="page-item active" aria-current="page">
                                    <!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
                                </li>
                              {:else}
                                <li class="page-item" aria-current="page">
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <a class="page-link" 
                                    on:click="{()=>getWorkshopsByPage(item)}"
                                    href=""
                                    >{item}</a>
                                </li>	
                              {/if}
                          {/each}
                          {#if workshops.page == workshops.totalPages}
                            <li class="page-item disabled">
                                <!-- svelte-ignore a11y-missing-attribute -->
                                <a class="page-link">Siguiente</a>
                            </li>	
                          {:else}
                            <li class="page-item">
                                <!-- svelte-ignore a11y-invalid-attribute -->
                                <a on:click="{()=>getWorkshopsByNextPage()}" class="page-link" href="">Siguiente</a>
                            </li>
                          {/if}
                      </ul>  
                    </nav>
                {/if}
            </div>
        </div>
    </div>

    <!-- Modal create-->
    <div class="modal fade" id="mo1" tabindex="-1" aria-labelledby="mol1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <form on:submit="{(e)=>{e.preventDefault();checkValidationC();}}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mol1">
                            <i class="fas fa-plus-circle"></i> Nuevo Taller
                        </h5>
                        <button type="button" 
                            on:click="{()=>{clear()}}" 
                            class="btn-close" data-bs-dismiss="modal" 
                            aria-label="Close" />
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-12">
                                <label for="title" class="form-label">
                                    <i class="fas fa-heading"></i> Nombre
                                </label>
                                <input 
                                    bind:this="{elementName}"
                                    bind:value = "{newWorkshop.name}"
                                    type="text" 
                                    id="title" 
                                    class="form-control"
                                    autocomplete="off" 
                                    placeholder="Ingrese el nombre del taller"
                                >
                                {#each feedbackName as item}
								<div class="invalid-feedback">
									{item}
								</div>
								{/each}
                            </div>
                            <div class="col-12">
                                <label for="type" class="form-label">
                                    <i class="fas fa-whistle"></i> Categoría
                                </label>
                                <select
                                    bind:value="{newWorkshop.id_wo_ty}"
                                    bind:this="{elementType}"
                                    id="type"
                                    class="form-select">

                                    {#if types.length > 0}
                                        {#if newWorkshop.id_wo_ty == ''}
                                            <option value={newWorkshop.id_wo_ty} selected disabled>Seleccione una categoría</option>
                                        {:else}
                                            <option disabled>Seleccione una categoría</option>
                                        {/if}
                                        {#each types as type}
                                            <option value={type.id}>{type.type}</option>
                                        {/each}
                                    {:else}
                                    <option value={newWorkshop.id_wo_ty} selected disabled>No hay registros disponibles</option>
                                    {/if}
                                </select>
                                {#each feedbackType as item}
								<div class="invalid-feedback">
									{item}
								</div>
								{/each}
                            </div>
                            <div class="col-12">
                                <label for="description" class="form-label">
                                    <i class="fas fa-align-left"></i> Descripción
                                </label>
                                <textarea 
                                    bind:value="{newWorkshop.description}"
                                    bind:this="{elementDescription}"
                                    id="description"
                                    class="form-control"
                                    placeholder="Ingrese una descripción..."
                                    ></textarea>
                                {#each feedbackDescription as item}
                                    <div class="invalid-feedback">
                                        {item}
                                    </div>
                                {/each}
                            </div>
                            <div class="col-12">
                                <label for="image" class="form-label">
                                    <i class="fas fa-image"></i> Imagen
                                </label>
                                <input 
                                    bind:this="{elementImage}"
                                    bind:value="{newWorkshop.image_url}"
                                    accept="image/*"
									id="image"
									type="file"
									class="form-control">
                                {#each feedbackImage as item}
                                    <div class="invalid-feedback">
                                        {item}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button bind:this="{closemodalcreate}" 
                            on:click="{()=>{clear()}}" type="button" 
                            class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                        </button>
						<button disabled="{btncreate}" type="submit" class="btn btn-primary">
							{#if btncreate}
								<i class="fas fa-redo-alt fa-spin"></i>
							{:else}
								<i class="fas fa-save"></i>
							{/if}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal update
    <div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <form>
                    <div class="modal-header">
                        <h5 class="modal-title" id="mol2">
                            <i class="fas fa-edit"></i> Editar Taller
                        </h5>
                        <button type="button" 
                            on:click="{()=>{clear()}}" 
                            class="btn-close" data-bs-dismiss="modal" 
                            aria-label="Close" />
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-4 mb-3">
                                    <div class="col-12">
                                        <div class="w-100 rounded border card" 
                                            style="background-size: cover;height:20em;background-image: url('{oldWorkshop.image_url}');">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <div class="col-12">
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <label for="titleU" class="form-label">
                                                    <i class="fas fa-heading"></i> Nombre
                                                </label>
                                                <input 
                                                    bind:value = "{oldWorkshop.name}"
                                                    type="text" 
                                                    id="titleU" 
                                                    class="form-control"
                                                    autocomplete="off" 
                                                    placeholder="Ingrese el nombre del taller">
                                            </div>
                                            <div class="col-12">
                                                <label for="typeU" class="form-label">
                                                    <i class="fas fa-whistle"></i> Categoría
                                                </label>
                                                <select
                                                    bind:value="{oldWorkshop.id_wo_ty}"
                                                    id="typeU"
                                                    class="form-select">
                
                                                    {#if types.length > 0}
                                                            <option disabled>Seleccione una categoría</option>
                                                        {#each types as type}
                                                            <option value={type.id}>{type.type}</option>
                                                        {/each}
                                                    {:else}
                                                        <option selected disabled>No hay registros disponibles</option>
                                                    {/if}
                                                </select>
                                            </div>
                                            <div class="col-12">
                                                <label for="descriptionU" class="form-label">
                                                    <i class="fas fa-align-left"></i> Descripción
                                                </label>
                                                <textarea 
                                                    bind:value="{oldWorkshop.description}"
                                                    id="descriptionU"
                                                    class="form-control"
                                                    placeholder="Ingrese una descripción..."
                                                    ></textarea>
                                            </div>
                                            <div class="col-12">
                                                <label for="imageU" class="form-label">
                                                    <i class="fas fa-image"></i> Imagen
                                                </label>
                                                <input 
                                                    bind:value="{oldWorkshop.image_url}"
                                                    type="file" 
                                                    id="imageU" 
                                                    class="form-control"
                                                    accept="image/*">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button bind:this="{closemodalupdate}" 
                            on:click="{()=>{clear()}}" type="button" 
                            class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times"></i> Cancelar
                        </button>
						<button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>-->
</main>