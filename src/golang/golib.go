package main

import "C"
import b64 "encoding/base64"
import "bytes"
import "encoding/json"

type items []int

type order struct {
	Email_id string `json:"email_id"`
	Order_id int    `json:"order_id"`
	Items    items  `json:"items"`
	Total    int    `json:"total"`
}

var idList = make(map[int]int)

var orders = make([]order, 0, 4000)

//export Push
func Push(email, action *C.char, orderId, itm, price int) {
	idx, ok := idList[orderId]
	if ok == false {
		orders = append(orders, order{
			Email_id: encodeEmail(email),
			Order_id: orderId,
			Items:    items{itm},
			Total:    price,
		})

		idx = len(orders) - 1
		idList[orderId] = idx
		return
	}

	orders[idx].Items = append(orders[idx].Items, itm)
	orders[idx].Total = Sum(action, orders[idx].Total, price)

	return
}

//export ToJson
func ToJson() *C.char {
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(orders)
	return C.CString(buf.String())
}

//export GetLength
func GetLength() int {
	return len(orders)
}

//export Flush
func Flush() {
	idList = make(map[int]int)
	orders = make([]order, 0, 4000)
}

//export Sum
func Sum(input *C.char, total, price int) int {
	action := C.GoString(input)
	if action == "order" {
		return total + price
	}
	return total - price
}

func encodeEmail(input *C.char) string {
	email := C.GoString(input)
	resString := b64.StdEncoding.EncodeToString([]byte(email))
	return resString
}

func main() {}
