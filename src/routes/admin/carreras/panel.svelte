<script>
	import Notrecords from './../../../components/notrecords.svelte'
	import { onMount } from 'svelte';
	import axiosapi from './../../../utils/axiosapi';
	
    
    export let careers = [];
    export let divisions = [];
    export let levels = [];
	let newcareer = {
		name:"",
		acronym:"",
        id_ac_di: '',
        id_ac_le: ''
	};

	let oldcareer = {
		id: 0,
		name: "",
		acronym: "",
        id_ac_di: '',
        id_ac_le: ''
	};
	
	let nameFlag = false
	let nameElement
	let nameFeedback = []
	let acronymFlag = false
	let acronymElement
	let acronymFeedback = []
	let divisionFlag = false
	let divisionElement
	let divisionFeedback = []
	let levelFlag = false
	let levelElement
	let levelFeedback = []

	let oldnameFlag = true
	let oldnameElement
	let oldnameFeedback = []
	let oldacronymFlag = true
	let oldacronymElement
	let oldacronymFeedback = []
	let olddivisionFlag = true
	let olddivisionElement
	let olddivisionFeedback = []
	let oldlevelFlag = true
	let oldlevelElement
	let oldlevelFeedback = []

	const clearCareer = ()=>{
		newcareer = {
            name:"",
            id_ac_di: '',
            id_ac_le: ''
        };	
		let elementClass = "form-control"

		nameFlag = false
		nameElement.value = ""
		nameElement.className = elementClass
		nameFeedback = []
		acronymFlag = false
		acronymElement.value = ""
		acronymElement.className = elementClass
		acronymFeedback = []
		divisionFlag = false
		divisionElement.value = ""
		divisionElement.className = elementClass
		divisionFeedback = []
		levelFlag = false
		levelElement.value = ""
		levelElement.className = elementClass
		levelFeedback = []


	}

	const clearOldCareer = ()=>{
		oldcareer = {
            id:0,
            name:"",
            id_ac_di: '',
            id_ac_le: ''
        };		

		let elementClass = "form-control"

		oldnameFlag = true
		oldnameElement.value = ""
		oldnameElement.className = elementClass
		oldnameFeedback = []
		oldacronymFlag = true
		oldacronymElement.value = ""
		oldacronymElement.className = elementClass
		oldacronymFeedback = []
		olddivisionFlag = true
		olddivisionElement.value = ""
		olddivisionElement.className = elementClass
		olddivisionFeedback = []
		oldlevelFlag = true
		oldlevelElement.value = ""
		oldlevelElement.className = elementClass
		oldlevelFeedback = []
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

	const onlyLetters = (value) => {
		let regex = new RegExp('^[A-ZÁÉÍÓÚÑ ]+$', 'i');
		let resp = regex.test(value)
		if(resp){
			return true
		}else{
			return false
		}
	}

	const validName = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		nameFeedback = []
		target.className = elementClass + ' is-valid'

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			nameFeedback.push("Completa el campo")
		}
		if(!onlyLetters(value)){
			validated = false
			target.className = elementClass + ' is-invalid'
			nameFeedback.push("Introduzca solo letras")
		}
		if(value.length > 200){
			validated = false
			target.className = elementClass + ' is-invalid'
			nameFeedback.push("La carrera debe tener máximo 200 caracteres")
		}
		
		return validated
	}

	const validAcronym = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		acronymFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("Completa el campo")
		}
		if(!onlyLetters(value)){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("Introduzca solo letras")
		}
		if(value.length > 10){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("El acrónimo debe tener máximo 10 caracteres")
		}
		
		return validated
	}

	const validDivision = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		divisionFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			divisionFeedback.push("Completa el campo")
		}
		return validated
	}

	const validLevel = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		levelFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			levelFeedback.push("Completa el campo")
		}
		return validated
	}

	const validoldName = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		oldnameFeedback = []
		target.className = elementClass + ' is-valid'

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			oldnameFeedback.push("Completa el campo")
		}
		if(!onlyLetters(value)){
			validated = false
			target.className = elementClass + ' is-invalid'
			oldnameFeedback.push("Introduzca solo letras")
		}
		if(value.length > 200){
			validated = false
			target.className = elementClass + ' is-invalid'
			oldnameFeedback.push("La carrera debe tener máximo 200 caracteres")
		}
		
		return validated
	}

	const validoldAcronym = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		acronymFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("Completa el campo")
		}
		if(!onlyLetters(value)){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("Introduzca solo letras")
		}
		if(value.length > 10){
			validated = false
			target.className = elementClass + ' is-invalid'
			acronymFeedback.push("El acrónimo debe tener máximo 10 caracteres")
		}
		
		return validated
	}

	const validoldDivision = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		divisionFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			divisionFeedback.push("Completa el campo")
		}
		return validated
	}

	const validoldLevel = (target) => {
		let validated = true
		let value = target.value
		let elementClass = 'form-control'
		levelFeedback = []
		target.className = elementClass + ' is-valid'
		

		if(!value){
			validated = false
			target.className = elementClass + ' is-invalid'
			levelFeedback.push("Completa el campo")
		}
		return validated
	}

	const listenerValidity = () => {
		nameElement.addEventListener('input', (e) => {
			nameFlag = validName(e.target) 
		})
		acronymElement.addEventListener('input', (e) => {
			acronymFlag = validAcronym(e.target)
		})
		divisionElement.addEventListener('change', (e) => {
			divisionFlag = validDivision(e.target)
		})
		levelElement.addEventListener('change', (e) => {
			levelFlag = validLevel(e.target)
		})

		oldnameElement.addEventListener('input', (e) => {
			oldnameFlag = validoldName(e.target) 
		})
		oldacronymElement.addEventListener('input', (e) => {
			oldacronymFlag = validoldAcronym(e.target)
		})
		olddivisionElement.addEventListener('change', (e) => {
			olddivisionFlag = validoldDivision(e.target)
		})
		oldlevelElement.addEventListener('change', (e) => {
			oldlevelFlag = validoldLevel(e.target)
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




	onMount(()=>{
		getCareers().then(()=>{
			//document.getElementById('bind-datatable').click()
		})
        getDivisions()
        getLevels()
		listenerValidity()
		
		
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-graduation-cap"></i> Carreras</h3>
			</div>
			<div class="col">
				<button
					class="btn btn-outline-success float-end rounded-pill align-middle"
					data-bs-toggle="modal"
					data-bs-target="#mo1"
				>
					<i class="fas fa-plus-circle"></i>
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
								<!--{#if searched}
									<button on:click="{()=>getDivisions()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}-->
								<input type="text" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button class="btn btn-outline-primary" type="button" id="button-search">
									<!--{#if searching}
										<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
										<span class="visually-hidden">Loading...</span>
									{:else}
										<i class="fas fa-search"></i>
									{/if}-->
									<i class="fas fa-search"></i>
								</button>
							</div>
						</div>
					</div>
				</div>

				{#if careers.length == 0}
					<Notrecords/>
				{:else}
					<div class="table-responsive my-2">
						<table id="filter-table" class="table table-hover table-striped">
							<caption>
								<!--Mostrando {careers.offset+1} - {
									careers.offset+careers.limit>careers.totalRecords?careers.totalRecords:careers.offset+careers.limit
									} de {careers.totalRecords} registros totales.-->

								Mostrando 1 - 3 de 11 registros totales.
							</caption>	
							<thead>
								<tr class="text-center">
									<th>No.</th>
									<th>Carrera</th>
									<th>Acrónimo</th>
									<th>División Académica</th>
									<th>Nivel Académico</th>
									<th>Opciones</th>
								</tr>
							</thead>
							<tbody>
								{#each careers as c,i}
								<tr class="text-center">
									<td>{i+1}</td>
									<td>{c.name}</td>
									<td>{c.acronym}</td>
									<td>{c.d_acronym}</td>
									<td>{c.l_name}</td>
									<td>
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

					<!--<nav aria-label="...">
						<ul class="pagination justify-content-end">
							{#if careers.page-1 === 0}
								<li class="page-item disabled">
									<a class="page-link">Anterior</a>
								</li>							
							{:else}
								<li class="page-item">
									<a on:click="{()=>getCareersByPreviousPage()}" class="page-link" href="#">Anterior</a>
								</li>
							{/if}
							{#each Array.from({ length: careers.totalPages }, (_, i) => 1 + (i * 1)) as item}
								{#if careers.page == item}
									<li class="page-item active" aria-current="page">
										<a class="page-link" href="#">{item}</a>
									</li>	
								{:else}
									<li class="page-item" aria-current="page">
										<a class="page-link" 
										on:click="{()=>getCareersByPage(item)}" 
										href="#"
										>{item}</a>
									</li>	
								{/if}
							
							{/each}
							{#if careers.page === careers.totalPages}
								<li class="page-item disabled">
									<a class="page-link">Siguiente</a>
								</li>							
							{:else}
								<li class="page-item">
									<a on:click="{()=>getCareersByNextPage()}" class="page-link" href="#">Siguiente</a>
								</li>
							{/if}
						</ul>
					</nav>-->
				{/if}
			</div>
		</div>
	</div>

	<!-- Modal Create -->
	<div class="modal fade" id="mo1" tabindex="-1" aria-labelledby="mol1" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol1"><i class="fas fa-plus-circle" /> Nueva Carrera</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row mb-1">
							<div class="col-md-12 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="nombre" class="form-label">Nombre</label>
								<input
									bind:this= {nameElement}
                                    id="nombre"
									bind:value="{newcareer.name}"
									type="text"
									class="form-control"
									placeholder="Ingresa el nombre de la carrera"
								/>
								{#each nameFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
							<div class="col-md-12 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="acronimo" class="form-label">Acrónimo</label>
								<input
									bind:this= {acronymElement}
                                    id="acronimo"
									bind:value="{newcareer.acronym}"
									type="text"
									class="form-control"
									placeholder="Ingresa el acrónimo de la carrera"
								/>
								{#each acronymFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6 mb-2">
								<i class="fas fa-university mx-2" /><label for="division" class="form-label"
									>División académica</label
								>
								<select bind:value="{newcareer.id_ac_di}" id="division" class="form-select"
									bind:this= {divisionElement}>
                                    {#if divisions.length > 0}
										{#if newcareer.id_ac_di == ''}
											<option selected disabled value={newcareer.id_ac_di}
												>Selecciona una división académica</option
											>
										{:else}
											<option selected disabled
												>Selecciona una división académica</option
											>
										{/if}
										{#each divisions as d}
											<option value="{d.id}" >{d.acronym}</option>     
										{/each}
									{:else}
										<option selected disabled value={newcareer.id_ac_di}
											>No hay divisiones académicas disponibles</option
										>
									{/if}
									
                                </select>
								{#each divisionFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
                            </div>
                            <div class="col-md-6 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="nivel" class="form-label">Nivel Académico</label>
								<select bind:value="{newcareer.id_ac_le}" id="nivel" class="form-select"
									bind:this= {levelElement}>
                                    {#if levels.length > 0}
										{#if newcareer.id_ac_le == ''}
											<option selected disabled value={newcareer.id_ac_le}
												>Selecciona un nivel académico</option
											>
										{:else}
											<option selected disabled
												>Selecciona un nivel académico</option
											>
										{/if}
										{#each levels as level}
											<option value="{level.id}" >{level.name}</option>     
										{/each}
									{:else}
										<option selected disabled value={newcareer.id_ac_le}
											>No hay niveles académicos disponibles</option
										>
									{/if}
                                </select>
								{#each levelFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearCareer()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
					{#if nameFlag && acronymFlag && divisionFlag && levelFlag}
						<button on:click="{()=>{createCareer();clearCareer()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>
					{:else}
					<button type="button" class="btn btn-primary disabled" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>	
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2"><i class="fas fa-edit" /> Editar Carrera</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<form>
						<div class="row mb-1">
							<div class="col-md-12 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="nombreu" class="form-label">Nombre</label>
								<input
									bind:this= {oldnameElement}
                                    id="nombreu"
									bind:value="{oldcareer.name}"
									type="text"
									class="form-control"
									placeholder="Ingresa el nombre de la carrera"
								/>
								{#each oldnameFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
							<div class="col-md-12 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="acronimou" class="form-label">Acrónimo</label>
								<input
									bind:this= {oldacronymElement}
                                    id="acronimou"
									bind:value="{oldcareer.acronym}"
									type="text"
									class="form-control"
								/>
								{#each oldacronymFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
							</div>
                            <div class="col-md-6 mb-2">
								<i class="fas fa-university mx-2" /><label for="divisionu" class="form-label">División Académica</label>
								<select bind:value="{oldcareer.id_ac_di}" id="divisionu" class="form-select"
									bind:this= {olddivisionElement}>
                                    {#if divisions.length > 0}
										{#if oldcareer.id_ac_di == ''}
											<option selected disabled value={oldcareer.id_ac_di}
												>Selecciona una división académica</option
											>
										{:else}
											<option selected disabled
												>Selecciona una división académica</option
											>
										{/if}
										{#each divisions as d}
											<option value="{d.id}" >{d.acronym}</option>     
										{/each}
									{:else}
										<option selected disabled value={oldcareer.id_ac_di}
											>No hay divisiones académicas disponibles</option
										>
									{/if}
                                </select>
								{#each olddivisionFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
                            </div>
                            <div class="col-md-6 mb-2">
								<i class="fas fa-graduation-cap mx-2"></i><label for="nivelu" class="form-label">Nivel Académico</label>
								<select bind:value="{oldcareer.id_ac_le}" id="nivelu" class="form-select"
									bind:this= {oldlevelElement}>
                                    {#if levels.length > 0}
										{#if oldcareer.id_ac_le == ''}
											<option selected disabled value={oldcareer.id_ac_le}
												>Selecciona un nivel académico</option
											>
										{:else}
											<option selected disabled
												>Selecciona un nivel académico</option
											>
										{/if}
										{#each levels as level}
											<option value="{level.id}" >{level.name}</option>     
										{/each}
									{:else}
										<option selected disabled value={oldcareer.id_ac_le}
											>No hay niveles académicos disponibles</option
										>
									{/if}
                                </select>
								{#each oldlevelFeedback as item}
									<div class="invalid-feedback">
										{item}
									</div>
								{/each}
                            </div>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button on:click="{()=>{clearOldCareer()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
					{#if oldnameFlag && oldacronymFlag && olddivisionFlag && oldlevelFlag}
						<button on:click="{()=>{updateCareer();clearOldCareer()}}" type="button" class="btn btn-primary" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>
					{:else}
					<button type="button" class="btn btn-primary disabled" data-bs-dismiss="modal"><i class="fas fa-save"></i> Guardar</button>	
					{/if}
				</div>
			</div>
		</div>
	</div>
</main>
