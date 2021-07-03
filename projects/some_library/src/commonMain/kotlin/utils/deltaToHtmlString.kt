package utils

import delta.Delta
import delta.InsertAttributes
import delta.OpObject
import delta.OpString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.*
import parchment.Node
import kotlin.text.lastIndex
import parchment.HeaderNode
import parchment.LinkNode
import parchment.TextNode

private val json = Json {
    isLenient = true
    prettyPrint = true
    ignoreUnknownKeys = true
    coerceInputValues = true
}

fun deltaToBlot(deltaString: String): Node {
    val delta = json.decodeFromString<Delta>(deltaString)
    val builder = StringBuilder("")
    var blot = Node()
    println("delta length ${delta.ops.count()}")
    for(a in delta.ops) {
        if (a is OpObject) {
            println("isObject")
        } else if (a is OpString) {
            if(a.attributes.header > 0) {
                tagHeader(builder, blot.children, a.attributes.header)
            } else if(a.attributes.link.isNotEmpty()) {
                tagLinkBlot(builder, blot.children, a.insert, a.attributes)
            } else if(a.attributes.italic || a.attributes.bold ||
                    a.attributes.font.isNotEmpty() || a.attributes.strike ||
                    a.attributes.underline || a.attributes.color.isNotEmpty() ||
                    a.attributes.background.isNotEmpty()) {
                tagTextBlot(builder, blot.children, a.insert, a.attributes)
            } else {
                builder.append(a.insert)
            }
        } else {
            throw Exception("未知Op")
        }
    }
    if(builder.toString().isNotEmpty()) {
        blot.children.add(TextNode(builder.toString()))
    }
    return blot
}

fun tagHeader(builder: StringBuilder, children: ArrayList<Node>, header: Int) {
    val index = builder.lastIndexOf("\n", builder.lastIndex)
    var headerIndex = 0
    if (index > 0) {
        headerIndex = index + 1
    }
    val prevText = builder.substring(0, headerIndex)
    val newText = builder.substring(headerIndex, builder.lastIndex + 1)
    if(prevText.isNotEmpty()) {
        children.add(TextNode(text = prevText))
    }
    children.add(HeaderNode(newText, header))
    builder.clear()
}

fun tagLinkBlot(builder: StringBuilder, children: ArrayList<Node>, text: String, attributes: InsertAttributes) {
    val prevText = builder.toString()
    if(prevText.isNotEmpty()) {
        children.add(TextNode(text = prevText))
    }
    children.add(LinkNode(text, attributes.link))
    builder.clear()
}

fun tagTextBlot(builder: StringBuilder, children: ArrayList<Node>, text: String, attributes: InsertAttributes) {
    val prevText = builder.toString()
    if(prevText.isNotEmpty()) {
        //tagTextBlot(builder, children, prevText, InsertAttributes())
        children.add(TextNode(text = prevText))
    }
    children.add(TextNode(text = text))
    builder.clear()
}

fun encodeBlotHtml(blot: Node): String {
    val builder = StringBuilder()
    builder.append("<${blot.name}>${blot.text}")
    for(b in blot.children) {
        builder.append(encodeBlotHtml(b))
    }
    builder.append("</${blot.name}>")
    return builder.toString()
}

fun printBlotJson(blot: Node): String {
    val jsonObject = castBlot2Map(blot)
    val a = json.encodeToString<JsonObject>(JsonObject.serializer(), jsonObject)
    return a
}

private fun castBlot2Map(blot: Node): JsonObject {
    val map = mutableMapOf<String, JsonElement>()
    val jsonObject = JsonObject(content = map)
    map["name"] = JsonPrimitive(blot.name)
    map["text"] = JsonPrimitive(blot.text.toString())
    val list = arrayListOf<JsonObject>()
    for(b in blot.children) {
        val subMap = castBlot2Map(b)
        list.add(subMap)
    }
    map["children"] = JsonArray(list)
    return jsonObject
}