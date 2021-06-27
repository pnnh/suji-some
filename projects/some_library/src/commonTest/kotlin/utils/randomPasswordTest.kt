package utils

import kotlin.test.Test
import kotlin.test.assertEquals

@Test
fun testRandomPassword() {
    val password = randomPassword(16, symbol = false)
    assertEquals(password.contains("@!%#"), false)
    assertEquals(password.length, 16)
}