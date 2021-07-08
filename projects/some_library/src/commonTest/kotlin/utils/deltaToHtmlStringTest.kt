package utils

import kotlinx.serialization.json.Json
import parchment.DeltaSerializer
import parchment.NodeSerializer
import parchment.deltaToHtmlString
import parchment.deltaToJsonString
import kotlin.test.Test

class UtilsTests {
    private val json = Json {
        isLenient = true
        ignoreUnknownKeys = true
        coerceInputValues = true
    }
    @Test
    fun testDeltaToBlots() {
        var text = StringBuilder("标\n题一\n")

        val index = text.lastIndexOf("\n", text.lastIndex - 1)
        var headerIndex = 0
        if (index > 0) {
            headerIndex = index + 1
        }
        val prevText = text.substring(0, headerIndex)
        val newText = text.substring(headerIndex, text.lastIndex)
//        text.insert(headerIndex, "<header>")
//        text.append("</header>")
        println("index $index | $prevText | $newText |")
        //println("index2 $text |")
    }

    @Test
    fun testPrint() {
        val packet = """
            {
                "ops": [
                    {
                        "insert": "随机文本\n"
                    },
                    {
                        "insert": "啊哈哈又\n一段文本\n"
                    },
                    {
                        "insert": "标题一"
                    },
                    {
                        "attributes": {
                            "header": 1
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "丰富的发是\n的"
                    },
                    {
                        "attributes": {
                            "link": "https://www.jetbrains.com/idea/"
                        },
                        "insert": "IntelliJ IDEA"
                    },
                    {
                        "insert": "编辑\n"
                    },
                    {
                        "attributes": {
                            "italic": true
                        },
                        "insert": "斜体"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "italic": true,
                            "bold": true
                        },
                        "insert": "加粗"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "font": "serif"
                        },
                        "insert": "更换字体"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "strike": true
                        },
                        "insert": "删除线"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "underline": true
                        },
                        "insert": "下划线"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "color": "#e60000"
                        },
                        "insert": "颜色字体"
                    },
                    {
                        "insert": "\n"
                    },
                    {
                        "attributes": {
                            "color": "#ffffff",
                            "background": "#66b966"
                        },
                        "insert": "背景色"
                    },
                    {
                        "insert": "\n居中对齐"
                    },
                    {
                        "attributes": {
                            "align": "center"
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "居右对齐"
                    },
                    {
                        "attributes": {
                            "align": "right"
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "\n引用块"
                    },
                    {
                        "attributes": {
                            "blockquote": true
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "代码块"
                    },
                    {
                        "attributes": {
                            "code-block": true
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "wu"
                    },
                    {
                        "attributes": {
                            "code-block": true
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "wu\n无序列表"
                    },
                    {
                        "attributes": {
                            "list": "bullet"
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "无序列表2"
                    },
                    {
                        "attributes": {
                            "list": "bullet"
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "\n"
                    }
                ]
            }
        """.trimIndent()
        val content = deltaToJsonString(packet)
        println("content $content")
    }
    @Test
    fun testHtmlPrint() {
        val packet = """
            {
                "ops": [
                    {
                        "insert": "随机文本\n"
                    },
                    {
                        "insert": "标题一"
                    },
                    {
                        "attributes": {
                            "header": 1
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "丰富的发是\n的"
                    },
                    {
                        "attributes": {
                            "link": "https://www.jetbrains.com/idea/"
                        },
                        "insert": "IntelliJ IDEA"
                    },
                    {
                        "attributes": {
                            "italic": true,
                            "bold": true
                        },
                        "insert": "加粗"
                    },
                    {
                        "attributes": {
                            "underline": true
                        },
                        "insert": "下划线"
                    },
                    {
                        "attributes": {
                            "color": "#e60000"
                        },
                        "insert": "颜色字体"
                    },
                    {
                        "attributes": {
                            "color": "#ffffff",
                            "background": "#66b966"
                        },
                        "insert": "背景色"
                    },
                    {
                        "attributes": {
                            "code-block": true
                        },
                        "insert": "\n"
                    },
                    {
                        "insert": "\n"
                    }
                ]
            }
        """.trimIndent()
        val htmlString = deltaToHtmlString(packet)
        println("htmlString $htmlString")
    }
}