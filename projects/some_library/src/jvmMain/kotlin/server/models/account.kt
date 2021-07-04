package server.models

import kotlinx.serialization.Serializable

@Serializable
data class Account (
    var pk: String,
    val uname: String = "",
    val image: String = "",
)