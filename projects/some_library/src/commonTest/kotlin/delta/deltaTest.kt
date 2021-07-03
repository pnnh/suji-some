package delta

import kotlinx.serialization.json.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import kotlin.test.Test
import kotlin.test.assertEquals

class DeltaTests {
    private val json = Json {
        isLenient = true
        ignoreUnknownKeys = true
        coerceInputValues = true
    }

    @Test
    fun testSerialization() {
        val packet = """
            {
                "ops": [
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
                        "insert": "编辑 \n"
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
        val delta = json.decodeFromString<Delta>(packet)

        //val string = json.encodeToString(delta)
        //println("\n=================\n")
        //println(string) // {"name":"Louis","yearOfBirth":1901}
        assertEquals(33, delta.ops.count())
        //assertEquals<String>("标题一", delta.ops[0].insert)
    }

    @Test
    fun testUnBold() {
        val packet = """
            {
              "ops": [
                { "retain": 7, "attributes": { "bold": null, "italic": true } },
                { "retain": 5 },
                { "insert": "White", "attributes": { "color": "#fff" } },
                { "delete": 4 },
                { "insert": { "formula": "e=mc^2"}},
                { "insert": " \n"}
              ]
            }
        """.trimIndent()
        val delta = json.decodeFromString<Delta>(packet)
        println("delta $delta")
        //assertEquals("string", delta.ops[2])
    }
}