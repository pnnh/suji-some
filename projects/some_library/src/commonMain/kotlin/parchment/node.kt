package parchment

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.*

private val json = Json {
    isLenient = true
    prettyPrint = true
    ignoreUnknownKeys = true
    coerceInputValues = true
}

//@Serializable
//open class Model(val text: String = "")

abstract class Node(
    //val text: String = "",
//    val prev: Blot? = null,
//    val next: Blot? = null,
//    val parent: Blot? = null,
//    companion object {
//        fun create(): Blot {
//            return Blot()
//        }
//    }
    var name: String = "",
    val children: ArrayList<Node> = arrayListOf<Node>()
) {

    //var text: StringBuilder = StringBuilder()
    //var text: String = ""

//    constructor(name: String, text: String) : this() {
//        this.name = name
//        //this.text = StringBuilder(text)
//    }


    companion object {
        private fun castBlot2Map(blot: Node): JsonObject {
            val map = mutableMapOf<String, JsonElement>()
            val jsonObject = JsonObject(content = map)
            map["name"] = JsonPrimitive(blot.name)
            map["value"] = blot.encodeToJsonObject()
            val list = arrayListOf<JsonObject>()
            for(b in blot.children) {
                val subMap = castBlot2Map(b)
                list.add(subMap)
            }
            map["children"] = JsonArray(list)
            return jsonObject
        }
        fun encodeToJson(blot: Node): String {
            val jsonObject = castBlot2Map(blot)
            val a = json.encodeToString<JsonObject>(JsonObject.serializer(), jsonObject)
            return a
        }
    }
    protected abstract fun encodeToJsonObject(): JsonObject
}

class HeaderNode(val text: String, val header: Int = 0): Node(name = "header") {
    override fun encodeToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["header"] = JsonPrimitive(header)
        return jsonObject
    }
}

class LinkNode(val text: String, val link: String = ""): Node(name = "link") {
    override fun encodeToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["link"] = JsonPrimitive(link)
        return jsonObject
    }
}

class TextNode(val text: String = "",
               val bold: Boolean = false,
               val italic: Boolean = false,
               val font: String = "",
               val strike: Boolean = false,
               val underline: Boolean = false,
               val color: String = "",
               val background: String = "",): Node(name = "text") {
//    companion object {
//        fun create(): Blot {
//            return Blot()
//        }
//    }

    override fun encodeToJsonObject(): JsonObject {
        val map = mutableMapOf<String, JsonElement>()
        val jsonObject = JsonObject(content = map)
        map["text"] = JsonPrimitive(text)
        map["bold"] = JsonPrimitive(bold)
        map["italic"] = JsonPrimitive(italic)
        map["font"] = JsonPrimitive(font)
        map["strike"] = JsonPrimitive(strike)
        map["underline"] = JsonPrimitive(underline)
        map["color"] = JsonPrimitive(color)
        map["background"] = JsonPrimitive(background)
        return jsonObject
    }
}
