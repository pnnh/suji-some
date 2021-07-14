package slate

import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import slate.SFEditor

private val json = Json {
    isLenient = true
    prettyPrint = true
    ignoreUnknownKeys = true
    coerceInputValues = true
}

fun decodeEditorFromString(editor: String) {
    val editor = json.decodeFromString<SFEditor>(editor)
    println("editor $editor")
}
