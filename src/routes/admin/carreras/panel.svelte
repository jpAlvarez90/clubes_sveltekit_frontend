<script>
	import { onMount } from 'svelte';
	import axiosapi from './../../../utils/axiosapi';
    
    export let levels = [];
	let newlevel = {
		name:""
	};
	let oldlevel = {
		id:0,
		name:""
	};	


	const clearLevel = ()=>{
		newlevel = {name:""};	
	}

	const clearOldLevel = ()=>{
		oldlevel = {name:""};	
	}

	const getLevels = async ()=>{

		axiosapi.doGet("/academic/level/get").then(res=>{
			levels = res.data;
			
		}).catch((err)=>{
			console.log(err);
		})


	}

	const getLevel =  (id)=>{
		console.log(id)
		axiosapi.doGet("/academic/level/get/"+id).then(res=>{		
			oldlevel = res.data[0];
			
		}).catch((err)=>{
			console.log(err);
		})

	}

	const updateLevel = ()=>{
		console.log(oldlevel)
		let id = oldlevel.id
		console.log(id);
		axiosapi.doPut("/academic/level/update/"+id,oldlevel).then(res=>{		
			console.log(res);
			Swal.fire({
				title: 'Actualizado',
				text: '¡La actualización se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			clearOldLevel()
			getLevels()
		}).catch((err)=>{
			console.log(err);
		})
	}

	const createLevel = ()=>{
		axiosapi.doPost("/academic/level/create",newlevel).then((res)=>{
			Swal.fire({
				title: 'Creado',
				text: '¡El registro se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			getLevels()
		}).catch((err)=>{
			console.log(err);
		})
	}

    const deleteLevel = (id)=>{
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
				
				axiosapi.doDelete("/academic/level/delete/"+id).then((res)=>{
					console.log(res);
					getLevels()
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
		await getLevels().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
		
		
	});
</script>

<main>
	<div style="background-color: #F8F9FA;" class="container-lg my-4 p-4 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3>Niveles Académicos</h3>
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
								<th>Nivel académico</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each levels as d,i}
							<tr>
								<td>{i+1}</td>
								<td>{d.name}</td>
								<td class="text-center">
									<div class="btn-group" role="group">
										<button on:click="{()=>getLevel(d.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-eye" />
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
									bind:value="{newlevel.name}"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearLevel()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{createLevel();clearLevel()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
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
									bind:value="{oldlevel.name}"
									type="text"
									class="form-control"
								/>
							</div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearOldLevel()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{updateLevel()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
