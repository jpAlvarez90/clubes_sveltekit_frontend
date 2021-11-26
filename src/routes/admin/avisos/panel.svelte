<script>
	import { onMount } from 'svelte'
	import Notrecords from './../../../components/notrecords.svelte'
	import axiosapi from './../../../utils/axiosapi'
    import swal from './../../../utils/sweetalert2'
	import {storage} from './../../../utils/firebase'
	import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
	
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
    

    let ads = {
		search: "",
		page: 1,
		totalRecords: 0,
		totalPages: 1,
		limit: 0,
		offset: 0,
		rows: []
	};
	let searched = false
	let wordSearched = ""
	let searching = false
	let newad = {
		title:"",
		description:"",
        image_url: "https://eitrawmaterials.eu/wp-content/uploads/2019/05/Label-brochure-1.jpg",
        image: ""
	};
	let oldad = {
		id:0,
		title:"",
		description:"",
        image_url: "https://eitrawmaterials.eu/wp-content/uploads/2019/05/Label-brochure-1.jpg",
        image: ""
	};
	let closemodalcreate
	let closemodalupdate

	const getAds = ()=>{
		axiosapi.doGet("/ad/get").then(res=>{
			ads = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getAdsBySearch = ()=>{
		searching = true
		let endpoint = `/ad/get`
		if(ads.search != undefined && ads.search != ""){
			endpoint = `/ad/get?search=${ads.search}`
			searched = true
			wordSearched = ads.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			ads = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getAdsByPage = (page)=>{
		let endpoint = `/ad/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			ads = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getAdsByNextPage = ()=>{
        getAdsByPage(ads.page+1)
	}

	const getAdsByPreviousPage = ()=>{
        getAdsByPage(ads.page-1)
	}

	const getAd = (id)=>{
		axiosapi.doGet("/ad/get/"+id).then(res=>{		
			oldad = res.data;
			console.log(res.data);
		}).catch(()=>{
			swal.err()
		})
	}

	const updateAd = async ()=>{

		if(elementFileU.files.length > 0 && 
		elementFileU.files[0]!=null && 
		elementFileU.files[0]!=undefined && 
		elementFileU.files[0]!=NaN
		){
			let reference = ref(storage,`/workshop/${Date.now()}`)
			await uploadBytes(reference,elementFileU.files[0])
			oldad.image_url = await getDownloadURL(reference)
		}
		
		axiosapi.doPut("/ad/update/"+oldad.id,oldad).then(res=>{		
			swal.con('success',TITUPDATED,TXTUPDATED)
			getAds()
		}).catch((err)=>{
			swal.err()
		})
	}

	const createAd = async ()=>{
		let imageUrl = defaultimage
		if(elementFileC.files.length > 0 && 
		elementFileC.files[0]!=null && 
		elementFileC.files[0]!=undefined && 
		elementFileC.files[0]!=NaN
		){
			let reference = ref(storage,`/workshop/${Date.now()}`)
			await uploadBytes(reference,elementFileC.files[0])
			imageUrl = await getDownloadURL(reference)
		}
		newad.image_url = imageUrl

		axiosapi.doPost("/ad/create",newad).then((res)=>{
			swal.con('success',TITCREATED,TXTCREATED)
			getAds()
		}).catch((err)=>{
			swal.err()
		})
	}
	
    const deleteAd = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
			if(result.isConfirmed){
				axiosapi.doDelete("/ad/delete/"+id).then((res)=>{
					getAds()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
			}
		})
    }

	const checkCreateValidation = async ()=>{
		let ok = true
		ok = validTitleC(elementTitleC) && ok
		ok = validDescriptionC(elementDescriptionC) && ok
        ok = validFileC(elementFileC) && ok
		if(ok && !btncreate){
			btncreate = true
			await createAd()
			btncreate = false
			closemodalcreate.click()
		}
	}

	const checkUpdateValidation = async ()=>{
		let ok = true
		ok = validTitleU(elementTitleU) && ok
		ok = validDescriptionU(elementDescriptionU) && ok
        ok = validFileU(elementFileU) && ok
		if(ok && !btnupdate){
			btnupdate = true
		    await updateAd()
			btnupdate = false
			closemodalupdate.click()
		}
	}

	const clear = ()=>{
		let elementClass = "form-control"

		elementTitleC.value = ""
		newad.title = ""
		elementTitleC.className = `${elementClass}`
		fbTitleC = []

		elementDescriptionC.value = ""
		newad.description = ""
		elementDescriptionC.className = `${elementClass}`
		fbDescriptionC = []

        elementFileC.value = ""
		newad.image = ""
		elementFileC.className = `${elementClass}`
		fbFileC = []

		elementTitleU.value = ""
		oldad.title = ""
		elementTitleU.className = `${elementClass}`
		fbTitleU = []

		elementDescriptionU.value = ""
		oldad.description = ""
		elementDescriptionU.className = `${elementClass}`
		fbDescriptionU = []

        elementFileU.value = ""
		oldad.image = ""
		elementFileU.className = `${elementClass}`
		fbFileU = []

	}

	let elementTitleC
	let fbTitleC = []
	let elementDescriptionC
	let fbDescriptionC = []
	let elementFileC
	let fbFileC = []

	let elementTitleU
	let fbTitleU = []
	let elementDescriptionU
	let fbDescriptionU = []
	let elementFileU
	let fbFileU = []



	const validTitleC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbTitleC = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú0-9¡!¿?-]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbTitleC.push("El título no debe contener caracteres especiales ni estar en blanco.")
		}
		if(v.length < 3 || v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbTitleC.push("El nombre contener de 3 a 60 caracteres.")
		}
		
		return validated
	}
	const validDescriptionC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbDescriptionC = []
		target.className = `${elementClass} is-valid`

		if(v.length < 3 || v.length > 1700){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbDescriptionC.push("La descripción contener de 3 a 1700 caracteres.")
		}
		
		return validated
	}
    const validFileC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbFileC = []
		target.className = `${elementClass} is-valid`

		if(target.files.length == 0 || v === "" || v === undefined || v === null){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbFileC.push("Se debe cargar una imagen.")
		}
        if(target.files.length > 0 && target.files[0].size > 2000000){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbFileC.push("La imagen pesada demasiado.")
        }
        
		
		return validated
    }
	const validTitleU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbTitleU = []
		target.className = `${elementClass} is-valid`

		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú0-9¡!¿?-]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbTitleU.push("El título no debe contener caracteres especiales ni estar en blanco.")
		}
		if(v.length < 3 || v.length > 60){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbTitleU.push("El nombre contener de 3 a 60 caracteres.")
		}
		
		return validated
	}
	const validDescriptionU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbDescriptionU = []
		target.className = `${elementClass} is-valid`

		if(v.length < 3 || v.length > 1700){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbDescriptionU.push("La descripción contener de 3 a 1700 caracteres.")
		}
		
		return validated
	}
    const validFileU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbFileU = []
		target.className = `${elementClass} is-valid`
        if(target.files.length > 0 && target.files[0].size > 2000000){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbFileU.push("La imagen pesada demasiado.")
            console.log(target.files[0]);
        }
        
        
		
		return validated
    }

	const listenerValidity = ()=>{
		elementTitleC.addEventListener('input',(e)=>{validTitleC(e.target)})
		elementDescriptionC.addEventListener('input',(e)=>{validDescriptionC(e.target)})
        elementFileC.addEventListener('input',(e)=>{validFileC(e.target)})
		elementTitleU.addEventListener('input',(e)=>{validTitleU(e.target)})
		elementDescriptionU.addEventListener('input',(e)=>{validDescriptionU(e.target)})
        elementFileU.addEventListener('input',(e)=>{validFileU(e.target)})
	}

	onMount(()=>{
		getAds()
		listenerValidity()
	})
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-newspaper"></i> Avisos</h3>
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
									<button on:click="{()=>getAds()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getAdsBySearch()}}}" bind:value="{ads.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getAdsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if ads.rows.length == 0}
					<Notrecords />
				{:else}
                <div class="container">
                    <div class="row">
                        {#each ads.rows as a,i}
                        <div class="col-md-6 col-lg-4 g-3 mb-3">
                            <div class="card h-100">
                                <img src="{a.image_url}" class="card-img-top" alt="Imagen del aviso">
                                <div class="card-body">
                                    <h5 class="card-title text-uppercase">{a.title.slice(0,60)}</h5>
                                    <p class="card-text withGradient">
                                        {a.description.slice(0,300)}...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <div class="btn-group w-100" role="group">
                                        <button on:click="{()=>getAd(a.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button on:click="{()=>deleteAd(a.id)}" type="button" class="btn btn-outline-danger">
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
						{#if ads.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getAdsByPreviousPage()}" class="page-link" href="">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: ads.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if ads.page == item}
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" 
									on:click="{()=>getAdsByPage(item)}"
                                    href=""
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if ads.page === ads.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-missing-attribute -->
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getAdsByNextPage()}" class="page-link" href="">Siguiente</a>
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
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();checkCreateValidation();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol1">
							<i class="fas fa-plus-circle" /> Nuevo Aviso
						</h5>
						<button type="button" on:click="{()=>{clear()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						<div class="row g-3">
							<div class="col-12">
								<label for="title" class="form-label">
									<i class="fas fa-heading"></i> Título
								</label>
								<input
									bind:this="{elementTitleC}"
									bind:value="{newad.title}"
									id="title"
									type="text"
									class="form-control"
									autocomplete="off"
									placeholder="Ingrese el título del aviso"
								/>
								{#each fbTitleC as item}
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
									bind:this="{elementDescriptionC}"
									bind:value="{newad.description}"
									id="description"
									class="form-control"
									placeholder="Ingrese una descripción..."
								></textarea>
								{#each fbDescriptionC as item}
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
									bind:this="{elementFileC}"
									bind:value="{newad.image}"
                                    accept="image/*"
									id="image"
									type="file"
									class="form-control"
								/>
								{#each fbFileC as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button bind:this="{closemodalcreate}" on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
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

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered">
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();checkUpdateValidation();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol2">
							<i class="fas fa-edit"></i> Editar Aviso
						</h5>
						<button on:click="{()=>{clear()}}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-4 mb-3">
                                    <div class="col-12">
                                        <div class="w-100 rounded border card" style="background-size: cover;height:20em;background-image: url('{oldad.image_url}');"></div>
                                    </div>
                                </div>
                                <div class="col-lg-8">
                                    <div class="col-12">
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <label for="titleu" class="form-label">
                                                    <i class="fas fa-heading"></i> Título
                                                </label>
                                                <input
                                                    bind:this="{elementTitleU}"
                                                    bind:value="{oldad.title}"
                                                    id="titleu"
                                                    type="text"
                                                    class="form-control"
                                                    autocomplete="off"
                                                    placeholder="Ingrese el título del aviso"
                                                />
                                                {#each fbTitleU as item}
                                                    <div class="invalid-feedback">
                                                        {item}
                                                    </div>
                                                {/each}
                                            </div>
                                            <div class="col-12">
                                                <label for="descriptionu" class="form-label">
                                                    <i class="fas fa-align-left"></i> Descripción
                                                </label>
                                                <textarea
                                                    bind:this="{elementDescriptionU}"
                                                    bind:value="{oldad.description}"
                                                    id="descriptionu"
                                                    class="form-control"
                                                    placeholder="Ingrese una descripción..."
                                                ></textarea>
                                                {#each fbDescriptionU as item}
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
                                                    bind:this="{elementFileU}"
                                                    bind:value="{oldad.image}"
                                                    accept="image/*"
                                                    id="image"
                                                    type="file"
                                                    class="form-control"
                                                />
                                                {#each fbFileU as item}
                                                    <div class="invalid-feedback">
                                                        {item}
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
					</div>
					<div class="modal-footer">
						<button on:click="{()=>{clear()}}" bind:this="{closemodalupdate}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
						<button disabled="{btnupdate}" type="submit" class="btn btn-primary" >
							{#if btnupdate}
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
</main>
