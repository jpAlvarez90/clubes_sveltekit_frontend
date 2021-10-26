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

    let instructors = {
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
	let newinstructor = {
		name: "",
		first_last_name: "",
        second_last_name: "",
        email: "",
        personal_email: "",
        phone: "",
        cellphone: "",
        password: "Beltran3264"
	};
	let oldinstructor = {
		id:0,
		name:"",
		acronym:""
	};

	const clear = ()=>{
        newinstructor = {
            name: "",
            first_last_name: "",
            second_last_name: "",
            email: "",
            personal_email: "",
            phone: "",
            cellphone: "",
            password: "Beltran3264"
        }
		// oldinstructor = {name:"",acronym:""};	
	}

	const getInstructors = ()=>{
		axiosapi.doGet("/instructor/get").then(res=>{
			instructors = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getInstructorsBySearch = ()=>{
		searching = true
		let endpoint = `/instructor/get`
		if(instructors.search != undefined && instructors.search != ""){
			endpoint = `/instructor/get?search=${instructors.search}`
			searched = true
			wordSearched = instructors.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getInstructorsByPage = (page)=>{
		let endpoint = `/instructor/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			instructors = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getInstructorsByNextPage = ()=>{
		getInstructorsByPage(instructors.page+1)
	}

	const getInstructorsByPreviousPage = ()=>{
		getInstructorsByPage(instructors.page-1)
	}

	const getInstructor =  (id)=>{
		axiosapi.doGet("/instructor/get/"+id).then(res=>{		
			oldinstructor = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const updateInstructor = ()=>{
		axiosapi.doPut("/instructor/update/"+oldinstructor.id,oldinstructor).then(res=>{		
			swal.con('success',TITUPDATED,TXTUPDATED)
			getInstructors()
		}).catch((err)=>{
			swal.err()
		})
	}

	const createInstructor = ()=>{
        console.log(newinstructor);
		axiosapi.doPost("/instructor/create",newinstructor).then((res)=>{
			swal.con('success',TITCREATED,TXTCREATED)
			getInstructors()
		}).catch((err)=>{
			swal.err()
		})
	}
	
    const deleteInstructor = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
			if(result.isConfirmed){
				axiosapi.doDelete("/user/delete/"+id).then((res)=>{
					getInstructors()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
			}
		})
    }

	onMount(()=>{getInstructors()})
</script>

<main>
	<div style="background-color: #F8F9FA;" class="container-lg my-4 p-4 rounded border">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-user-tie"></i> Instructores</h3>
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
									<button on:click="{()=>getInstructors()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input bind:value="{instructors.search}" type="text" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getInstructorsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if instructors.rows.length == 0}
					<Notrecords />
				{:else}
				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<caption>
							Mostrando {instructors.offset+1} - {
								instructors.offset+instructors.limit>instructors.totalRecords?instructors.totalRecords:instructors.offset+instructors.limit
								} de {instructors.totalRecords} registros totales.
						</caption>
						<thead>
							<tr class="text-center">
								<th>No.</th>
								<th>Nombre</th>
								<th>Primer Apellido</th>
								<th>Segundo Apellido</th>
                                <th>Opciones</th>
							</tr>
						</thead>
						<tbody>
                            {#each instructors.rows as ins,i}
							<tr class="text-center">
								<td>{i+1}</td>
								<td>{ins.name}</td>
								<td>{ins.first_last_name}</td>
                                <td>{ins.second_last_name}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click="{()=>getInstructor(ins.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-edit"></i>
										</button>
										<button on:click="{()=>deleteInstructor(ins.id_user)}" type="button" class="btn btn-outline-danger">
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
						{#if instructors.page === 1}
							<li class="page-item disabled">
								<a class="page-link">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<a on:click="{()=>getInstructorsByPreviousPage()}" class="page-link" href="#">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: instructors.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if instructors.page == item}
								<li class="page-item active" aria-current="page">
									<a class="page-link" href="#">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<a class="page-link" 
									on:click="{()=>getInstructorsByPage(item)}" 
									href="#"
									>{item}</a>
								</li>	
							{/if}
						{/each}
						{#if instructors.page === instructors.totalPages}
							<li class="page-item disabled">
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<a on:click="{()=>getInstructorsByNextPage()}" class="page-link" href="#">Siguiente</a>
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
				<div class="modal-header">
					<h5 class="modal-title" id="mol1">
						<i class="fas fa-plus-circle" /> Nueva Instructor
					</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row g-3 mb-3">
							<div class="col-4">
								<label for="name" class="form-label">
                                    <i class="fas fa-user"></i> Nombre
                                </label>
								<input
									bind:value="{newinstructor.name}"
									id="name"
                                    placeholder="Ingresa tu nombre"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
							</div>
							<div class="col-4">
								<label for="firstlastname" class="form-label">
                                    <i class="fas fa-user"></i> Primer apellido
                                </label>
								<input
									bind:value="{newinstructor.first_last_name}"
									id="firstlastname"
                                    placeholder="Ingresa tu primer apellido"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
							</div>
							<div class="col-4">
								<label for="secondlastname" class="form-label">
                                    <i class="fas fa-user"></i> Segundo apellido
                                </label>
								<input
									bind:value="{newinstructor.second_last_name}"
									id="secondlastname"
                                    placeholder="Ingresa tu segundo apellido"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
							</div>
						</div>
                        <div class="row g-3 mb-3">
                            <div class="col-6">
								<label for="email" class="form-label">
                                    <i class="fas fa-envelope"></i> Correo electrónico institucional
                                </label>
								<input
									bind:value="{newinstructor.email}"
									id="email"
                                    placeholder="Ingresa tu correo electrónico institucional"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
                            </div>
                            <div class="col-6">
								<label for="personalemail" class="form-label">
                                    <i class="fas fa-envelope"></i> Correo electrónico personal
                                </label>
								<input
									bind:value="{newinstructor.personal_email}"
									id="personalemail"
                                    placeholder=" Ingresa tu correo electrónico personal"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
                            </div>
                        </div>
                        <div class="row g-3 mb-3">
                            <div class="col-6">
								<label for="phone" class="form-label">
                                    <i class="fas fa-phone"></i> Teléfono fijo
                                </label>
								<input
									bind:value="{newinstructor.phone}"
									id="phone"
                                    placeholder="Ingresa tu teléfono fijo"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
                            </div>
                            <div class="col-6">
								<label for="cellphone" class="form-label">
                                    <i class="fas fa-phone"></i> Teléfono móvil
                                </label>
								<input
									bind:value="{newinstructor.cellphone}"
									id="cellphone"
                                    placeholder="Ingresa tu teléfono móvil"
									type="text"
									class="form-control"
                                    autocomplete="off"
								/>
                            </div>
                        </div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cerrar</button>
					<button on:click="{()=>{createInstructor();clear()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>
				</div>
			</div>
		</div>
	</div>
</main>
