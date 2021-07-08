package server.controllers

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.serialization.*
import kotlinx.css.*
import kotlinx.html.body
import kotlinx.html.h1
import kotlinx.html.head
import kotlinx.html.link
import kotlinx.serialization.Serializable
import server.db.newQuest
import server.db.queryQuest
import xyz.sfx.utils.NewPk
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.*

@Serializable
data class QuestPost(val title: String)

fun Application.configureQuestController() {
    install(ContentNegotiation) {
        json()
    }

    routing {
        get("/quest") {
            val questList = queryQuest("1")
            if (questList.count() > 0) {
                call.respond(questList.first())     // 暂时不支持响应数组
            }
        }

        post("/quest") {
            val pk = NewPk()

            val questPost = call.receive<QuestPost>()
            if (questPost.title.isEmpty()) {
                call.response.status(HttpStatusCode.InternalServerError)
            } else {
                newQuest(pk, questPost.title)
                call.response.status(HttpStatusCode.OK)
            }
        }

        get("/styles.css") {
            call.respondCss {
                body {
                    backgroundColor = Color.darkBlue
                    margin(0.px)
                }
                rule("h1.page-title") {
                    color = Color.white
                }
            }
        }

        get("/html-css-dsl") {
            call.respondHtml {
                head {
                    link(rel = "stylesheet", href = "/styles.css", type = "text/css")
                }
                body {
                    h1(classes = "page-title") {
                        +"Hello from Ktor!"
                    }
                }
            }
        }
    }
}

suspend inline fun ApplicationCall.respondCss(builder: CSSBuilder.() -> Unit) {
    this.respondText(CSSBuilder().apply(builder).toString(), ContentType.Text.CSS)
}
