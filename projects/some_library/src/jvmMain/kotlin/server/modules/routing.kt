package server.modules

import db.queryAccount
import io.ktor.routing.*
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.util.Identity.decode
import utils.AESCrypt
import java.util.Base64

class Greeter(private val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}
fun Application.configureRouting() {
    val otpAesKey = environment.config.propertyOrNull("ktor.otpAesKey")?.getString()
    println("otpAesKey $otpAesKey")
    install(StatusPages) {
        // Status pages configuration
    }
    routing {
        get("/account/totp/image") {
            Greeter("World!").greet()
            val verify = call.parameters["v"]
            if (verify != null && otpAesKey != null) {
                // todo 解密后应是pk:timestamp格式，校验是否已经过期
                val pk = AESCrypt.decrypt(verify, otpAesKey)
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
