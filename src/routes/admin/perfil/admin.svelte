<script>
    import axiosapi from './../../../utils/axiosapi'
    import swal from './../../../utils/sweetalert2'
    import { browser } from "$app/env";
    import { onMount } from 'svelte';

    let user = [];
    let userEdit = [];
    let notEditing = true;

    const TITUPDATED = "Actualizado"
	const TXTUPDATED = "El registro se ha actualizado exitosamente."

    let id = 0;
    if (browser){
        id = JSON.parse(localStorage.getItem('user')).idUser;
    }
    const getAdminInfo = async () => {
		await axiosapi.doGet(`/admin/get/${id}`)
        .then(({data})=>{
			user = data;
            userEdit = {...user};
		}).catch(()=>{
			swal.err()
		})
	}

    const saveUser = async () => {
        await axiosapi.doPut(`/admin/update/${id}`, userEdit)
        .then(() => {
            cancelEdit();
            swal.con('success',TITUPDATED,TXTUPDATED);
            getAdminInfo();
		}).catch(()=>{
			swal.err()
		})
	}

    const editInfo = () => {
		notEditing = false;
	}

    const cancelEdit = () => {
		notEditing = true;
        getAdminInfo()
	}

    $: sameInfo = JSON.stringify(user) == JSON.stringify(userEdit);
    
    onMount(async () => {
        await getAdminInfo();
        userEdit = {...user};
	});

</script>

<div class="container rounded bg-white mt-4">
    <div class="row">
        <div class="col-md-3 border-right">
            <div class="d-flex flex-column align-items-center text-center p-3 py-5"><img class="my-3" width="150px" src="/img/HALCÓN_2016.png" alt="profile"><span class="font-weight-bold">{user.name} {user.first_last_name}</span><span class="text-black-50">{user.email}</span><span> </span></div>
        </div>
        <div class="col-md-7 border-right">
            <div class="p-3 py-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="text-right">Administrador</h4>
                </div>
                <div class="row mt-2">
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-user"></i> Nombre (s)</label><input type="text" class="form-control" bind:value={userEdit.name} disabled="{notEditing}"></div>
                    <div class="col-md-6"><label class="labels" for=""><i class="fas fa-user"></i> Primer apellido</label><input type="text" class="form-control" bind:value={userEdit.first_last_name} disabled="{notEditing}" ></div>
                    <div class="col-md-6"><label class="labels" for=""><i class="fas fa-user"></i> Segundo apellido</label><input type="text" class="form-control" bind:value={userEdit.second_last_name} disabled="{notEditing}" ></div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-envelope"></i> Correo institucional</label><input type="text" class="form-control" bind:value={userEdit.email} disabled="{notEditing}"></div>
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-suitcase"></i> Puesto</label><input type="text" class="form-control" bind:value={userEdit.employment} disabled="{notEditing}"></div>
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-phone"></i> Teléfono</label><input type="text" class="form-control" bind:value={userEdit.phone} disabled="{notEditing}"></div>
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-phone"></i> Teléfono celular</label><input type="text" class="form-control" bind:value={userEdit.cellphone} disabled="{notEditing}"></div>
                    <div class="col-md-12 mb-2"><label class="labels" for=""><i class="fas fa-envelope"></i> Correo personal</label><input type="text" class="form-control" bind:value={userEdit.personal_email} disabled="{notEditing}"></div>
                </div>
            </div>
        </div>
        <div class="col-md-2">
            <div class="p-2 py-5">
                <div class="justify-content-between align-items-center experience">
                    {#if notEditing}
                    <button class="btn btn-outline-primary float-end rounded-pill align-middle" on:click="{()=>editInfo()}">
                        <i class="fas fa-edit" />
                        <span>Editar</span>
                    </button>
                    {:else}               
                    <button class="btn btn-outline-secondary float-end rounded-pill align-middle" on:click="{()=>cancelEdit()}">
                        <i class="fas fa-times-circle"/>
                        <span>Cancelar</span>
                    </button>
                    <button class="btn btn-outline-success float-end rounded-pill align-middle mt-2" on:click="{()=>saveUser()}" disabled="{sameInfo}">
                        <i class="fas fa-save" />
                        <span>Guardar</span>
                    </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
<div>
</div>

<style>

.form-control:focus {
    box-shadow: none;
}
</style>