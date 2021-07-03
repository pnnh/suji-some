package utils

import delta.Delta
import delta.OpObject
import delta.OpString
import kotlinx.serialization.decodeFromString
import parchment.Blot
import kotlinx.serialization.json.*
import kotlin.text.lastIndex
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import parchment.HeaderBlot
import parchment.LinkBlot
import parchment.TextBlot

private val json = Json {
    isLenient = true
    ignoreUnknownKeys = true
    coerceInputValues = true
}

fun deltaToBlots(deltaString: String): ArrayList<Blot> {
    val delta = json.decodeFromString<Delta>(deltaString)
    var text = ""
    var blots = arrayListOf<Blot>()
    for(a in delta.ops) {
        println("delta== ${a is OpObject}")
        if (a is OpObject) {

        } else if (a is OpString) {
            text += a.insert
            if(a.attributes.header > 0) {

            } else if(!a.attributes.link.isNullOrEmpty()) {
                val blot = LinkBlot(text = a.insert, link = a.attributes.link)
                blots.add(blot)
            } else {
                val blot = TextBlot(text = text)
                blots.add(blot)
            }
            text = ""
        } else {
            throw Exception("未知Op")
        }
    }
    return blots
}