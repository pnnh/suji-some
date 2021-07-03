package parchment

open class Blot(
    val name: String = "",
    val prev: Blot? = null,
    val next: Blot? = null,
    val parent: Blot? = null

//    companion object {
//        fun create(): Blot {
//            return Blot()
//        }
//    }
)

//class LinkBlot: Blot() {
//
//}

class HeaderBlot(val text: String = "",val header: Int = 0): Blot() {
}

class LinkBlot(val text: String = "",val link: String = ""): Blot() {
}

class TextBlot(val text: String = "",): Blot() {

}


