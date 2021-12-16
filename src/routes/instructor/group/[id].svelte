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
    import axiosapi from '/src/utils/axiosapi'
    import swal from '/src/utils/sweetalert2'
    import {jsPDF} from 'jspdf'
    import autoTable from 'jspdf-autotable'

    const TITQDELETE = "¿Está seguro que desea eliminar este grupo?"
	const TITDELETED = "Eliminado"
	const TXTDELETED = "El registro se ha eliminado exitosamente."
	const TITCREATED = "Creado"
	const TXTCREATED = "El registro se ha creado exitosamente."
	const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."

    export let id = 0
    const idGroup = id
    let btncancel

    let elementName
    let fbName = []
    let elementMin
    let fbMin = []
    let elementMax
    let fbMax = []
    let elementSchedule
    let fbSchedule = []
    let elementClosingDate
    let fbClosingDate = []
    let elementStartDate
    let fbStartDate = []
    let elementFinalDate
    let fbFinalDate = []
    let today = ''
    let tomorrow = ''


    let group = {
        id:idGroup,
        name: "A",
        minimum: 5,
        maximum: 10,
        inscribed: 0,
        schedule: "Lunes a las 6 pm",
        closing_date: "2021-11-20",
        start_date: "2021-12-20",
        final_date: "2021-12-30",
        w_name: "Ajedrez",
        w_description: "El ajedrez es un juego que tiene diversidad de matices. Por un lado es un juego de salón, el cual puede entretener a niños y adultos y su característica principal es que su triunfo se obtiene mediante la lógica y no gracias al azar, lo que ocurre en la mayoría de los juegos.",
        w_image_url: "https://firebasestorage.googleapis.com/v0/b/workshop-aa29f.appspot.com/o/workshop%2F1637792975575?alt=media&token=dd7368c3-6bd4-4f8d-a5f8-a1488267ffad",
        w_type: "Deportivo"
    }

    let students = []

    const getGroup = ()=>{
        if(idGroup == 0){
            goto("/instructor/panel")
        }else{
            axiosapi.doGet(`/workshop/get/group/data/${idGroup}`).then(res=>{
                console.log(res.data);
                group = res.data['workshop']
                students = res.data['inscriptions']
            }).catch(err=>{
                swal.err()
                goto("/admin/talleres/panel")
            })
        }
    }

    const deleteGroup = ()=>{
        swal.concan('question',TITQDELETE).then(result=>{
            if(result.isConfirmed){
                axiosapi.doDelete(`/workshop/group/delete/${idGroup}`).then(res=>{
                    swal.con('success',TITDELETED,TXTDELETED)
                    goto('/instructor/panel')
                }).catch(err=>{
                    swal.err()
                })
            }
        })
    }

    const canRealese = (acc)=>{
        return new Date(group.final_date) > new Date() && acc === 0
    }

    const deleteStudent = (i)=>{
        let student = students[i]
        swal.concan('question','¿Está seguro que desea eliminar este estudiante?').then(result=>{
            if(result.isConfirmed){
                axiosapi.doDelete(`/workshop/delete/student/group/${student.id}`).then(res=>{
                    swal.con('success',TITDELETED)
                    getGroup()
                }).catch(err=>{
                    swal.err()
                })
            }
        })
    }

    const releaseStudent = (i)=>{
        let student = students[i]
        swal.concan('question','¿Está seguro de liberar a este alumno?').then(result=>{
            if(result.isConfirmed){
                axiosapi.doGet(`/workshop/release/student/group/${student.id}`).then(res=>{
                    swal.con('success',TITUPDATED,TXTUPDATED)
                    getGroup()
                }).catch(err=>{
                    swal.err()
                })
            }
        })
    }

    const clearForm = ()=>{
        let date
        let classList = `form-control`
        elementName.value = group.name
        elementName.classList = classList
        fbName = []
        elementMin.value = group.minimum
        elementMin.classList = classList
        fbMin = []
        elementMax.value = group.maximum
        elementMax.classList = classList
        fbMax = []
        elementSchedule.value = group.schedule
        elementSchedule.classList = classList
        fbSchedule = []
        date = new Date(group.closing_date).toISOString().split('T')[0]
        elementClosingDate.value = date
        elementClosingDate.classList = classList
        fbClosingDate = []
        date = new Date(group.start_date).toISOString().split('T')[0]
        elementStartDate.value = date
        elementStartDate.classList = classList
        fbStartDate = []
        date = new Date(group.final_date).toISOString().split('T')[0]
        elementFinalDate.value = date
        elementFinalDate.classList = classList
        fbFinalDate = []

        elementStartDate.disabled = false
        elementFinalDate.disabled = false
    }

    const updateGroup = ()=>{
        let data = {
            id:idGroup,
            name: elementName.value,
            minimum: elementMin.value,
            maximum: elementMax.value,
            schedule: elementSchedule.value,
            closing_date: elementClosingDate.value,
            start_date: elementStartDate.value,
            final_date: elementFinalDate.value
        }
        axiosapi.doPost('/workshop/group/update',data).then(res=>{
            swal.con('success',TITUPDATED,TXTUPDATED)
            getGroup()
        }).catch(err=>{
            swal.err()
        })
    }

    // update valids
    const validNameG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbName = []
		target.className = `${elementClass} is-valid`

		// Formato de nombre válido
		let nameformat = /^([A-ZÁÉÍÓÚÑa-zñáéíóú]+[\s]*)+$/
		if(!nameformat.test(v)){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbName.push("El nombre no debe contener números o caracteres especiales, y debe empezar con mayúscula.")
		}
        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbName.push("Completar el campo.")
        }
		if(v.length > 50){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbName.push("El nombre debe contener máximo 50 caracteres.")
		}
		
		return validated
    }

    const validMinG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbMin = []
		target.className = `${elementClass} is-valid`
        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbMin.push("Completar el campo.")
        }
        validMaxG(elementMax)
		
		return validated
    }

    const validMaxG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbMax = []
		target.className = `${elementClass} is-valid`
        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbMax.push("Completar el campo.")
        }
        if(elementMin.value != '' ){
            if(parseInt(v) <= elementMin.value){
                validated = false
                target.className = `${elementClass} is-invalid`
                fbMax.push("El máximo de integrantes debe ser mayor al mínimo de integrantes.")
            }
        }

		return validated
    }

    const validScheduleG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbSchedule = []
		target.className = `${elementClass} is-valid`

        if(!v || v == ' '){
            validated = false
			target.className = `${elementClass} is-invalid`
			fbSchedule.push("Completar el campo.")
        }
		if(v.length < 3 || v.length > 50){
			validated = false
			target.className = `${elementClass} is-invalid`
			fbSchedule.push("El horario debe contener de 3 a 50 caracteres.")
		}
		
		return validated
    }

    const validCloseDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbClosingDate = []
		target.className = `${elementClass} is-valid`
        dateTomorrow(v)

        if(!v){
            console.log('es menor');
            validated = false
            elementStartDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbClosingDate.push("Seleccione una fecha.")
        }else{
            if(v < today){
                validated = false
                elementStartDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbClosingDate.push("La fecha no puede ser atrasada.")
            }else{
                elementStartDate.disabled = false
            }
        }
		
		return validated
    }

    const validStartDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbStartDate = []
		target.className = `${elementClass} is-valid`

        if(!v){
            validated = false
            elementFinalDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbStartDate.push("Seleccione una fecha.")
        }else{
            if(v < tomorrow){
                validated = false
                elementFinalDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbStartDate.push("La fecha debe ser mayor a la fecha límite de inscripción.")
            }else{
                elementFinalDate.disabled = false
            }
        }
        
		return validated
    }

    const validFinalDateG = (target) => {
        let validated = true
		let v = target.value
		let elementClass = "form-control"
		fbFinalDate = []
		target.className = `${elementClass} is-valid`

        if(!v){
            validated = false
            elementFinalDate.disabled = true
            target.className = `${elementClass} is-invalid`
            fbFinalDate.push("Seleccione una fecha.")
        }else{
            if(v < tomorrow){
                validated = false
                elementFinalDate.disabled = true
                target.className = `${elementClass} is-invalid`
                fbFinalDate.push("La fecha debe ser mayor a la fecha límite de inscripción.")
            }else{
                elementFinalDate.disabled = false
            }

            if(v < elementStartDate.value){
                validated = false
                target.className = `${elementClass} is-invalid`
                fbFinalDate.push("La fecha debe ser mayor a la fecha de inicio.")
            }
        }
		
		return validated
    }

    const listenerValidity = () => {
        elementName.addEventListener('input', (e) => {validNameG(e.target)})
        elementMin.addEventListener('input', (e) => {validMinG(e.target)})
        elementMax.addEventListener('input', (e) => {validMaxG(e.target)})
        elementSchedule.addEventListener('input', (e) => {validScheduleG(e.target)})
        elementClosingDate.addEventListener('input', (e) => {validCloseDateG(e.target)})
        elementStartDate.addEventListener('input', (e) => {validStartDateG(e.target)})
        elementFinalDate.addEventListener('input', (e) => {validFinalDateG(e.target)})
    }
    
    const checkFormValidation = ()=>{
        let ok = true
        ok = validNameG(elementName) && ok
        ok = validMinG(elementMin) && ok
        ok = validMaxG(elementMax) && ok
        ok = validScheduleG(elementSchedule) && ok
        ok = validCloseDateG(elementClosingDate) && ok
        ok = validStartDateG(elementStartDate) && ok
        ok = validFinalDateG(elementFinalDate) && ok

        if(ok){
            updateGroup()
            btncancel.click()
        }
    }

    const downloadPDF = ()=>{
        let rows = []
        for(let i = 0; i<students.length;i++){
            let row = {
                number:i+1,
                student: `${students[i].name} ${students[i].first_last_name} ${students[i].second_last_name}`
            }
            rows.push(row)
        }
        let columns = [
            {title:"No.",dataKey:"number"},
            {title:"Alumno",dataKey:"student"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
            {title:"*"},
        ]

        let doc = new jsPDF('p','pt')
        doc.setFontSize(18)
        doc.text("SIGETA - Sistema Gestión de Talleres UTEZ", 120, 40);
        doc.setFontSize(11)
        doc.text(
            "Universidad Tecnológica Emiliano Zapata del estado de Morelos",
            140,
            55
        )
        doc.setTextColor(100)
        doc.setFontSize(13)
        doc.text("L     I     S     T     A", 245, 100);
        doc.autoTable(columns, rows, {
            margin: { top: 120 },
            theme: "grid"
        });
        
        doc.save("Lista.pdf")
        
    }

    const dateToday = () => {
      var f = new Date();

      var anio = f.getFullYear();
      var _mes = f.getMonth();
      var _dia = f.getDate();
      _mes = _mes + 1;
      var mes = "";
      var dia = "";
      if (_mes < 10) {
        mes = "0" + _mes;
      } else {
        mes = _mes.toString();
      }
      if (_dia < 10) {
        dia = "0" + _dia;
      } else {
        dia = _dia;
      }

      var fecha = anio + "-" + mes + "-" + dia;
      console.log(fecha);
      today = fecha;
      dateTomorrow(fecha)
    }

    const dateTomorrow = (date) => {
        const hoy = new Date(date)
        const mañana = new Date(hoy)
        mañana.setDate(mañana.getDate() + 2)

        var anio = mañana.getFullYear();
        var _mes = mañana.getMonth();
        var _dia = mañana.getDate();
        _mes = _mes + 1;
        var mes = "";
        var dia = "";
        if (_mes < 10) {
            mes = "0" + _mes;
        } else {
            mes = _mes.toString();
        }
        if (_dia < 10) {
            dia = "0" + _dia;
        } else {
            dia = _dia;
        }

        var fecha = anio + "-" + mes + "-" + dia;
        tomorrow = fecha
        console.log(fecha);
    }

    onMount(()=>{
        getGroup()
        listenerValidity()
        dateToday()
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
                <i class="fa fa-chalkboard"></i> Datos del grupo <button on:click="{()=>{deleteGroup()}}" disabled="{students.length > 0}" class="float-end btn btn-outline-danger" ><i class="fa fa-trash-alt"></i> </button>
            </h2>
            <hr>
            <div class="row">
                <div class="col-12">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <img class="img-fluid rounded card" src="{group.w_image_url}" alt="Imagen del taller">
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="d-flex flex-wrap">
                                    <div class="h1 text-break align-self-center align-middle mx-2">{group.w_name}</div>
                                    <div class="h2 text-break align-self-center align-middle mx-2 text-muted">| {group.w_type}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <p>{group.w_description}</p>
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
                                    <div>{group.inscribed}/{group.maximum}</div>
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
                                        <span><i class="fa fa-users"></i> Fecha límite de inscripción</span> 
                                    </div>
                                    <div>{new Date(group.closing_date).toLocaleString().substring(0,10)}</div>
                                </div>
                                <div class="col-sm-6 order-3">
                                    <div class="fw-bold">
                                        <i class="fa fa-calendar-alt"></i> Fecha de inicio
                                    </div>
                                    <div>{new Date(group.start_date).toLocaleString().substring(0,10)}</div>
                                </div>
                                <div class="col-sm-6 order-4">
                                    <div class="fw-bold">
                                        <i class="fa fa-users"></i> Fecha de fin
                                    </div>
                                    <div>{new Date(group.final_date).toLocaleString().substring(0,10)}</div>
                                </div>
                                <div class="col-sm-12 col-md-2 order-md-2 order-last">
                                    <button on:click="{()=>{clearForm()}}" class="float-lg-end float-md-start w-100 btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="collap1 collap2">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="colap2" class="collapse multi-collapse row gy-3">
                        <div class="col">
                            <form on:submit="{(e)=>{e.preventDefault();checkFormValidation()}}">
                            <div class="row g-3 mb-3">
                                <div class="col-md-6 border-start border-primary border-2">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label" for="gname">
                                                <i class="fa fa-heading"></i> Nombre
                                            </label>
                                            <input 
                                                bind:this="{elementName}" 
                                                class="form-control" 
                                                type="text" 
                                                id="gname" 
                                                autocomplete="off" 
                                                placeholder="Grupo"
                                            >
                                            {#each fbName as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <label class="form-label" for="gmin">
                                                <i class="fa fa-users"></i> Mínimo de integrantes
                                            </label>
                                            <input 
                                                bind:this="{elementMin}" 
                                                class="form-control" 
                                                type="number" 
                                                id="gmin" 
                                                autocomplete="off" 
                                                placeholder="Mínimo de integrantes"
                                            >
                                            {#each fbMin as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-sm-6 col-md-12 col-lg-6">
                                            <label class="form-label" for="gmax">
                                                <i class="fa fa-users"></i> Máximo de integrantes
                                            </label>
                                            <input 
                                                bind:this="{elementMax}" 
                                                class="form-control" 
                                                type="text" id="gmax" 
                                                autocomplete="off" 
                                                placeholder="Máximo de integrantes"
                                            >
                                            {#each fbMax as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gschedule">
                                                <i class="fa fa-clock"></i> Horario
                                            </label>
                                            <input 
                                                bind:this="{elementSchedule}" 
                                                class="form-control" 
                                                type="text" 
                                                id="gschedule" 
                                                autocomplete="off" 
                                                placeholder="Horario"
                                            >
                                            {#each fbSchedule as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6 border-start border-primary border-2">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <label class="form-label" for="gclosedate">
                                                <i class="fa fa-calendar-alt"></i> Fecha límite de inscripción
                                            </label>
                                            <input 
                                                bind:this="{elementClosingDate}" 
                                                class="form-control" 
                                                type="date" 
                                                id="gclosedate"
                                                min="{today}"
                                            >
                                            {#each fbClosingDate as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gstartdate">
                                                <i class="fa fa-calendar-alt"></i> Fecha inicio
                                            </label>
                                            <input 
                                                bind:this="{elementStartDate}" 
                                                class="form-control" 
                                                type="date" 
                                                min = "{tomorrow}"
                                                id="gstartdate"
                                            >
                                            {#each fbStartDate as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                        <div class="col-12">
                                            <label class="form-label" for="gfinishdate">
                                                <i class="fa fa-calendar-alt"></i> Fecha fin
                                            </label>
                                            <input 
                                                bind:this="{elementFinalDate}" 
                                                class="form-control" 
                                                type="date" 
                                                min="{tomorrow}"
                                                id="gfinishdate"
                                            >
                                            {#each fbFinalDate as item}
                                                <div class="invalid-feedback">
                                                    {item}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3">
                                <div class="col-sm-6 col-md-4 offset-md-4 offset-lg-6 col-lg-3">
                                    <button bind:this="{btncancel}" on:click="{()=>{clearForm()}}" type="button" class="w-100 btn btn-secondary" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="collap1 collap2">
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
                {#if students.length == 0}
                    <NotRecords/>
                {:else}
                <div class="col-12">
                    <button on:click="{()=>{downloadPDF()}}" class="float-end btn btn-outline-danger">
                        <i class="fa fa-file-pdf"></i> Descargar
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-stripped table-hover">
                        <thead>
                            <tr class="text-center">
                                <th>No.</th>
                                <th>Nombre</th>
                                <th>Matrícula</th>
                                <th>Correo Electrónico Institucional</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each students as st,i}
                            <tr class="text-center">
                                <td>{i+1}</td>
                                <td>{st.name} {st.first_last_name} {st.second_last_name}</td>
                                <td>{st.school_id}</td>
                                <td>{st.email}</td>
                                <td>
									<div class="btn-group" role="group">
                                        {#if st.accredited == 0}
                                        <button on:click="{()=>{releaseStudent(i)}}" disabled="{canRealese(st.accredited)}" type="button" class="btn btn-outline-success">
                                            <i class="fas fa-check-circle" /> 
                                        </button>
                                        <button on:click="{()=>{deleteStudent(i)}}" type="button" class="btn btn-outline-danger">
                                            <i class="fas fa-trash-alt" /> 
                                        </button>
                                        {:else if st.accredited == 1}
                                        <button disabled type="button" class="btn btn-outline-primary">
                                            <i class="fas fa-check-circle" /> Liberado
                                        </button>
                                        {/if}
                                        <!-- {#if st.free == 1}
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
                                        {/if} -->
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