<script>
	import { onMount } from 'svelte'
	import Notrecords from './../components/notrecords.svelte'
	import axiosapi from './../utils/axiosapi'
    import swal from './../utils/sweetalert2'

    let ads = {
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
	let oldad = {
		id:0,
		title:"",
		description:"",
        image_url: "https://eitrawmaterials.eu/wp-content/uploads/2019/05/Label-brochure-1.jpg",
        image: ""
	};
	let closemodalupdate

	const getAds = ()=>{
		axiosapi.doGet("/ad/get").then(res=>{
			ads = res.data;
			searched = false
		}).catch((err)=>{
			swal.err()
		})
	}

	const getAdsBySearch = ()=>{
		searching = true
		let endpoint = `/ad/get`
		if(ads.search != undefined && ads.search != ""){
			endpoint = `/ad/get?search=${ads.search}`
			searched = true
			wordSearched = ads.search
		}else{
			searched = false
		}
		axiosapi.doGet(endpoint).then(res=>{
			ads = res.data;
		}).catch((err)=>{
			swal.err()
		}).finally(()=>{
			searching = false
		})
	}

	const getAdsByPage = (page)=>{
		let endpoint = `/ad/get?page=${page}`
		if(searched){
			endpoint += `&search=${wordSearched}`
		}
		axiosapi.doGet(endpoint).then(res=>{
			ads = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const getAdsByNextPage = ()=>{
        getAdsByPage(ads.page+1)
	}

	const getAdsByPreviousPage = ()=>{
        getAdsByPage(ads.page-1)
	}

	const getAd = (id)=>{
		axiosapi.doGet("/ad/get/"+id).then(res=>{		
			oldad = res.data;
		}).catch((err)=>{
			swal.err()
		})
	}

	const clear = ()=>{
		let elementClass = "form-control"

		elementTitleU.value = ""
		oldad.title = ""
		elementTitleU.className = `${elementClass}`
		fbTitleU = []

		elementDescriptionU.value = ""
		oldad.description = ""
		elementDescriptionU.className = `${elementClass}`
		fbDescriptionU = []

        elementFileU.value = ""
		oldad.image = ""
		elementFileU.className = `${elementClass}`
		fbFileU = []

	}

	onMount(()=>{
		getAds()
	})
</script>

<main>
	<div class="main-card container-lg my-4 p-4 rounded border shadow">
		<div class="row mb-3">
			<div class="col">
				<h3><i class="fas fa-newspaper"></i> Avisos</h3>
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
									<button on:click="{()=>getAds()}" class="btn btn-outline-success">
										<i class="fas fa-sync-alt"></i> Mostrar todos
									</button>
								{/if}
								<input on:keyup="{(e)=>{if(e.keyCode === 13){getAdsBySearch()}}}" bind:value="{ads.search}" type="search" class="form-control" placeholder="Busca algo..." aria-label="Buscador" aria-describedby="button-search">
								<button  on:click="{()=>getAdsBySearch()}" class="btn btn-outline-primary" type="button" id="button-search">
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
				{#if ads.rows.length == 0}
					<Notrecords />
				{:else}
                <div class="container">
                    <div class="row">
                        {#each ads.rows as a,i}
                        <div class="col-md-6 col-lg-4 g-3 mb-3">
                            <div class="card h-100">
                                <img src="{a.image_url}" class="card-img-top" alt="Imagen del aviso">
                                <div class="card-body">
                                    <h5 class="card-title text-uppercase">{a.title.slice(0,60)}</h5>
                                    <p class="card-text withGradient">
                                        {a.description.slice(0,300)}...
                                    </p>
                                </div>
                                <div class="card-footer bg-transparent">
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-xl-4">
                                                <!-- svelte-ignore a11y-invalid-attribute -->
                                                <a href="" on:click="{()=>getAd(a.id)}" data-bs-toggle="modal" data-bs-target="#mo2">Leer más...</a>
                                            </div>
                                            <div class="col-xl-8">
                                                <p class="text-muted">
                                                    Publicado: {a.created_at.split("T")[0].split("-").reverse().toString().replace(/,/g,"/")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
				<nav aria-label="...">
					<ul class="pagination justify-content-end">
						{#if ads.page === 1}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a class="page-link" href="">Anterior</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getAdsByPreviousPage()}" class="page-link" href="">Anterior</a>
							</li>
						{/if}
						{#each Array.from({ length: ads.totalPages }, (_, i) => 1 + (i * 1)) as item}
							{#if ads.page == item}
								<li class="page-item active" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" href="">{item}</a>
								</li>	
							{:else}
								<li class="page-item" aria-current="page">
									<!-- svelte-ignore a11y-invalid-attribute -->
									<a class="page-link" 
									on:click="{()=>getAdsByPage(item)}"
                                    href=""
									>{item}</a>
								</li>	
							{/if}
						
						{/each}
						{#if ads.page === ads.totalPages}
							<li class="page-item disabled">
								<!-- svelte-ignore a11y-missing-attribute -->
								<a class="page-link">Siguiente</a>
							</li>							
						{:else}
							<li class="page-item">
								<!-- svelte-ignore a11y-invalid-attribute -->
								<a on:click="{()=>getAdsByNextPage()}" class="page-link" href="">Siguiente</a>
							</li>
						{/if}
					</ul>
				</nav>
				{/if}

			</div>
		</div>
	</div>

	<!-- Modal Update -->
	<div class="modal fade" id="mo2" tabindex="-1" aria-labelledby="mol2" aria-hidden="true">
		<div class="modal-dialog modal-lg modal-dialog-centered ">
			<div class="modal-content">
				<form on:submit="{(e)=>{e.preventDefault();}}">
					<div class="modal-header">
						<h5 class="modal-title text-uppercase" id="mol2">
							<i class="fas fa-newspaper"></i> {oldad.title}
						</h5>
						<button on:click="{()=>{clear()}}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <div class="col-12">
                                        <div class="row g-3">
                                            <div class="col-12">
                                                <img class="w-100 rounded img-fluid" src="{oldad.image_url}" alt="Imagen de la publicación">
                                            </div>
                                            <div class="col-12">
                                                <p style="text-align: justify;white-space: pre-line" class="lead text-break">
                                                    {oldad.description}  
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
					</div>
					<div class="modal-footer">
						<button on:click="{()=>{clear()}}" bind:this="{closemodalupdate}" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Cerrar</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
