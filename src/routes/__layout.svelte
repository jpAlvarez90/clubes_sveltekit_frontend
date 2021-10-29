<script>
    import Navbar from '../components/navbar.svelte';
</script>

<Navbar />
<slot></slot>

<style>
    :global(.main-card){
        background-color: #F8F9FA;
    }
</style>