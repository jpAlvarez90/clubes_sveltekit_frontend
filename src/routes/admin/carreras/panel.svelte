<script>
	import { onMount } from 'svelte';
	import axiosapi from './../../../utils/axiosapi';
    
    export let careers = [];
    export let divisions = [];
    export let levels = [];
	let newcareer = {
		name:"",
		acronym:"",
        id_ac_di: 0,
        id_ac_le: 0
	};

	let oldcareer = {
		id: 0,
		name: "",
		acronym: "",
        id_ac_di: 0,
        id_ac_le: 0
	};	


	const clearCareer = ()=>{
		newcareer = {
            name:"",
            id_ac_di: 0,
            id_ac_le: 0
        };	
	}

	const clearOldCareer = ()=>{
		oldcareer = {
            id:0,
            name:"",
            id_ac_di: 0,
            id_ac_le: 0
        };		
	}

	const getDivisions = async ()=>{
        axiosapi.doGet("/academic/division/get").then(res=>{
            console.log(res.data);
            divisions = res.data;
            
        }).catch((err)=>{
            console.log(err);
        })

    }

	const getLevels = async ()=>{
        axiosapi.doGet("/academic/level/get").then(res=>{
            console.log(res.data);
            levels = res.data;
            
        }).catch((err)=>{
            console.log(err);
        })

    }

	const getCareers = async ()=>{

		axiosapi.doGet("/career/get").then(res=>{
            console.log(res.data);
			careers = res.data;
			
		}).catch((err)=>{
			console.log(err);
		})


	}

	const getCareer = (id)=>{
		console.log(id)
		axiosapi.doGet("/career/get/"+id).then(res=>{	
            console.log(res.data)	
			oldcareer = res.data[0];
			
		}).catch((err)=>{
			console.log(err);
		})

	}

	const updateCareer = ()=>{
		console.log(oldcareer)
		let id = oldcareer.id
		console.log(id);
		axiosapi.doPut("/career/update/"+id,oldcareer).then(res=>{		
			console.log(res);
			Swal.fire({
				title: 'Actualizado',
				text: '¡La actualización se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			clearOldCareer()
			getCareers()
		}).catch((err)=>{
			console.log(err);
		})
	}

	const createCareer = ()=>{
        console.log(newcareer);
        
		axiosapi.doPost("/career/create",newcareer).then((res)=>{
			Swal.fire({
				title: 'Creado',
				text: '¡El registro se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			getCareers()
		}).catch((err)=>{
			console.log(err);
		})
	}

    const deleteCareer = (id)=>{
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
				
				axiosapi.doDelete("/career/delete/"+id).then((res)=>{
					console.log(res);
					getCareers()
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
		await getCareers().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
        await getDivisions()
        await getLevels()
		
		
	});
</script>

<main>
	<div style="background-color: #F8F9FA;" class="container-lg my-4 p-4 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3>Carreras</h3>
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
								<th>Carrera</th>
                                <th>Acrónimo</th>
                                <th>División académica</th>
								<th>Nivel académico</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each careers as c,i}
							<tr>
								<td>{i+1}</td>
								<td>{c.name}</td>
                                <td>{c.acronym}</td>
                                <td>{c.d_acronym}</td>
								<td>{c.l_name}</td>
								<td class="text-center">
									<div class="btn-group" role="group">
										<button on:click="{()=>getCareer(c.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-eye" />
										</button>
										<button on:click="{()=>deleteCareer(c.id)}" type="button" class="btn btn-outline-danger">
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
					<h5 class="modal-title" id="mol1">Nueva Carrera</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row c-3">
							<div class="col-12">
								<label for="nombre" class="form-label">Nombre</label>
								<input
                                    id="nombre"
									bind:value="{newcareer.name}"
									type="text"
									class="form-control"
								/>
							</div>
							<div class="col-12">
								<label for="acronimo" class="form-label">Acrónimo</label>
								<input
                                    id="acronimo"
									bind:value="{newcareer.acronym}"
									type="text"
									class="form-control"
								/>
							</div>
                            <div class="col-6">
								<label for="division" class="form-label">División Académica</label>
								<select bind:value="{newcareer.id_ac_di}" id="division" class="form-control">
                                    {#each divisions as d}
                                        <option value="{d.id}" >{d.acronym}</option>     
                                    {/each}
                                </select>
                            </div>
                            <div class="col-6">
								<label for="nivel" class="form-label">Nivel Académico</label>
								<select bind:value="{newcareer.id_ac_le}" id="nivel" class="form-control">
                                    {#each levels as level}
                                        <option value="{level.id}" >{level.name}</option>     
                                    {/each}
                                </select>
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearCareer()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{createCareer();clearCareer()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2">Editar Carrera</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row c-3">
							<div class="col-12">
								<label for="nombreu" class="form-label">Nombre</label>
								<input
                                    id="nombreu"
									bind:value="{oldcareer.name}"
									type="text"
									class="form-control"
								/>
							</div>
							<div class="col-12">
								<label for="acronimou" class="form-label">Acrónimo</label>
								<input
                                    id="acronimou"
									bind:value="{oldcareer.acronym}"
									type="text"
									class="form-control"
								/>
							</div>
                            <div class="col-6">
								<label for="divisionu" class="form-label">División Académica</label>
								<select bind:value="{oldcareer.id_ac_di}" id="divisionu" class="form-control">
                                    {#each divisions as d}
                                        <option value="{d.id}" >{d.acronym}</option>     
                                    {/each}
                                </select>
                            </div>
                            <div class="col-6">
								<label for="nivelu" class="form-label">Nivel Académico</label>
								<select bind:value="{oldcareer.id_ac_le}" id="nivelu" class="form-control">
                                    {#each levels as level}
                                        <option value="{level.id}" >{level.name}</option>     
                                    {/each}
                                </select>
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearOldCareer()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{updateCareer()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
