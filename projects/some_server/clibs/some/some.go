package some

/*
#cgo LDFLAGS: -L ./libsome -lsome
#include "foo.h"
*/
import "C"

func CPrintln() {

	v := 42
	C.printint(C.int(v))

	str := `
	{
    "name": "",
    "text": "",
    "children": [
        {
            "name": "text",
            "text": "",
            "children": []
        },
        {
            "name": "header",
            "text": "标题一",
            "children": []
        },
        {
            "name": "text",
            "text": "标题一\n丰富的发是\n的IntelliJ IDEA",
            "children": []
        },
        {
            "name": "link",
            "text": "标题一\n丰富的发是\n的IntelliJ IDEA",
            "children": []
        }
    ]
}
`

	C.deltaToJsonString(C.CString(str))
}