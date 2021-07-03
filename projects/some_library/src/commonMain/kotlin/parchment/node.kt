package parchment

open class Node(
    //val text: String = "",
//    val prev: Blot? = null,
//    val next: Blot? = null,
//    val parent: Blot? = null,
//    companion object {
//        fun create(): Blot {
//            return Blot()
//        }
//    }
) {
    var name: String = ""
    var text: StringBuilder = StringBuilder()
    val children: ArrayList<Node> = arrayListOf<Node>()

    constructor(name: String, text: String) : this() {
        this.name = name
        this.text = StringBuilder(text)
    }

}



class HeaderNode(text: String, val header: Int = 0): Node(name = "header", text = text) {
}

class LinkNode(text: String, val link: String = ""): Node(name = "link", text = text) {
}

class TextNode(text: String,
               val bold: Boolean = false,
               val italic: Boolean = false,
               val font: String = "",
               val strike: Boolean = false,
               val underline: Boolean = false,
               val color: String = "",
               val background: String = "",): Node(name = "text", text = text) {

}


