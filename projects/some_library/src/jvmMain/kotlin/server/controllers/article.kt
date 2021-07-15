package server.controllers

import io.ktor.application.*
import io.ktor.html.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.html.*
import kotlinx.html.stream.appendHTML
import slate.*


fun Application.configureArticleController() {
    routing {
        get("/article") {
            val editorString = """
            {
	"children": [{"name":"paragraph","children":[{"name":"text","text":"a"}]},{"name":"header","children":[{"name":"text","text":"b"}],"header":1},{"name":"codeblock","children":[{"name":"code","text":"<h1>hello</h1>console.log(\"hello\");"}],"language":"js"},{"name":"paragraph","children":[{"name":"text","text":"c"}]}]
}
        """.trimIndent()
            val editor = decodeEditorFromString(editorString)
            val text = buildEditor(editor)
            println("text $text")
            call.respondText(ContentType.Text.Html) { text }
        }
    }
}

fun buildEditor(editor: SFEditor): String {
    val builder = StringBuilder()
    builder.appendHTML().html {
        body {
            div {
                a("https://kotlinlang.org") {
                    target = ATarget.blank
                    +"Main site"
                }
            }
            editor.children.forEach { it ->
                buildNode(it, builder)
            }
        }
    }
    return builder.toString()
}

fun buildNode(node: SFNode, builder: StringBuilder) {
    when(node.name) {
        "paragraph" -> buildParagraph(node as SFParagraph, builder)
        "header" -> buildHeader(node as SFHeader, builder)
        "codeblock" -> buildCodeBlock(node as SFCodeBlock, builder)
        else ->
            builder.appendHTML().div {
                +node.name
            }
    }
}

fun buildParagraph(node: SFParagraph, builder: StringBuilder) {
    builder.appendHTML().p {
        node.children.forEach { it ->
            when(it.name) {
                "text" -> buildText(it as SFText, builder)
                else -> throw IllegalArgumentException()
            }
        }
    }
}

fun buildHeader(node: SFHeader, builder: StringBuilder) {
    when(node.header) {
        1 -> builder.appendHTML().h1 {
            +node.name
        }
        2 -> builder.appendHTML().h2 {
            +node.name
        }
        else -> throw IllegalArgumentException("无效标题 ${node.header}")
    }
}

fun buildCodeBlock(node: SFCodeBlock, builder: StringBuilder) {
    builder.appendHTML().div("code-block") {
        node.children.forEach { it ->
            when(it.name) {
                "code" -> buildCode(it as SFCode, builder)
                else -> throw IllegalArgumentException()
            }
        }
    }
}

fun buildText(node: SFText, builder: StringBuilder) {
    builder.appendHTML().span {
        +node.text
    }
}

fun buildCode(node: SFCode, builder: StringBuilder) {
    builder.appendHTML().span {
        +node.text
    }
}