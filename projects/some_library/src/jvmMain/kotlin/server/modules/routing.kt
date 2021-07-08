package server.modules

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import org.joda.time.DateTime
import org.joda.time.Seconds
import server.db.queryAccount
import utils.AESCrypt
import java.util.*

fun Application.configureRouting() {
    val otpAesKey = environment.config.propertyOrNull("ktor.otpAesKey")?.getString()
    install(StatusPages) {
        // Status pages configuration
    }
    routing {
        get("/account/otp/image") {
            try{
                val verify = call.parameters["v"]
                if (verify != null && otpAesKey != null) {
                    val verifyDecrypted = AESCrypt.decrypt(verify, otpAesKey)
                    val verifyArray = verifyDecrypted.split(",")
                    if (verifyArray.count() == 2) {
                        val startTime = DateTime(verifyArray[0].toLong() * 1000L)
                        val seconds = Seconds.secondsBetween(startTime, DateTime.now())
                        if (seconds.seconds > 300) {
                            call.respond("链接已超时")
                        } else {
                            val account = queryAccount(verifyArray[1])
                            if(account != null) {
                                val data = Base64.getDecoder().decode(account.image)
                                call.respondBytes(data, ContentType.Image.PNG)
                            }
                        }
                    }
                }
            } catch(e: Exception) {
                call.application.environment.log.error(e.toString())
                call.respond("出现错误")
            }
        }
    }
}
