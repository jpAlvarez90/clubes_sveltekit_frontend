<script>
	import { onMount } from 'svelte'
	import Notrecords from './../components/notrecords.svelte'
	import axiosapi from './../utils/axiosapi'
    import swal from './../utils/sweetalert2'

    let workshops = {
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

	const getWorkshops = ()=>{
		axiosapi.doGet("/workshop/get").then(res=>{
			workshops = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getWorkshopsBySearch = ()=>{
		searching = true
		let endpoint = `/workshop/get`
		if(workshops.search != undefined && workshops.search != ""){
			endpoint = `/workshop/get?search=${workshops.search}`
			searched = true
			wordSearched = workshops.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			workshops = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getWorkshopsByPage = (page)=>{
		let endpoint = `/workshop/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			workshops = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getWorkshopsByNextPage = ()=>{
        getWorkshopsByPage(workshops.page+1)
	}

	const getWorkshopsByPreviousPage = ()=>{
        getWorkshopsByPage(workshops.page-1)
	}

	const getWorkshopDetails = (id)=>{
		alert(`id: ${id}`)
	}


	onMount(()=>{
		getWorkshops()
	})
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-chalkboard"></i> Talleres</h3>
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
									<button on:click="{()=>getWorkshops()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getWorkshopsBySearch()}}}" bind:value="{workshops.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getWorkshopsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if workshops.rows.length == 0}
					<Notrecords />
				{:else}
                <div class="container">
                    {#each workshops.rows as w}
                        <div class="col-md-6 col-lg-4 g-3 mb-3">
                            <div class="card h-100">
                                <img src="{w.image_url}" alt="Taller" class="card-img-top">
                                <div class="card-body">
                                    <h5 class="card-title text-uppercase">{w.name}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">{w.type}</h6>
                                    <p class="card-text withGradient">
                                        {w.description.slice(0,300)}...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <a class="float-end my-2" href="" on:click="{()=>getWorkshopDetails(w.id)}">Ver horarios...</a>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
				<nav aria-label="...">
					<ul class="pagination justify-content-end">
						{#if workshops.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getWorkshopsByPreviousPage()}" class="page-link" href="">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: workshops.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if workshops.page == item}
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" 
									on:click="{()=>getWorkshopsByPage(item)}"
                                    href=""
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if workshops.page === workshops.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-missing-attribute -->
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getWorkshopsByNextPage()}" class="page-link" href="">Siguiente</a>
							</li>
						{/if}
					</ul>
				</nav>
				{/if}

			</div>
		</div>
	</div>
</main>