package server.modules

import db.queryAccount
import io.ktor.routing.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import java.nio.ByteBuffer
import java.util.Base64

class Greeter(private val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}
fun Application.configureRouting() {
    println("jjjjfff")

    install(StatusPages) {
        // Status pages configuration
    }
    routing {
        get("/") {
            Greeter("World!").greet()
            val pk = call.parameters["pk"]
            println("pk $pk")
            if (pk != null) {
                val account = queryAccount(pk)
                if(account != null) {
                    println("pk ${account.image}")
                    val data = Base64.getDecoder().decode(account.image)
                    call.respondBytes(data, ContentType.Image.PNG)
                }
            }
            //call.respondText("Hello World!")
        }
    }
}
