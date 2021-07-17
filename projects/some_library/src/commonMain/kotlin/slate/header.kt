package slate

import kotlinx.serialization.Serializable

@Serializable
data class SFHeader(override val name: String, val header: Int, override val text: String): SFTextNode() {
}