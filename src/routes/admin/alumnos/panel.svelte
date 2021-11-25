<script>
	import { onMount } from 'svelte';
	import Notrecords from './../../../components/notrecords.svelte';
	import axiosapi from './../../../utils/axiosapi';
	import swal from './../../../utils/sweetalert2';

	const TITQDELETE = '¿Está seguro que desea eliminar este registro?';
	const TITDELETED = 'Eliminado';
	const TXTDELETED = 'El registro se ha eliminado exitosamente.';
	const TITUPDATED = 'Actualizado';
	const TXTUPDATED = 'El registro se ha actualizado exitosamente.';

	let students = {
		search: '',
		page: 1,
		totalRecords: 0,
		totalPages: 0,
		limit: 0,
		offset: 0,
		rows: []
	};

	let oldStudent = {
		id_user: 0,
		id: 0,
		name: '',
		first_last_name: '',
		second_last_name: '',
		school_id: '',
		career: '',
		acronym_career: '',
		grade: 0,
		level: '',
		acronym_division: ''
	};

	let searched = false;
	let wordSearched = '';
	let searching = false;

	const getStudents = async () => {
		axiosapi
			.doGet('http://localhost:3001/student/get')
			.then((res) => {
				students = res.data;
				searched = false;
			})
			.catch(() => {
				swal.err();
			});
	};

	const getStudensBySearch = async () => {
		searching = true;
		let endpoint = 'http://localhost:3001/student/get';

		if (students.search != undefined && students.search != '') {
			endpoint = 'http://localhost:3001/student/get?search=' + students.search;
			searched = true;
			wordSearched = students.search;
		} else {
			searched = false;
		}

		axiosapi
			.doGet(endpoint)
			.then((res) => {
				students = res.data;
			})
			.catch(() => {
				swal.err();
			})
			.finally(() => {
				searching = false;
			});
	};

	const getStudentsByPage = async (page) => {
		let endpoint = 'http://localhost:3001/student/get?page=' + page;
		if (searched) {
			endpoint += '&search=' + wordSearched;
		}

		axiosapi
			.doGet(endpoint)
			.then((res) => {
				students = res.data;
			})
			.catch(() => {
				swal.err();
			});
	};

	const getStudentsByNextPage = async () => {
		getStudentsByPage(students.page + 1);
	};

	const getStudentsByPreviousPage = async () => {
		getStudentsByPage(students.page - 1);
	};

	const getStudent = async (id) => {
		axiosapi
			.doGet('/student/get/' + id)
			.then((res) => {
				oldStudent = res.data;
				console.log(oldStudent);
			})
			.catch(() => {
				swal.err();
			});
	};

	const deleteStudent = async (id) => {
		swal.concan('question', TITQDELETE).then((res) => {
			if (res.isConfirmed) {
				axiosapi
					.doDelete('http://localhost:3001/student/delete/' + id)
					.then(() => {
						getStudents();
						swal.con('success', TITDELETED, TXTDELETED);
					})
					.catch(() => {
						swal.err();
					});
			}
		});
	};

	onMount(async () => {
		await getStudents();
	});
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow" >
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-user-graduate" /> Alumnos</h3>
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
									<button class="btn btn-outline-success" on:click={() => getStudents()}>
										<i class="fas fa-sync-alt" /> Mostrar todos
									</button>
								{/if}
								<input
									type="text"
									class="form-control"
									placeholder="Busca algo..."
									aria-label="Buscador"
									aria-describedby="button-search"
									bind:value={students.search}
								/>
								<button
									class="btn btn-outline-primary"
									type="button"
									id="button-search"
									on:click={() => getStudensBySearch()}
								>
									{#if searching}
										<span
											class="spinner-border spinner-border-sm"
											role="status"
											aria-hidden="true"
										/>
										<span class="visually-hidden">Loading...</span>
									{:else}
										<i class="fas fa-search" />
									{/if}
								</button>
							</div>
						</div>
					</div>
				</div>

				{#if students.rows.length == 0}
					<Notrecords />
				{:else}
					<div class="table-responsive my-2">
						<table id="filter-table" class="table table-hover table-striped">
							<caption>
								Mostrando {students.offset + 1} - {students.offset + students.limit >
								students.totalRecords
									? students.totalRecords
									: students.offset + students.limit} de {students.totalRecords} registros totales.
							</caption>
							<thead>
								<tr class="text-center">
									<th>No.</th>
									<th>Nombre Completo</th>
									<th>Matrícula</th>
									<th>Grado</th>
									<th>Carrera</th>
									<th>Nivel</th>
									<th>División Académica</th>
									<th>Opciones</th>
								</tr>
							</thead>
							<tbody>
								{#each students.rows as s, i}
									<tr class="text-center">
										<td>{i + 1}</td>
										<td>{s.name} {s.first_last_name} {s.second_last_name}</td>
										<td>{s.school_id}</td>
										<td>{s.grade}°</td>
										<td>{s.acronym_career}</td>
										<td>{s.level}</td>
										<td>{s.acronym_division}</td>
										<td>
											<div class="btn-group" role="group">
												<button
													type="button"
													on:click={() => getStudent(s.id)}
													class="btn btn-outline-primary"
												>
													<i class="fas fa-edit" />
												</button>
												<button
													type="button"
													class="btn btn-outline-danger"
													on:click={() => deleteStudent(s.id_user)}
												>
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
							{#if students.page - 1 === 0}
								<li class="page-item disabled">
									<a class="page-link">Anterior</a>
								</li>
							{:else}
								<li class="page-item">
									<a class="page-link" href="" on:click={() => getStudentsByPreviousPage()}
										>Anterior</a
									>
								</li>
							{/if}

							{#each Array.from({ length: students.totalPages }, (_, i) => 1 + i * 1) as item}
								{#if students.page == item}
									<li class="page-item active" aria-current="page">
										<a class="page-link" href="#">{item}</a>
									</li>
								{:else}
									<li class="page-item" aria-current="page">
										<a class="page-link" href="" on:click={() => getStudentsByPage(item)}>{item}</a>
									</li>
								{/if}
							{/each}

							{#if students.page === students.totalPages}
								<li class="page-item disabled">
									<a class="page-link">Siguiente</a>
								</li>
							{:else}
								<li class="page-item">
									<a class="page-link" href="" on:click={() => getStudentsByNextPage()}>Siguiente</a
									>
								</li>
							{/if}
						</ul>
					</nav>
				{/if}
			</div>
		</div>
	</div>
</main>
