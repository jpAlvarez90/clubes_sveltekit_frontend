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

    export let divisions = [];
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
		axiosapi.doGet("/academic/division/get").then(res=>{
			divisions = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getDivision =  (id)=>{
		axiosapi.doGet("/academic/division/get/"+id).then(res=>{		
			olddivision = res.data[0];
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
				{#if divisions.length == 0}
					<Notrecords />
				{:else}
				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<thead>
							<tr class="text-center">
								<th>No.</th>
								<th>División académica</th>
								<th>Siglas</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each divisions as d,i}
							<tr>
								<td>{i+1}</td>
								<td>{d.name}</td>
								<td>{d.acronym}</td>
								<td class="text-center">
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
