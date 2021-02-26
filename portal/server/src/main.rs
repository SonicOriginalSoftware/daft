use actix_files::NamedFile;
use actix_web::{HttpRequest, HttpResponse, Responder, Result};
use std::path::PathBuf;

async fn app(request: HttpRequest) -> Result<NamedFile> {
    // HttpResponse::Ok().body("Should return with app resources!");

    let path: PathBuf = request.match_info().query("filename").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

async fn api(_request: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("Should return with API response!")
}

async fn auth(_request: HttpRequest) -> impl Responder {
    HttpResponse::Ok().body("Should return with Auth response!")
}

// The below main function body needs the port to be configurable
// And once that is done, it can be abstracted into a shared module
// Each component will pretty much only use these scopes, and so the
// abstracted-out function should accept callbacks to handlers for
// these scopes

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    use actix_web::{web, App, HttpServer};

    HttpServer::new(|| {
        App::new()
            .route("/app/{filename:.*}", web::get().to(app))
            .service(web::resource("/api").to(api)) // FIXME Need anything /api* to go to the auth handler
            .service(web::resource("/auth").to(auth)) // FIXME Need anything /auth* to go to the auth handler
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
