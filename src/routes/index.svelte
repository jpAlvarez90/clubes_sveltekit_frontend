<script>
    let img = `
    https://pbs.twimg.com/media/CtYhdNOVYAA_jIF?format=jpg&name=large
    `
    let c1 = `/landing/c1.jpg`
    let c2 = `/landing/c2.jpg`
    let c3 = `/landing/c3.jpg`

    let f1 = `/landing/f1.jpg`
    let f2 = `/landing/f2.jpg`
    let f3 = `/landing/f3.jpg`

</script>

<main>
    <div class="main-card container-lg my-4 p-4 rounded border shadow">
        <div class="container col-xxl-8 px-4 py-5">
            <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div class="col-10 col-sm-8 col-lg-6">
                <img src="{img}" class="d-block mx-lg-auto img-fluid rounded" alt="Imagen principal" loading="lazy" width="700" height="500">
                </div>
                <div class="col-lg-6">
                <h1 class="display-5 fw-bold lh-1 mb-3">Sistema de Talleres Universitarios</h1>
                <p class="lead">
                    Entra a la plataforma, encuentra todos los talleres disponibles ofertados por la <b>Universidad Tecnológica Emiliano Zapata del Estado de Morelos</b>, participa acitvamente en los diferentes eventos organizados por los talleres universitarios.
                    ¡Adéntrate en la comunidad estudiantil y participa ya!
                </p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                    <a href="/registro" type="button" class="btn btn-primary btn-lg px-4 me-md-2">¡Regístrate ahora!</a>
                    <a href="/talleres" type="button" class="btn btn-outline-secondary btn-lg px-4">Ver talleres</a>
                </div>
                </div>
            </div>
        </div>
        <div class="container pb-5">
            <div class="carousel slide " data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img src="{c1}" class="d-block w-100" alt="img1">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>¡Forma parte de la comunidad!</h5>
                        <p>Regístrate en uno de nuestros talleres deportivos y culturales.</p>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img src="{c2}" class="d-block w-100" alt="img2">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>¡Participa ahora!</h5>
                        <p>Participa en las actividades escolares formando parte de un taller.</p>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img src="{c3}" class="d-block w-100" alt="img3">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>¡No necesitas preocuparte por nada!</h5>
                        <p>Contamos con material y los recursos necesarios para que participes.</p>
                    </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            </div>
        </div>
        <div class="container pb-5 ">
            <hr class="featurette-divider">
    
            <div class="row featurette">
                <div class="col-md-7 my-auto">
                    <h2 class="text-uppercase featurette-heading">Teatro <span class="text-muted">Taller cultural.</span></h2>
                    <p class="lead">
                        El teatro forma parte del grupo de las artes escénicas. Su desarrollo está vinculado con actores que representan una historia ante una audiencia. Este arte, por lo tanto, combina diversos elementos, como la gestualidad, el discurso, la música, los sonidos y la escenografía.
                    </p>
                </div>
                <div class="col-md-5">
                <img class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" src="{f1}" alt="f1" width="500" height="500">
    
                </div>
            </div>
    
            <hr class="featurette-divider">
    
            <div class="row featurette">
                <div class="col-md-7 my-auto order-md-2">
                <h2 class="text-uppercase featurette-heading">Música <span class="text-muted">Taller cultural.</span></h2>
                <p class="lead">
                    Es un curso teórico-práctico que tiene como propósito que el estudiante conozca y experimente los elementos de la música en las artes escénicas y el vocabulario musical básico para su aplicación en la comprensión y ejecución musical, a través de la interpretación musical básica en canto y en por lo menos la ejecución.
                </p>
                </div>
                <div class="col-md-5 order-md-1">
                    <img class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" src="{f2}" alt="f2" width="500" height="500">
    
                </div>
            </div>
    
            <hr class="featurette-divider">
    
            <div class="row featurette">
                <div class="col-md-7 my-auto">
                <h2 class="text-uppercase sfeaturette-heading">Tae Kwon Do Mixto <span class="text-muted">Taller deportivo.</span></h2>
                <p class="lead">
                    El Taekwondo es un arte marcial moderno de los coreanos. Este deporte o arte marcial, se sustenta en un estilo de combate que utiliza únicamente los pies, las manos y otras partes del cuerpo, sin usar armas, lo que lo hace más competitivo por la rapidez y precisión.
                </p>
                </div>
                <div class="col-md-5">
                    <img class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" src="{f3}" alt="f3" width="500" height="500">
    
                </div>
            </div>
    
    
        </div>
    </div>
</main>



<style>
    div.row.featurette>div>h2{
        font-size: 50px;
    }
</style>
