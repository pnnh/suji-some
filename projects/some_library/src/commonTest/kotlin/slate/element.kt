package slate

import kotlin.test.Test

class ElementTests {
    @Test
    fun testDecodeFromString() {
        val editorString = """
            {
	"children": [{"name":"paragraph","children":[{"name":"text","text":"a"}]},{"name":"header","children":[{"name":"text","text":"b"}],"header":1},{"name":"codeblock","children":[{"name":"code","text":"<h1>hello</h1>console.log(\"hello\");"}],"language":"js"},{"name":"paragraph","children":[{"name":"text","text":"c"}]}]
}
        """.trimIndent()
        decodeEditorFromString(editorString)
    }
}