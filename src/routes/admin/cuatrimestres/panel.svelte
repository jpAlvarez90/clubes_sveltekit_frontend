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
    
    let grades = {
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
    let terms = [];
    let levels = [];
	let newgrade = {
		grade:"",
        id_qu_te: "0",
        id_ac_le: "0"
	};
	let oldgrade = {
		id:0,
		grade:"",
        id_qu_te: "0",
        id_ac_le: "0"
	};	
	let closemodalcreate
	let closemodalupdate


	const getTerms = ()=>{
        axiosapi.doGet("/term/get").then(res=>{
			terms = res.data;
        }).catch((err)=>{
			swal.err()
        })

    }

	const getLevels = ()=>{
        axiosapi.doGet("/academic/level/get").then(res=>{
            levels = res.data.rows
        }).catch((err)=>{
            swal.err()
        })

    }

	const getGrades = ()=>{
		axiosapi.doGet("/grade/get").then(res=>{
			grades = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searched = false
		})
	}

	const getGradesBySearch = ()=>{
		console.log("ENTRO");
		searching = true
		let endpoint = `/grade/get`
		if(grades.search != undefined && grades.search != ""){
			endpoint = `/grade/get?search=${grades.search}`
			searched = true
			wordSearched = grades.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			grades = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getGradesByPage = (page)=>{
		let endpoint = `/grade/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			grades = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getGradesByNextPage = ()=>{
		getGradesByPage(grades.page+1)
	}

	const getGradesByPreviousPage = ()=>{
		getGradesByPage(grades.page-1)
	}

	const getGrade = (id)=>{
		axiosapi.doGet("/grade/get/"+id).then(res=>{
			oldgrade = res.data[0];
		}).catch((err)=>{
			swal.err()
		})

	}

	const updateGrade = ()=>{
		let id = oldgrade.id
		axiosapi.doPut("/grade/update/"+id,oldgrade).then(res=>{		
			getGrades()
			clear()
			swal.con('success',TITUPDATED,TXTUPDATED)
		}).catch((err)=>{
			swal.err()
		})
	}

	const createGrade = ()=>{
		axiosapi.doPost("/grade/create",newgrade).then((res)=>{
			getGrades()
			clear()
			swal.con('success',TITCREATED,TXTCREATED)
		}).catch((err)=>{
			swal.err()
		})
	}

    const deleteGrade = (id)=>{
		swal.concan('question',TITQDELETE).then(result=>{
			if(result.isConfirmed){
				axiosapi.doDelete("/grade/delete/"+id).then((res)=>{
					getGrades()
					swal.con('success',TITDELETED,TXTDELETED)
				}).catch((err)=>{
					swal.err()
				})
			}
		})
    }

	let elementGradeC
	let fbGradeC = []
	let elementTermC
	let fbTermC = []
	let elementLevelC
	let fbLevelC = []
	
	let elementGradeU
	let fbGradeU = []
	let elementTermU
	let fbTermU = []
	let elementLevelU
	let fbLevelU = []

	const checkCreateValidationC = ()=>{
		let ok = true
		ok = validGradeC(elementGradeC) && ok
		ok = validTermC(elementTermC) && ok
		ok = validLevelC(elementLevelC) && ok
		if(ok){
			createGrade()
			closemodalcreate.click()
		}
	}

	const checkCreateValidationU = ()=>{
		let ok = true
		ok = validGradeU(elementGradeU) && ok
		ok = validTermU(elementTermU) && ok
		ok = validLevelU(elementLevelU) && ok
		if(ok){
			updateGrade()
			closemodalupdate.click()
		}
	}

	const validGradeC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGradeC = []
		target.className = `${elementClass} is-valid`

		let gradeformat = /^([0-9]+[\s]*)+$/
		if(!gradeformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbGradeC.push("El grado sólo debe contener números.")
		}
		
		return validated
	}

	const validTermC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-select"
		fbTermC = []
		target.className = `${elementClass} is-valid`

		if(v === '0'){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbTermC.push("Debe seleccionar una opción.")
		}
		
		return validated
	}

	const validLevelC = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-select"
		fbLevelC = []
		target.className = `${elementClass} is-valid`

		if(v === '0'){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbLevelC.push("Debe seleccionar una opción.")
		}
		
		return validated
	}

	const validGradeU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbGradeU = []
		target.className = `${elementClass} is-valid`

		let gradeformat = /^([0-9]+[\s]*)+$/
		if(!gradeformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbGradeU.push("El grado sólo debe contener números.")
		}
		
		return validated
	}

	const validTermU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-select"
		fbTermU = []
		target.className = `${elementClass} is-valid`
		
		return validated
	}

	const validLevelU = (target)=>{
		let validated = true
		let v = target.value
		let elementClass = "form-select"
		fbLevelU = []
		target.className = `${elementClass} is-valid`
		
		return validated
	}

	const clear = ()=>{
		let elementClass = "form-control"
		let elementClassSelect = "form-select"

		elementGradeC.value = ""
		newgrade.grade = ""
		elementGradeC.className = `${elementClass}`
		fbGradeC = []

		elementTermC.value = "0"
		newgrade.id_qu_te = "0"
		elementTermC.className = `${elementClassSelect}`
		fbTermC = []

		elementLevelC.value = "0"
		newgrade.id_ac_le = "0"
		elementLevelC.className = `${elementClassSelect}`
		fbLevelC = []

		elementGradeU.value = ""
		oldgrade.grade = ""
		elementGradeU.className = `${elementClass}`
		fbGradeU = []

		elementTermU.value = "0"
		oldgrade.id_qu_te = "0"
		elementTermU.className = `${elementClassSelect}`
		fbTermU = []

		elementLevelU.value = "0"
		oldgrade.id_ac_le = "0"
		elementLevelU.className = `${elementClassSelect}`
		fbLevelU = []


	}

	const listenerValidity = ()=>{
		elementGradeC.addEventListener('input',(e)=>{validGradeC(e.target)})
		elementTermC.addEventListener('change',(e)=>{validTermC(e.target)})
		elementLevelC.addEventListener('change',(e)=>{validLevelC(e.target)})

		elementGradeU.addEventListener('input',(e)=>{validGradeU(e.target)})
		elementTermU.addEventListener('change',(e)=>{validTermU(e.target)})
		elementLevelU.addEventListener('change',(e)=>{validLevelU(e.target)})
	}


	onMount(()=>{
		getGrades()
        getTerms()
        getLevels()
		listenerValidity()
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-graduation-cap"></i> Grados Cuatrimestrales</h3>
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
									<button on:click="{()=>getGrades()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getGradesBySearch()}}}" bind:value="{grades.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button on:click="{()=>getGradesBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if grades.rows.length == 0}
					<Notrecords />
				{:else}
				<div class="table-responsive my-2">
					<table id="filter-table" class="table table-hover table-striped">
						<caption>
							Mostrando {grades.offset+1} - {
								grades.offset+grades.limit>grades.totalRecords?grades.totalRecords:grades.offset+grades.limit
								} de {grades.totalRecords} registros totales.
						</caption>
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
                            {#each grades.rows as g,i}
							<tr class="text-center">
								<td>{i+1}</td>
								<td>{g.grade}°</td>
                                <td>{g.t_term}</td>
                                <td>{g.l_name}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click="{()=>getGrade(g.id)}" data-bs-toggle="modal" data-bs-target="#mo2" type="button" class="btn btn-outline-primary">
											<i class="fas fa-edit" />
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
				<nav aria-label="pagination">
					<ul class="pagination justify-content-end">
						{#if grades.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getGradesByPreviousPage()}" class="page-link" href="">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: grades.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if grades.page == item}
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" 
									on:click="{()=>getGradesByPage(item)}" 
									href=""
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if grades.page === grades.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getGradesByNextPage()}" class="page-link" href="">Siguiente</a>
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
				<form on:submit="{(e)=>{e.preventDefault();checkCreateValidationC();}}">
					<div class="modal-header">
						<h5 class="modal-title" id="mol1"><i class="fas fa-plus-circle"></i> Nuevo Grado Cuatrimestral</h5>
						<button type="button" on:click="{()=>{clear()}}" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">	
						<div class="row g-3 mb-3">
							<div class="col-md-4">
								<label for="grado" class="form-label">
									<i class="fas fa-graduation-cap"></i> Grado
								</label>
								<input
									id="grado"
									bind:this="{elementGradeC}"
									bind:value="{newgrade.grade}"
									maxlength="2"
									type="text"
									class="form-control"
									autocomplete="off"
									placeholder="Grado"
								/>
								{#each fbGradeC as item}
								<div class="invalid-feedback">
									{item}
								</div>
								{/each}
							</div>
							<div class="col-md-8">
								<label for="plazo" class="form-label">
									<i class="fas fa-graduation-cap"></i> Plazo
								</label>
								<select bind:this="{elementTermC}" bind:value="{newgrade.id_qu_te}" id="plazo" class="form-select">
									<option value="0">Seleccione una opción...</option>
									{#each terms as term}
										<option value="{term.id}" >{term.term}</option>
									{/each}
								</select>
								{#each fbTermC as item}
								<div class="invalid-feedback">
									{item}
								</div>
								{/each}
							</div>
						</div>
						<div class="row g-3">
							<div class="col-12">
								<label for="nivel" class="form-label">
									<i class="fas fa-graduation-cap"></i> Nivel Académico
								</label>
								<select bind:this="{elementLevelC}" bind:value="{newgrade.id_ac_le}" id="nivel" class="form-select">
									<option value="0">Seleccione una opción...</option>
									{#each levels as level}
										<option value="{level.id}" >{level.name}</option>     
									{/each}
								</select>
								{#each fbLevelC as item}
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
				<form on:submit="{(e)=>{e.preventDefault();checkCreateValidationU();}}">
				<div class="modal-header">
					<h5 class="modal-title" id="mol2"><i class="fas fa-edit"></i> Editar Grado Cuatrimestral</h5>
					<button on:click="{()=>{clear()}}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="row g-3 mb-3">
						<div class="col-md-4">
							<label for="gradou" class="form-label"><i class="fas fa-graduation-cap"></i> Grado</label>
							<input
								id="gradou"
								bind:this="{elementGradeU}"
								bind:value="{oldgrade.grade}"
								type="text"
								class="form-control"
								autocomplete="off"
								placeholder="Grado"
							/>
							{#each fbGradeU as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
						<div class="col-md-8">
							<label for="plazou" class="form-label"><i class="fas fa-graduation-cap"></i> Plazo</label>
							<select bind:this="{elementTermU}" bind:value="{oldgrade.id_qu_te}" id="plazou" class="form-select">
								{#each terms as term}
									<option value="{term.id}" >{term.term}</option>     
								{/each}
							</select>
							{#each fbTermU as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
					</div>
					<div class="row g-3">
						<div class="col-12">
							<label for="nivelu" class="form-label"><i class="fas fa-graduation-cap"></i> Nivel Académico</label>
							<select bind:this="{elementLevelU}" bind:value="{oldgrade.id_ac_le}" id="nivelu" class="form-select">
								{#each levels as level}
									<option value="{level.id}" >{level.name}</option>     
								{/each}
							</select>
							{#each fbLevelU as item}
								<div class="invalid-feedback">
									{item}
								</div>
							{/each}
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button bind:this="{closemodalupdate}" on:click="{()=>{clear()}}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cancelar</button>
					<button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
				</div>
				</form>
			</div>
		</div>
	</div>
</main>
