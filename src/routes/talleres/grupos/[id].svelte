<script context="module">
    export async function load({page}){
        let id = 0
        let param = parseInt(page.params.id)
        if(!isNaN(param)){
            id = param
        }
        return {props: {id}}
    }
</script>

<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    import NotRecords from '/src/components/notrecords.svelte'
    import axiosapi from "/src/utils/axiosapi";
    import swal from "/src/utils/sweetalert2";
    
    
    export let id = 0
    const idWorkshop = id

    let workshop = {
        id: 0,
        name: "",
        description: "",
        image_url: "",
        schedule: "",
        type: "",
        groups: []
    }

    const getDataWorkshop = ()=>{
        if(idWorkshop == 0){
            goto("/talleres")
        }else{
            axiosapi.doGet(`/workshop/groups/get/${idWorkshop}`).then(res=>{
                workshop = res.data
                
            }).catch(err=>{
                swal.err()
                goto("/talleres")
            })
        }
    }

    const register = (id,closing_date)=>{
        let role = localStorage.getItem("ROLE")
        let user = localStorage.getItem("user")

        if(!role || !user){
            goto('/login')
        }else if (role === "STUDENT"){
            user = JSON.parse(user)
            let id_user = user['idUser']
            axiosapi.doGet(`/workshop/get/groups/student/${id_user}`).then(res=>{
                let validDate = new Date(closing_date) > new Date()
                if(res.data.total === 0 && validDate){
                    swal.concan('question','¿Está seguro que desea inscribirse al grupo?').then(result=>{
                        if(result.isConfirmed){
                            axiosapi.doPost(`/workshop/group/register`,{id_user,id_group:id}).then(res=>{
                                swal.con('success','Registrado','Inscripción completeada.')
                                goto('/student/panel')
                            }).catch(err=>{
                                swal.err()
                            })
                        }
                    })
                }else{
                    swal.con('warning','Advertencia','Solamente puedes registrarte a un taller por periodo.')
                }
            }).catch(err=>{
                swal.err()
            })
        }else{
            swal.con('warning','Advertencia','Su usuario no puede registrarse a un taller.')
        }
    }

    onMount(()=>{
        getDataWorkshop()
    })
</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <div class="container">
            <div class="row justify-content-start align-items-center gy-3">
                <div class="col-lg-2">
                    <a class="btn btn-outline-secondary h-100 w-100 fs-5" href="/talleres">
                        <i class="fas fa-long-arrow-alt-left"></i> Regresar
                    </a>
                </div>
                <div class="col-lg-10">
                    <h1 class="text-sm-center text-lg-start">
                        <i class="fas fa-list"></i>
                        Grupos
                    </h1>
                </div>
            </div>
        </div>
        <hr>
        <div class="container main-card rounded border px-4 py-4 mb-4">
            <div class="row">
                <div class="col-12">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <img class="img-fluid rounded card" src="{workshop.image_url}" alt="Imagen del taller">
                        </div>
                        <div class="col-md-9">
                            <div class="row">
                                <div class="d-flex flex-wrap">
                                    <div class="h1 text-break align-self-center align-middle mx-2">{workshop.name}</div>
                                    <div class="h2 text-break align-self-center align-middle mx-2 text-muted">| {workshop.type}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <p>{workshop.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            {#if workshop.groups.length == 0}
                <NotRecords/>
            {:else}
                <div class="row">
                    <div class="col-12">
                        <div class="row gy-3">
                            {#each workshop.groups as item,i}
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-body border-top border-5 border-{(item.inscribed == item.maximum || new Date(item.closing_date) < new Date())?'secondary':'primary'} rounded">
                                            <h5 class="card-title fw-bold text-break upper-case">Grupo: {item.name}</h5>
                                            <h6 class="card-subtitle text-break mb-2 fst-italic text-muted">Instructor: {item.i_name} {item.i_first_last_name}</h6>
                                            <div class="row g-2">
                                                <div class="col-sm-6 col-md-12 col-lg-6">
                                                    <div class="fw-bold">Horario:</div>
                                                    <div>
                                                        {item.schedule}
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-12 col-lg-6">
                                                    <div class="fw-bold">Inscripciones:</div>
                                                    <div>
                                                        {item.inscribed}/{item.maximum}
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-12 col-lg-6">
                                                    <div class="fw-bold">Fecha de inicio:</div>
                                                    <div>
                                                        {new Date(item.start_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div class="col-sm-6 col-md-12 col-lg-6">
                                                    <div class="fw-bold">Fecha de fin:</div>
                                                    <div>
                                                        {new Date(item.final_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer bg-transparent">
                                            <div class="d-flex justify-content-between align-items-center flex-wrap" >
                                                <div class="text-muted">
                                                    Fecha límite de inscripción: {new Date(item.closing_date).toLocaleDateString()}
                                                </div>
                                                <div class="mt-2 mt-sm-0 mt-md-2">
                                                    <button on:click="{()=>{register(item.id,item.closing_date)}}" disabled="{item.inscribed == item.maximum || new Date(item.closing_date) < new Date()}" class="btn btn-outline-{(item.inscribed == item.maximum || new Date(item.closing_date) < new Date())?'secondary':'primary'}">
                                                        <i class="fa fa-check-circle"></i> Inscribirse
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>