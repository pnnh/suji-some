package utils

import kotlin.test.Test
import kotlin.test.assertEquals

class UtilsTests {
    @Test
    fun testDeltaToBlots() {
        var text = StringBuilder("标\n题一")

        val index = text.lastIndexOf("\n", text.lastIndex)
        var headerIndex = 0
        if (index > 0) {
            headerIndex = index + 1
        }
        val newText = text.substring(headerIndex, text.lastIndex)
        text.insert(headerIndex, "<header>")
        text.append("</header>")
        println("index $index | $newText |")
        println("index2 $text |")
    }
}