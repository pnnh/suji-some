package server.modules

import io.ktor.features.*
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*

val Application.envKind get() = environment.config.property("ktor.environment").getString()
val Application.isDebug get() = envKind == "debug"
val Application.isTest get() = envKind == "test"
val Application.isRelease get() = envKind != "debug" && envKind != "test"
val Application.corsHost get() = if (isDebug) "127.0.0.1:5000" else "sfx.xyz"

fun Application.configurePlugins() {
    install(ForwardedHeaderSupport)
    install(DefaultHeaders)
    install(Compression) {
        gzip {
            priority = 0.9
        }
        deflate() {
            priority = 1.0
        }
    }
    install(CORS) {
        method(HttpMethod.Options)
        method(HttpMethod.Head)
        method(HttpMethod.Get)
        method(HttpMethod.Post)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        method(HttpMethod.Patch)
        header(HttpHeaders.Authorization)
        header(HttpHeaders.XForwardedProto)
        header(HttpHeaders.Accept)
        header(HttpHeaders.AcceptLanguage)
        header(HttpHeaders.ContentType)
        header(HttpHeaders.ContentLanguage)
        header(HttpHeaders.AccessControlAllowHeaders)
        header(HttpHeaders.AccessControlAllowOrigin)
        host(corsHost, listOf("http", "https"))
        allowSameOrigin = true
        allowCredentials = true
        allowNonSimpleContentTypes = true
        maxAgeInSeconds = 3600 * 24
    }
    routing {
    }
}
