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
		totalPages: 0,
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

	const clear = ()=>{
		newdivision = {name:"",acronym:""};	
		olddivision = {name:"",acronym:""};	
	}

	const getDivisions = async ()=>{
		axiosapi.doGet("/academic/division/test/get").then(res=>{
			divisions = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getDivisionsBySearch = async ()=>{
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

	const getDivisionsByPage = async (page)=>{
		let endpoint = `/academic/division/test/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		console.log("ENDP: ",endpoint);
		axiosapi.doGet(endpoint).then(res=>{
			divisions = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getDivisionsByNextPage = async ()=>{
		let page = divisions.page+1
		getDivisionsByPage(page)
	}

	const getDivisionsByPreviousPage = async ()=>{
		let page = divisions.page-1
		getDivisionsByPage(page)
	}

	const getDivision =  (id)=>{
		console.log("OBTENIENDO DIV: ",id);
		axiosapi.doGet("/academic/division/get/"+id).then(res=>{		
			olddivision = res.data;
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

	onMount(async ()=>{
		await getDivisions().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
	})
</script>

<main>
	<div style="background-color: #F8F9FA;" class="container-lg my-4 p-4 rounded border">
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
								<input bind:value="{divisions.search}" type="text" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
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
								<th>División académica</th>
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
						{#if divisions.page-1 === 0}
							<li class="page-item disabled">
								<a class="page-link">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<a on:click="{()=>getDivisionsByPreviousPage()}" class="page-link" href="#">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: divisions.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if divisions.page == item}
								<li class="page-item active" aria-current="page">
									<a class="page-link" href="#">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<a class="page-link" 
									on:click="{()=>getDivisionsByPage(item)}" 
									href="#"
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if divisions.page === divisions.totalPages}
							<li class="page-item disabled">
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
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
				<div class="modal-header">
					<h5 class="modal-title" id="mol1">
						<i class="fas fa-plus-circle" /> Nueva División Académica
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-12">
								<label for="division" class="form-label">Nombre</label>
								<input
									bind:value="{newdivision.name}"
									id="division"
									type="text"
									class="form-control"
								/>
							</div>

							<div class="col-12">
								<label for="acronym" class="form-label">Siglas</label>
								<input
									bind:value="{newdivision.acronym}"
									id="acronym"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cerrar</button>
					<button on:click="{()=>{createDivision();clear()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2">
						<i class="fas fa-edit"></i> Editar División Académica
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-12">
								<label for="divisionu" class="form-label">Nombre</label>
								<input
									bind:value="{olddivision.name}"
									id="divisionu"
									type="text"
									class="form-control"
								/>
							</div>

							<div class="col-12">
								<label for="acronymu" class="form-label">Siglas</label>
								<input
									bind:value="{olddivision.acronym}"
									id="acronymu"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cerrar</button>
					<button on:click="{()=>{updateDivision();clear()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
