<script>
	import { onMount } from 'svelte';
	import axiosapi from './../../../utils/axiosapi';
    
    export let grades = [];
    export let terms = [];
    export let levels = [];
	let newgrade = {
		grade:0,
        id_qu_te: 0,
        id_ac_le: 0
	};

	let oldgrade = {
		id:0,
		grade:0,
        id_qu_te: 0,
        id_ac_le: 0
	};	


	const clearGrade = ()=>{
		newgrade = {
            grade:0,
            id_qu_te: 0,
            id_ac_le: 0
        };	
	}

	const clearOldGrade = ()=>{
		oldgrade = {
            id:0,
            grade:0,
            id_qu_te: 0,
            id_ac_le: 0
        };		
	}

	const getTerms = async ()=>{
        axiosapi.doGet("/term/get").then(res=>{
            console.log(res.data);
            terms = res.data;
            
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

	const getGrades = async ()=>{

		axiosapi.doGet("/grade/get").then(res=>{
            console.log(res.data);
			grades = res.data;
			
		}).catch((err)=>{
			console.log(err);
		})


	}

	const getGrade =  (id)=>{
		console.log(id)
		axiosapi.doGet("/grade/get/"+id).then(res=>{	
            console.log(res.data)	
			oldgrade = res.data[0];
			
		}).catch((err)=>{
			console.log(err);
		})

	}

	const updateGrade = ()=>{
		console.log(oldgrade)
		let id = oldgrade.id
		console.log(id);
		axiosapi.doPut("/grade/update/"+id,oldgrade).then(res=>{		
			console.log(res);
			Swal.fire({
				title: 'Actualizado',
				text: '¡La actualización se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			clearOldGrade()
			getGrades()
		}).catch((err)=>{
			console.log(err);
		})
	}

	const createGrade = ()=>{
        console.log(newgrade);
        
		axiosapi.doPost("/grade/create",newgrade).then((res)=>{
			Swal.fire({
				title: 'Creado',
				text: '¡El registro se ha completado exitosamente!',
				confirmButtonColor: '#0D6EFD',
				icon: 'success'
			})
			getGrades()
		}).catch((err)=>{
			console.log(err);
		})
	}

    const deleteGrade = (id)=>{
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
				
				axiosapi.doDelete("/grade/delete/"+id).then((res)=>{
					console.log(res);
					getGrades()
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
		await getGrades().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
        await getTerms()
        await getLevels()
		
		
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3>Grados Cuatrimestrales</h3>
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
								<th>Grado cuatrimestral</th>
                                <th>Plazo cuatrimestral</th>
                                <th>Nivel académico</th>
								<th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each grades as g,i}
							<tr>
								<td>{i+1}</td>
								<td>{g.grade}</td>
                                <td>{g.t_term}</td>
                                <td>{g.l_name}</td>
								<td class="text-center">
									<div class="btn-group" role="group">
										<button on:click="{()=>getGrade(g.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-eye" />
										</button>
										<button on:click="{()=>deleteGrade(g.id)}" type="button" class="btn btn-outline-danger">
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
					<h5 class="modal-title" id="mol1">Nuevo Grado Cuatrimestral</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-2">
								<label for="grado" class="form-label">Grado</label>
								<input
                                    id="grado"
									bind:value="{newgrade.grade}"
									type="text"
									class="form-control"
								/>
							</div>
                            <div class="col-5">
								<label for="plazo" class="form-label">Plazo</label>
								<select bind:value="{newgrade.id_qu_te}" id="plazo" class="form-control">
                                    {#each terms as term}
                                        <option value="{term.id}" >{term.term}</option>     
                                    {/each}
                                </select>
                            </div>
                            <div class="col-5">
								<label for="nivel" class="form-label">Nivel Académico</label>
								<select bind:value="{newgrade.id_ac_le}" id="plazo" class="form-control">
                                    {#each levels as level}
                                        <option value="{level.id}" >{level.name}</option>     
                                    {/each}
                                </select>
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearGrade()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{createGrade();clearGrade()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2">Editar Grado Cuatrimestral</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3">
							<div class="col-2">
								<label for="grado" class="form-label">Grado</label>
								<input
                                    id="grado"
									bind:value="{oldgrade.grade}"
									type="text"
									class="form-control"
								/>
							</div>
                            <div class="col-5">
								<label for="plazou" class="form-label">Plazo</label>
								<select bind:value="{oldgrade.id_qu_te}" id="plazou" class="form-control">
                                    {#each terms as term}
                                        <option value="{term.id}" >{term.term}</option>     
                                    {/each}
                                </select>
                            </div>
                            <div class="col-5">
								<label for="nivelu" class="form-label">Nivel Académico</label>
								<select bind:value="{oldgrade.id_ac_le}" id="nivelu" class="form-control">
                                    {#each levels as level}
                                        <option value="{level.id}" >{level.name}</option>     
                                    {/each}
                                </select>
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearOldGrade()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
					<button on:click="{()=>{updateGrade()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal">Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
