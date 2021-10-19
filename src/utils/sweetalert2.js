export default{
    concan(icon,title,text){
        return Swal.fire({
            icon,
            title,
            text,
            showCancelButton: true,
            confirmButtonColor: '#0D6EFD',
            confirmButtonText: 'Confirmar',
            cancelButtonColor: '#6C757D',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        })
    },
    con(icon,title,text,){
        return Swal.fire({
            icon,
            title,
            text,
            confirmButtonColor: '#0D6EFD'
        })
    },
    err(){
        return Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Ha ocurrido un problema en el servidor, intente más tarde.',
            confirmButtonColor: '#0D6EFD'
        })
    }

}
