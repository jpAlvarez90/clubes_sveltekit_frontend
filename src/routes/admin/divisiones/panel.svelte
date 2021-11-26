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

    let divisions = {
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
	let newdivision = {
		name:"",
		acronym:""
	};
	let olddivision = {
		id:0,
		name:"",
		acronym:""
	};
	let closemodalcreate
	let closemodalupdate

	const getDivisions = ()=>{
		axiosapi.doGet("/academic/division/test/get").then(res=>{
			divisions = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getDivisionsBySearch = ()=>{
		searching = true
		let endpoint = `/academic/division/test/get`
		if(divisions.search != undefined && divisions.search != ""){
			endpoint = `/academic/division/test/get?search=${divisions.search}`
			searched = true
			wordSearched = divisions.search
		}else{
			endpoint = `/academic/division/test/get`
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			divisions = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getDivisionsByPage = (page)=>{
		let endpoint = `/academic/division/test/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			divisions = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getDivisionsByNextPage = ()=>{
		getDivisionsByPage(divisions.page+1)
	}

	const getDivisionsByPreviousPage = ()=>{
		getDivisionsByPage(divisions.page-1)
	}

	const getDivision = (id)=>{
		axiosapi.doGet("/academic/division/get/"+id).then(res=>{		
			olddivision = res.data;
			nameU = res.data.name
			acronymU = res.data.acronym
		}).catch((err)=>{
			swal.err()
		})
	}

	const updateDivision = ()=>{
		axiosapi.doPut("/academic/division/update/"+olddivision.id,olddivision).then(res=>{		
			swal.con('success',TITUPDATED,TXTUPDATED)
			getDivisions()
		}).catch((err)=>{
			swal.err()
		})
	}

	const createDivision = ()=>{
		axiosapi.doPost("/academic/division/create",newdivision).then((res)=>{
			swal.con('success',TITCREATED,TXTCREATED)
			getDivisions()
		}).catch((err)=>{
			swal.err()
		})
	}
	
    const deleteDivision = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
			if(result.isConfirmed){
				axiosapi.doDelete("/academic/division/delete/"+id).then((res)=>{
					getDivisions()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
			}
		})
    }

	const checkCreateValidation = async ()=>{
		let ok = true
		let respName = await validNameC(elementNameC).then((resp) => {
			return resp
		})
		let respAcronym = await validAcronymC(elementAcronymC).then((resp) => {
			return resp
		})
		ok = respAcronym && ok
		ok = respName && ok
		console.log(ok);
		if(ok){
			createDivision()
			closemodalcreate.click()
		}
	}

	const checkUpdateValidation = async()=>{
		let ok = true
		let respName = await validNameU(elementNameU).then((resp) => {
			return resp
		})
		let respAcronym = await validAcronymU(elementAcronymU).then((resp) => {
			return resp
		})
		ok = respName && ok
		ok = respAcronym && ok
		if(ok){
			updateDivision()
			closemodalupdate.click()
		}
	}

	const clear = ()=>{
		let elementClass = "form-control"

		elementNameC.value = ""
		newdivision.name = ""
		elementNameC.className = `${elementClass}`
		fbNameC = []

		elementAcronymC.value = ""
		newdivision.acronym = ""
		elementAcronymC.className = `${elementClass}`
		fbAcronymC = []

		elementNameU.value = ""
		olddivision.name = ""
		elementNameU.className = `${elementClass}`
		fbNameU = []

		elementAcronymU.value = ""
		olddivision.acronym = ""
		elementAcronymU.className = `${elementClass}`
		fbAcronymU = []

		verifyAcronymExistence = true
		verifyNameExistence = true
	}

	let elementNameC
	let fbNameC = []
	let elementAcronymC
	let fbAcronymC = []

	let elementNameU
	let fbNameU = []
	let elementAcronymU
	let fbAcronymU = []
	let verifyNameExistence = true
	let verifyAcronymExistence = true
	let verifyNameExistenceU = true
	let verifyAcronymExistenceU = true
	let nameU = ''
	let acronymU = ''

	const validNameC = async (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNameC = []
		verifyNameExistence = true
		target.className = `${elementClass} is-valid`
		
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameC.push("El nombre no debe contener números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 100){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameC.push("El nombre contener de 3 a 100 caracteres.")
		}
		if(v){
			let div = {
				name : v,
				acronym: ""
			}
			const resp = await axiosapi.doPost('/academic/division/verify/existence', div).then((res) => {
					return res.data
				}).catch(() => {
					swal.err()
				})

				if(resp > 0){
					validated = false
					target.className = `${elementClass} is-invalid`
					verifyNameExistence = false
				}
		}else{
			validated = false
		}

		return validated
	}
	const validAcronymC = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbAcronymC = []
		verifyAcronymExistence = true
		target.className = `${elementClass} is-valid`

		let nameformat = /^([A-Z]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbAcronymC.push("El acrónimo no debe contener minúsculas, números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 7){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbAcronymC.push("El nombre contener de 3 a 7 caracteres.")
		}

		if(v){
			let div = {
				name : "",
				acronym: v
			}
			const resp = await axiosapi.doPost('/academic/division/verify/existence', div).then((res) => {
					return res.data
				}).catch(() => {
					swal.err()
				})

				if(resp > 0){
					validated = false
					target.className = `${elementClass} is-invalid`
					verifyAcronymExistence = false
				}
		}else{
			validated = false
		}
		
		return validated
	}
	const validNameU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNameU = []
		target.className = `${elementClass} is-valid`
		verifyNameExistenceU = true
		// Formato de nombre válido
		
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre no debe contener números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 100){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre contener de 3 a 100 caracteres.")
		}

		if(v){
			if(v != nameU){
				let div = {
				name : v,
				acronym: ""
				}
				const resp = await axiosapi.doPost('/academic/division/verify/existence', div).then((res) => {
						return res.data
					}).catch(() => {
						swal.err()
					})

					if(resp > 0){
						validated = false
						target.className = `${elementClass} is-invalid`
						verifyNameExistenceU = false
					}
				}
		}else{
			validated = false
		}
		
		return validated
	}
	const validAcronymU = async(target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbAcronymU = []
		target.className = `${elementClass} is-valid`
		verifyAcronymExistenceU = true

		// Formato de nombre válido
		
		let nameformat = /^([A-Z]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbAcronymU.push("El acrónimo no debe contener minúsculas, números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 7){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbAcronymU.push("El nombre contener de 3 a 7 caracteres.")
		}

		if( v != acronymU){
			if(v){
				let div = {
					name : "",
					acronym: v
				}
				const resp = await axiosapi.doPost('/academic/division/verify/existence', div).then((res) => {
						return res.data
					}).catch(() => {
						swal.err()
					})

					if(resp > 0){
						validated = false
						target.className = `${elementClass} is-invalid`
						verifyAcronymExistenceU = false
					}
			}else{
				validated = false
			}
		}
		
		return validated
	}

	const listenerValidity = ()=>{
		elementNameC.addEventListener('input',async(e)=>{validNameC(e.target)})
		elementAcronymC.addEventListener('input', async(e)=>{validAcronymC(e.target)})
		elementNameU.addEventListener('input', async(e)=>{validNameU(e.target)})
		elementAcronymU.addEventListener('input', async(e)=>{validAcronymU(e.target)})
	}

	onMount(()=>{
		getDivisions()
		listenerValidity()
	})
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-graduation-cap"></i> Divisiones Académicas</h3>
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
									<button on:click="{()=>getDivisions()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getDivisionsBySearch()}}}" bind:value="{divisions.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getDivisionsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if divisions.rows.length == 0}
					<Notrecords />
				{:else}
				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<caption>
							Mostrando {divisions.offset+1} - {
								divisions.offset+divisions.limit>divisions.totalRecords?divisions.totalRecords:divisions.offset+divisions.limit
								} de {divisions.totalRecords} registros totales.
						</caption>
						<thead>
							<tr class="text-center">
								<th>No.</th>
								<th>División Académica</th>
								<th>Siglas</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each divisions.rows as d,i}
							<tr class="text-center">
								<td>{i+1}</td>
								<td>{d.name}</td>
								<td>{d.acronym}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click="{()=>getDivision(d.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-edit"></i>
										</button>
										<button on:click="{()=>deleteDivision(d.id)}" type="button" class="btn btn-outline-danger">
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
						{#if divisions.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="#">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getDivisionsByPreviousPage()}" class="page-link" href="#">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: divisions.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if divisions.page == item}
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="#">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" 
									on:click="{()=>getDivisionsByPage(item)}" 
									href="#"
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if divisions.page === divisions.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="#">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getDivisionsByNextPage()}" class="page-link" href="#">Siguiente</a>
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
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();checkCreateValidation();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol1">
							<i class="fas fa-plus-circle" /> Nueva División Académica
						</h5>
						<button type="button" on:click="{()=>{clear()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						
						<div class="row g-3">
							<div class="col-12">
								<label for="division" class="form-label">
									<i class="fas fa-graduation-cap"></i> Nombre
								</label>
								<input
									bind:this="{elementNameC}"
									bind:value="{newdivision.name}"
									id="division"
									type="text"
									class="form-control"
									autocomplete="off"
									placeholder="Ingrese el nombre de la división"
								/>
								{#each fbNameC as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
								{#if !verifyNameExistence}
									<div class="invalid-feedback">División académica existente.</div>
								{/if}
							</div>

							<div class="col-12">
								<label for="acronym" class="form-label">
									<i class="fas fa-graduation-cap"></i> Siglas
								</label>
								<input
									bind:this="{elementAcronymC}"
									bind:value="{newdivision.acronym}"
									id="acronym"
									type="text"
									class="form-control"
									autocomplete="off"
									placeholder="Ingrese el acrónimo de la división"
								/>
								{#each fbAcronymC as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
								{#if !verifyAcronymExistence}
									<div class="invalid-feedback">Siglas existentes.</div>
								{/if}
							</div>
						</div>
						
					</div>
					<div class="modal-footer">
						<button bind:this="{closemodalcreate}" on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
						<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
					</div>
				</form>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();checkUpdateValidation();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol2">
							<i class="fas fa-edit"></i> Editar División Académica
						</h5>
						<button on:click="{()=>{clear()}}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						<div class="row g-3">
							<div class="col-12">
								<label for="divisionu" class="form-label">
									<i class="fas fa-graduation-cap"></i> Nombre
								</label>
								<input
									bind:this="{elementNameU}"
									bind:value="{olddivision.name}"
									id="divisionu"
									type="text"
									class="form-control"
									placeholder="Ingrese el nombre de la división"
									autocomplete="off"
								/>
								{#each fbNameU as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
								{#if !verifyNameExistenceU}
									<div class="invalid-feedback">División académica existente.</div>
								{/if}
							</div>

							<div class="col-12">
								<label for="acronymu" class="form-label">
									<i class="fas fa-graduation-cap"></i> Siglas
								</label>
								<input
									bind:this="{elementAcronymU}"
									bind:value="{olddivision.acronym}"
									id="acronymu"
									type="text"
									class="form-control"
									placeholder="Ingres el acrónimo de la división"
									autocomplete="off"
								/>
								{#each fbAcronymU as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
								{#if !verifyAcronymExistenceU}
									<div class="invalid-feedback">Siglas existentes.</div>
								{/if}
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button on:click="{()=>{clear()}}" bind:this="{closemodalupdate}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
						<button type="submit" class="btn btn-primary" ><i class="fas fa-save"></i> Guardar</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
