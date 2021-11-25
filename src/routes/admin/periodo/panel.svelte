<script>
    import axiosapi from './../../../utils/axiosapi'
    import swal from './../../../utils/sweetalert2'
    import { onMount } from 'svelte';

    
	const TITQACTIVATE = "¿Está seguro que desea activar el siguiente periodo?"
	const TXTQACTIVATE = "Esta acción no se puede deshacer."
	const TITACTIVATE = "Activado"
	const TXTACTIVATE = "Se ha activado el siguiente periodo con éxito."

    let quarterly_term = [];
    let year = 0;
    let currentPeriod = {};
    let nextQT = {};
    let lastRow = {};

    const getQuarterTerm = async () => {
		await axiosapi.doGet(`/term/get/`)
        .then(({data})=>{
            quarterly_term = data;
		}).catch(()=>{
			swal.err()
		})
	}
    
    const getCurrentPeriod = async () => {
		await axiosapi.doGet(`/period/get/`)
        .then(({data})=>{
            lastRow = data;
            year = lastRow.year;
            currentPeriod = quarterly_term.find(q => q.id == data.id_qu_te);
		}).catch(()=>{
            swal.err()
		})
	}
    
    const activateNextPeriod = () => {
        swal.concan('question',TITQACTIVATE, TXTQACTIVATE).then(async result => {
			if(result.isConfirmed){
                console.log(year);
				await axiosapi.doPost(`/period/activate/${lastRow.id}`, {
                    year,
                    id_qu_te: nextQT.id
                }).then(async ()=>{
					swal.con('success',TITACTIVATE,TXTACTIVATE)
                    await getQuarterTerm();
                    await getCurrentPeriod();
                    let nextId = 0;
                    if(currentPeriod.id == 3){
                        nextId = 1;
                    }else if (currentPeriod.id == 2) {
                        nextId = 3;
                    }else{
                        nextId = 2;
                    }
                    nextQT = quarterly_term.find(q => q.id == nextId);
                    if (nextQT.id == 1) {
                        year = year+1;
                    }
				});
			}
		})
	}
    
    onMount(async () => {
        year = new Date().getFullYear();
        await getQuarterTerm();
        await getCurrentPeriod();
        let nextId = 0;
        if(currentPeriod.id == 3){
            nextId = 1;
        }else if (currentPeriod.id == 2) {
            nextId = 3;
        }else{
            nextId = 2;
        }
        nextQT = quarterly_term.find(q => q.id == nextId);
        if (nextQT.id == 1) {
            year = year+1;
        }
	});
</script>

<div class="container">
    <div class="row pt-4 mt-5">
        <div class="cold-md-4">
            <div class="card card-blog shadow">
                <div class="card-image shadow">
                    <img class="img" src="https://scontent.fmex36-1.fna.fbcdn.net/v/t1.6435-9/231020379_3010653835867448_4391276383959040543_n.jpg?_nc_cat=104&ccb=1-5&_nc_sid=e3f864&_nc_eui2=AeHmg-tRwHVhFpsx_XUSPKC40lKRfk2XfbrSUpF-TZd9uo_LHlKHHpj8aY4uAFTfJEir8XOK2978SgLgs3LP6lxA&_nc_ohc=UP5VRU86zYQAX9qpoyA&_nc_ht=scontent.fmex36-1.fna&oh=1345932cbc82ab894fde0251b8a8b27a&oe=619FBF99" alt="fondo">
                </div>
                <div class="card-body text-center d-flex mt-4">
                    <div class="col-4">
                        <div class="card shadow text-dark bg-secondary mb-3" style="max-width: 18rem;">
                            <div class="card-header" style=" color: white;">Periodo actual</div>
                            <div class="card-body" style=" color: white;">
                              <h5 class="card-title">{currentPeriod.term} {lastRow.year}</h5>
                            </div>
                        </div>
                    </div>
                    <div class="col-4">
                        <button type="button" class="btn btn-primary mt-4" style="height: fit-content;" on:click="{()=>{activateNextPeriod()}}">Activar siguiente periodo</button>
                    </div>
                    <div class="col-4">
                        <div class="card shadow text-dark bg-light mb-3" style="max-width: 18rem;">
                            <div class="card-header">Siguiente periodo</div>
                            <div class="card-body">
                              <h5 class="card-title">{nextQT.term} {year}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style>
.card {
    display: inline-block;
    position: relative;
    width: 100%;
    margin-bottom: 30px;
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.87);
    background: #fff;
    /*
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    */
}

.card .card-image {
    height: 60%;
    position: relative;
    overflow: hidden;
    margin-left: 15px;
    margin-right: 15px;
    margin-top: -30px;
    border-radius: 6px;
    /*
    box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
    */
}

.card .card-image img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    pointer-events: none;
}

.card img {
    width: 100%;
    height: auto;
}


.card .ftr div {
    display: inline-block;
}

/*---------------------------------------------------------------------- /
BUTTONS
----------------------------------------------------------------------- */

.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.btn {
    border: none;
    border-radius: 3px;
    position: relative;
    padding: 12px 30px;
    margin: 10px 1px;
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0;
    will-change: box-shadow, transform;
    transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:focus,
.btn:active,
.btn:active:focus {
    outline: 0;
}
</style>