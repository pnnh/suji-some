package xyz.sfx.utils

import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.*

fun NewPk(): String {
    val uuid = UUID.randomUUID()
    val uuidBytes = ByteArray(16)
    ByteBuffer.wrap(uuidBytes)
        .order(ByteOrder.BIG_ENDIAN)
        .putLong(uuid.mostSignificantBits)
        .putLong(uuid.leastSignificantBits)

    println("uuid $uuid")
    val pk = Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(uuidBytes)
    return pk
}