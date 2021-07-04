package server.modules

import db.queryAccount
import io.ktor.routing.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import utils.AESCrypt
import java.util.Base64

class Greeter(private val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}
fun Application.configureRouting() {

    install(StatusPages) {
        // Status pages configuration
    }
    routing {
        get("/account/totp/image") {
            Greeter("World!").greet()
            val pk = call.parameters["pk"]
            if (pk != null) {

                val account = queryAccount(pk)
                if(account != null) {
                    val data = Base64.getDecoder().decode(account.image)
                    call.respondBytes(data, ContentType.Image.PNG)
                }
            }
            //call.respondText("Hello World!")
        }
    }
}
