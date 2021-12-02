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


    export let id = 0
    const idGroup = id


    let group = {
        id:idGroup,
        name: "A",
        minimum: 5,
        maximum: 10,
        schedule: "Lunes a las 6 pm",
        id_gr_co_da: 1,
        closing_date: "2021-11-20",
        start_date: "2021-12-20",
        final_date: "2021-12-30",
        id_workshop: 1,
        name_w: "Ajedrez",
        description: "El ajedrez es un juego que tiene diversidad de matices. Por un lado es un juego de salón, el cual puede entretener a niños y adultos y su característica principal es que su triunfo se obtiene mediante la lógica y no gracias al azar, lo que ocurre en la mayoría de los juegos.",
        image_url: "https://firebasestorage.googleapis.com/v0/b/workshop-aa29f.appspot.com/o/workshop%2F1637792975575?alt=media&token=dd7368c3-6bd4-4f8d-a5f8-a1488267ffad",
        id_wo_ty: 1,
        type: "Deportivo"
    }

    let students = {
        search: '',
		page: 1,
		totalRecords: 0,
		totalPages: 1,
		limit: 0,
		offset: 0,
		rows: [
            {
                id: 1,
                name: "Daniel",
                first_last_name: "Beltrán",
                second_last_name: "Cruz",
                school_id: "I20183TI009",
                grupo: "A",
                personal_email: "cruzbeltrandaniel@gmail.com",
                email: "20183ti009@utez.edu.mx",
                phone: "7773771137",
                cellphone: "7772657497",
                free: 1
            },
            {
                id: 2,
                name: "Daniel",
                first_last_name: "Beltrán",
                second_last_name: "Cruz",
                school_id: "I20183TI009",
                grupo: "A",
                personal_email: "cruzbeltrandaniel@gmail.com",
                email: "20183ti009@utez.edu.mx",
                phone: "7773771137",
                cellphone: "7772657497",
                free: 2
            },
            {
                id: 3,
                name: "Daniel",
                first_last_name: "Beltrán",
                second_last_name: "Cruz",
                school_id: "I20183TI009",
                grupo: "A",
                personal_email: "cruzbeltrandaniel@gmail.com",
                email: "20183ti009@utez.edu.mx",
                phone: "7773771137",
                cellphone: "7772657497",
                free: 3
            }
        ]
    }

    const getGroup = ()=>{
        if(idGroup == 0){
            goto("/instructor/panel")
        }else{
            // axiosapi.doGet(`/workshop/get/${idWorkshop}`).then(res=>{
            //     if(res.data === ""){
            //         goto("/admin/talleres/panel")
            //     }else{
            //         workshop = res.data
            //     }
            // }).catch(err=>{
            //     swal.err()
            //     goto("/admin/talleres/panel")
            // })
        }
    }

    onMount(()=>{
        getGroup()
    })
</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <div class="container">
            <div class="row justify-content-start align-items-center gy-3">
                <div class="col-lg-2">
                    <a class="btn btn-outline-secondary h-100 w-100 fs-5" href="/instructor/panel">
                        <i class="fas fa-long-arrow-alt-left"></i> Regresar
                    </a>
                </div>
                <div class="col-lg-10">
                    <h1 class="text-sm-center text-lg-start">
                        <i class="fas fa-list"></i>
                        Detalles
                    </h1>
                </div>
            </div>
        </div>
        <hr>
        <div class="container main-card rounded border px-4 py-4 mb-4">
            <h2>
                <i class="fa fa-chalkboard"></i> Datos del taller
            </h2>
            <hr>
            <div class="row">
                <div class="col-12">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <img class="img-fluid rounded card" src="{group.image_url}" alt="Imagen del taller">
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="d-flex flex-wrap">
                                    <div class="h1 text-break align-self-center align-middle mx-2">{group.name_w}</div>
                                    <div class="h2 text-break align-self-center align-middle mx-2 text-muted">| {group.type}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <p>{group.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-12">
                    <div id="colap1" class="collapse show multi-collapse row gy-3">
                        <div class="col-md-6 border-start border-2 border-primary">
                            <div class="row  g-3">
                                <div class="col-sm-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-heading"></i> Grupo
                                    </div>
                                    <div>{group.name}</div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-list"></i> Inscritos
                                    </div>
                                    <div>0/{group.maximum}</div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-users"></i> Mínimo
                                    </div>
                                    <div>{group.minimum}</div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="fw-bold">
                                        <i class="fa fa-users"></i> Máximo
                                    </div>
                                    <div>{group.maximum}</div>
                                </div>
                                <div class="col-12">
                                    <div class="fw-bold">
                                        <i class="fa fa-clock"></i> Horario
                                    </div>
                                    <div>{group.schedule}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 border-start border-2 border-primary">
                            <div class="row g-3">
                                <div class="col-sm-12 col-md-10 order-1">
                                    <div class="fw-bold d-flex d-wrap align-items-center">
                                        <span><i class="fa fa-users"></i> Fecha límite de inscripción</span> <div style="width: 1rem;height: 1rem;" class="mx-2 mt-1 rounded-circle border bg-success" ></div>
                                    </div>
                                    <div>{group.closing_date}</div>
                                </div>
                                <div class="col-sm-6 order-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-calendar-alt"></i> Fecha de inicio
                                    </div>
                                    <div>{group.start_date}</div>
                                </div>
                                <div class="col-sm-6 order-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-users"></i> Fecha de fin
                                    </div>
                                    <div>{group.final_date}</div>
                                </div>
                                <div class="col-sm-12 col-md-2 order-md-2 order-last">
                                    <button class="float-lg-end float-md-start w-100 btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="collap1 collap2">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="colap2" class="collapse multi-collapse row gy-3">
                        <div class="col">
                            <form on:submit="{(e)=>{e.preventDefault()}}">
                            <div class="row g-3 mb-3">
                                <div class="col-md-6 border-start border-primary border-2">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label" for="gname">
                                                <i class="fa fa-heading"></i> Grupo
                                            </label>
                                            <input class="form-control" type="text" id="gname" autocomplete="off" placeholder="Grupo">
                                        </div>
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <label class="form-label" for="gmin">
                                                <i class="fa fa-users"></i> Mínimo de integrantes
                                            </label>
                                            <input class="form-control" type="text" id="gmin" autocomplete="off" placeholder="Mínimo de integrantes">
                                        </div>
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <label class="form-label" for="gmax">
                                                <i class="fa fa-users"></i> Máximo de integrantes
                                            </label>
                                            <input class="form-control" type="text" id="gmax" autocomplete="off" placeholder="Máximo de integrantes">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gschedule">
                                                <i class="fa fa-clock"></i> Horario
                                            </label>
                                            <input class="form-control" type="text" id="gschedule" autocomplete="off" placeholder="Horario">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 border-start border-primary border-2">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label" for="gclosedate">
                                                <i class="fa fa-calendar-alt"></i> Fecha límite de inscripción
                                            </label>
                                            <input class="form-control" type="date" id="gclosedate">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gstartdate">
                                                <i class="fa fa-calendar-alt"></i> Fecha inicio
                                            </label>
                                            <input class="form-control" type="date" id="gstartdate">
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gfinishdate">
                                                <i class="fa fa-calendar-alt"></i> Fecha fin
                                            </label>
                                            <input class="form-control" type="date" id="gfinishdate">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col-sm-6 col-md-4 offset-md-4 offset-lg-6 col-lg-3">
                                    <button type="button" class="w-100 btn btn-secondary" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="collap1 collap2">
                                        <i class="fa fa-times"></i> Cancelar
                                    </button>
                                </div>
                                <div class="col-sm-6 col-md-4 col-lg-3">
                                    <button type="submit" class="w-100 btn btn-primary">
                                        <i class="fa fa-save"></i> Guardar
                                    </button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="container main-card rounded border px-4 py-4 mb-4">
            <div class="container">
                <div class="row gy-2 justify-content-between align-items-center">
                    <h2 class="col-md-4"><i class="fa fa-user-graduate"></i> Alumnos</h2>
                </div>
            </div>
            <hr>
            <div class="row mt-3 gy-3">
                {#if students.rows.length == 0}
                    <NotRecords/>
                {:else}
                <div class="col-12">
                    <button class="float-end btn btn-outline-danger">
                        <i class="fa fa-file-pdf"></i> Descargar
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-stripped table-hover">
                        <thead>
                            <tr class="text-center">
                                <th>No.</th>
                                <th>Nombre</th>
                                <th>Correo Electrónico Institucional</th>
                                <th>Teléfono Celular</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each students.rows as st,i}
                            <tr class="text-center">
                                <td>{i+1}</td>
                                <td>{st.name} {st.first_last_name} {st.second_last_name}</td>
                                <td>{st.email}</td>
                                <td>{st.cellphone}</td>
                                <td>
									<div class="btn-group" role="group">
                                        {#if st.free == 1}
                                            <button disabled type="button" class="btn btn-outline-success">
                                                <i class="fas fa-check-circle" /> Liberar
                                            </button>
                                        {:else if st.free == 2}
                                            <button type="button" class="btn btn-outline-success">
                                                <i class="fas fa-check-circle" /> Liberar
                                            </button>
                                        {:else}
                                            <button disabled type="button" class="btn btn-outline-primary">
                                                <i class="fas fa-check-circle" /> Liberado
                                            </button>
                                        {/if}
									</div>
                                </td>
                            </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                {/if}
            </div>
        </div>
    </div>
</main>