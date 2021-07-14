package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFText(val text: String, override val name: String): SFNode() {
}