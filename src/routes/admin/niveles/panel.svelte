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

    let levels = {
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
	let newlevel = {
		name:""
	};
	let oldlevel = {
		id:0,
		name:""
	};	
	let closemodalcreate
	let closemodalupdate


	const getLevels = ()=>{
		axiosapi.doGet("/academic/level/get").then(res=>{
			levels.rows = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getLevelsBySearch = ()=>{
		// searching = true
		// let endpoint = `/academic/level/get`
		// if(levels.search != undefined && levels.search != ""){
		// 	endpoint = `/academic/level/get?search=${levels.search}`
		// 	searched = true
		// 	wordSearched = levels.search
		// }else{
		// 	endpoint = `/academic/level/get`
		// 	searched = false
		// }
		// axiosapi.doGet(endpoint).then(res=>{
		// 	levels = res.data;
		// }).catch((err)=>{
		// 	swal.err()
		// }).finally(()=>{
		// 	searching = false
		// })
	}

	const getLevelsByPage = (page)=>{
		// let endpoint = `/academic/level/get?page=${page}`
		// if(searched){
		// 	endpoint += `&search=${wordSearched}`
		// }
		// axiosapi.doGet(endpoint).then(res=>{
		// 	divisions = res.data;
		// }).catch((err)=>{
		// 	swal.err()
		// })
	}

	const getLevelsByNextPage = ()=>{
		getLevelsByPage(divisions.page+1)
	}

	const getLevelsByPreviousPage = ()=>{
		getLevelsByPage(divisions.page-1)
	}

	const getLevel = (id)=>{
		axiosapi.doGet("/academic/level/get/"+id).then(res=>{		
			oldlevel = res.data[0];		
		}).catch((err)=>{
			swal.err()
		})
	}

	const updateLevel = ()=>{
		axiosapi.doPut("/academic/level/update/"+oldlevel.id,oldlevel).then(res=>{		
			swal.con('success',TITUPDATED,TXTUPDATED)
			getLevels()
		}).catch((err)=>{
			swal.err()
		})
	}

	const createLevel = ()=>{
		axiosapi.doPost("/academic/level/create",newlevel).then((res)=>{
			swal.con('success',TITCREATED,TXTCREATED)
			getLevels()
		}).catch((err)=>{
			swal.err()
		})
	}

    const deleteLevel = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
            if (result.isConfirmed) {
				axiosapi.doDelete("/academic/level/delete/"+id).then((res)=>{
					getLevels()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
            }
		})
    }

	const checkCreateValidation = ()=>{
		let ok = true
		ok = validNameC(elementNameC) && ok
		if(ok){
			createLevel()
			closemodalcreate.click()
		}
	}

	const checkUpdateValidation = ()=>{
		let ok = true
		ok = validNameU(elementNameU) && ok
		if(ok){
			updateLevel()
			closemodalupdate.click()
		}
	}

	const clear = ()=>{
		let elementClass = "form-control"

		elementNameC.value = ""
		newlevel.name = ""
		elementNameC.className = `${elementClass}`
		fbNameC = []

		elementNameU.value = ""
		oldlevel.name = ""
		elementNameU.className = `${elementClass}`
		fbNameU = []
	}

	let elementNameC
	let fbNameC = []

	let elementNameU
	let fbNameU = []

	const validNameC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNameC = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-Z]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameC.push("El nombre no debe contener minúsculas, números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameC.push("El nombre contener de 3 a 45 caracteres.")
		}
		
		return validated
	}

	const validNameU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbNameU = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-Z]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre no debe contener minúsculas, números o caracteres especiales.")
		}
		if(v.length < 3 || v.length > 45){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbNameU.push("El nombre contener de 3 a 45 caracteres.")
		}
		
		return validated
	}

	const listenerValidity = ()=>{
		elementNameC.addEventListener('input',(e)=>{validNameC(e.target)})
		elementNameU.addEventListener('input',(e)=>{validNameU(e.target)})
	}

	onMount(()=>{
		getLevels()
		listenerValidity()
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-graduation-cap"></i> Niveles Académicos</h3>
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
									<button on:click="{()=>getLevels()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getLevelsBySearch()}}}" bind:value="{levels.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getLevelsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if levels.rows.length == 0}
					<Notrecords />
				{:else}

				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<caption>
							Mostrando {levels.offset+1} - {
								levels.offset+levels.limit>levels.totalRecords?levels.totalRecords:levels.offset+levels.limit
								} de {levels.totalRecords} registros totales.
						</caption>
						<thead>
							<tr class="text-center">
								<th>No.</th>
								<th>Nivel Académico</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each levels.rows as d,i}
							<tr class="text-center">
								<td>{i+1}</td>
								<td>{d.name}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click="{()=>getLevel(d.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-edit" />
										</button>
										<button on:click="{()=>deleteLevel(d.id)}" type="button" class="btn btn-outline-danger">
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
						{#if levels.page === 1}
							<li class="page-item disabled">
								<a class="page-link">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<a on:click="{()=>getLevelsByPreviousPage()}" class="page-link" href="#">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: levels.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if levels.page == item}
								<li class="page-item active" aria-current="page">
									<a class="page-link" href="#">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<a class="page-link" 
									on:click="{()=>getLevelsByPage(item)}" 
									href="#"
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if levels.page === levels.totalPages}
							<li class="page-item disabled">
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<a on:click="{()=>getLevelsByNextPage()}" class="page-link" href="#">Siguiente</a>
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
							<i class="fas fa-graduation-cap"></i> Nuevo Nivel Académico
						</h5>
						<button type="button" on:click="{()=>{clear()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						
							<div class="row g-3">
								<div class="col-12">
									<label for="level" class="form-label">
										<i class="fas fa-graduation-cap"></i> Nombre
									</label>
									<input
										bind:this="{elementNameC}"
										bind:value="{newlevel.name}"
										id="level"
										type="text"
										class="form-control"
										autocomplete="off"
										placeholder="Ingrese el nombre del nivel académico"
									/>
									{#each fbNameC as item}
										<div class="invalid-feedback">
											{item}
										</div>
									{/each}
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
							<i class="fas fa-edit"></i> Editar Nivel Académico
						</h5>
						<button on:click="{()=>{clear()}}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
						<div class="row g-3">
							<div class="col-12">
								<label for="levelu" class="form-label">
									<i class="fas fa-graduation-cap"></i> Nombre
								</label>
								<input
									bind:this="{elementNameU}"
									bind:value="{oldlevel.name}"
									id="levelu"
									type="text"
									class="form-control"
									placeholder="Ingrese el nombre del nivel académico"
									autocomplete="off"
								/>
								{#each fbNameU as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
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
