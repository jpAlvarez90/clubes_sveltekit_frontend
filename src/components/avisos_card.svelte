<script>
    export let description
</script>
<div class="card mx-auto w-100" style="height: 12rem;">
    <div class="card-body">
        <h5 class="card-title">Titulo de la card</h5>
        <div class=" overflow-hidden mb-1 position-relative" style="height: 6rem;">
            <p class="card-text withGradient">{description}</p>
        </div>
        <a href="#" class="stretched-link">Ver mas</a>
    </div>
</div>

<style>
    .withGradient {
        background: linear-gradient(180deg, rgb(0, 0, 0), rgba(240, 240, 240, 0.158));
        background-clip: text;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
    }
</style>