package slate

import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json

private val json = Json {
    isLenient = true
    prettyPrint = true
    ignoreUnknownKeys = true
    coerceInputValues = true
}

fun decodeEditorFromString(editor: String): SFEditor {
    val editor = json.decodeFromString<SFEditor>(editor)
    //println("editor $editor")
    return editor
}