package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFText(override val name: String, override val text: String): SFTextNode() {
}