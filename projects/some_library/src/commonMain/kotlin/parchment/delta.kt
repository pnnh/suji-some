package parchment

import delta.Delta
import delta.InsertAttributes
import delta.OpObject
import delta.OpString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

class DeltaSerializer() {
    private val json = Json {
        isLenient = true
        prettyPrint = true
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    fun parseToNode(deltaString: String): Node {
        val delta = json.decodeFromString<Delta>(deltaString)
        val builder = StringBuilder("")
        val blot = ColumnNode()
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
            blot.children.add(TextNode(text = builder.toString()))
        }
        return blot
    }

    private fun tagHeader(builder: StringBuilder, children: ArrayList<Node>, header: Int) {
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

    private fun tagLinkBlot(builder: StringBuilder, children: ArrayList<Node>, text: String, attributes: InsertAttributes) {
        val prevText = builder.toString()
        if(prevText.isNotEmpty()) {
            children.add(TextNode(text = prevText))
        }
        children.add(LinkNode(text, attributes.link))
        builder.clear()
    }

    private fun tagTextBlot(builder: StringBuilder, children: ArrayList<Node>, text: String, attributes: InsertAttributes) {
        val prevText = builder.toString()
        if(prevText.isNotEmpty()) {
            children.add(TextNode(text = prevText))
        }
        val textNode = TextNode(text = text,
            bold = attributes.bold,
            italic = attributes.italic,
            font = attributes.font,
            strike = attributes.strike,
            underline = attributes.underline,
            color = attributes.color,
            background = attributes.background,
        )
        children.add(textNode)
        builder.clear()
    }

}