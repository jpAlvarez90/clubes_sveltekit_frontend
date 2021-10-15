<script>
	import { onMount } from 'svelte';
	import axiosapi from './../../../utils/axiosapi';
    
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


	const clearDivision = ()=>{
		newdivision = {name:"",acronym:""};	
	}

	const clearOldDivision = ()=>{
		olddivision = {name:"",acronym:""};	
	}

	const getDivisions = async ()=>{

		axiosapi.doGet("/academic/division/get").then(res=>{
			divisions = res.data;
			
		}).catch((err)=>{
			console.log(err);
		})


	}

	const getDivision =  (id)=>{
		console.log(id)
		axiosapi.doGet("/academic/division/get/"+id).then(res=>{		
			olddivision = res.data[0];
			
		}).catch((err)=>{
			console.log(err);
		})

	}

	const updateDivision = ()=>{
		console.log(olddivision)
		let id = olddivision.id
		console.log(id);
		axiosapi.doPut("/academic/division/update/"+id,olddivision).then(res=>{		
			console.log(res);
			Swal.fire({
				title: 'Actualizado',
				text: '¡La actualización se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			clearOldDivision()
			getDivisions()
		}).catch((err)=>{
			console.log(err);
		})
	}

	const createDivision = ()=>{
		axiosapi.doPost("/academic/division/create",newdivision).then((res)=>{
			Swal.fire({
				title: 'Creado',
				text: '¡El registro se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			getDivisions()
		}).catch((err)=>{
			console.log(err);
		})
	}

    const deleteDivision = (id)=>{
        Swal.fire({
            title: '¿Está seguro que desea eliminar este registro?',
            //text: "¿Seguro que desea eliminar este registro?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0D6EFD',
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#6C757D',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(id)
				
				axiosapi.doDelete("/academic/division/delete/"+id).then((res)=>{
					console.log(res);
					getDivisions()
					Swal.fire({
						title: 'Eliminado',
						text: 'El registro se ha eliminado exitosamente.',
						confirmButtonColor: '#0D6EFD',
						icon: 'success'
					})
				}).catch((err)=>{
					console.log(err);
				})


            }
        })
    }

	

    const sweet = ()=>{
        Swal.fire({
            title: '¿Está seguro que desea eliminar este registro?',
            //text: "¿Seguro que desea eliminar este registro?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0D6EFD',
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#6C757D',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El registro se ha eliminado exitosamente.',
                    confirmButtonColor: '#0D6EFD',
                    icon: 'success'
                })
            }
        })
    }


	onMount(async ()=>{
		await getDivisions().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
		
		
	});
</script>

<main>
	<div style="background-color: #F8F9FA;" class="container-lg my-4 p-4 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3>Divisiones Académicas</h3>
			</div>
			<div class="col">
				<button
					class="btn btn-outline-success float-end rounded-pill align-middle"
					data-bs-toggle="modal"
					data-bs-target="#mo1"
				>
					<span>Nuevo</span>
					<i class="fas fa-plus-circle" />
				</button>
			</div>
		</div>
		<hr />
		<div class="row mb-3">
			<div class="col">
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
											<i class="fas fa-eye" />
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
			</div>
		</div>
	</div>

	<!-- Modal Create -->
	<div class="modal fade" id="mo1" tabindex="-1" aria-labelledby="mol1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol1">Nueva División Académica</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-12">
								<label for="address" class="form-label">Nombre</label>
								<input
									bind:value="{newdivision.name}"
									type="text"
									class="form-control"
								/>
							</div>

							<div class="col-12">
								<label for="address2" class="form-label">Siglas</label>
								<input
									bind:value="{newdivision.acronym}"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearDivision()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{createDivision();clearDivision()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2">Editar División Académica</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-12">
								<label for="address" class="form-label">Nombre</label>
								<input
									bind:value="{olddivision.name}"
									type="text"
									class="form-control"
								/>
							</div>

							<div class="col-12">
								<label for="address2" class="form-label">Siglas</label>
								<input
									bind:value="{olddivision.acronym}"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearOldDivision()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{updateDivision()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
