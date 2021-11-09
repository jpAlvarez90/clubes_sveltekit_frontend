<script>
    import Navbar from '../components/navbar.svelte';
</script>

<Navbar />
<slot></slot>

<style>
    :global(.main-card){
        background-color: #F8F9FA;
    }
    :global(.withGradient){
        background: linear-gradient(180deg, rgb(0, 0, 0), rgba(240, 240, 240, 0.158));
        background-clip: text;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
    
    }

    :global(.card:hover){
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
        transition: .3s transform cubic-bezier(.155,1.105,.295,1.12),.3s box-shadow,.3s -webkit-transform cubic-bezier(.155,1.105,.295,1.12);
        cursor: pointer;
    }
</style>