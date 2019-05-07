
function orderList() {

  const list = [];
  const idList = {};

  function sum(row, total = 0) {
    const price = row.price * 1;
    return row.action === 'order' ? total + price : total - price
  }

  function addItem(items, newItem) {
    items.push(newItem * 1)
    return items
  }

  function push(row) {
    let idx = idList[row.order_id * 1]

    if (idx === undefined) {
      const orderId = row.order_id * 1
      const add = {
        email_id: Buffer.from(row.email).toString('base64'),
        order_id: orderId * 1,
        items: addItem([], row.item_id),
        total: sum(row),
      }
      idx = list.push(add) - 1
      idList[orderId] = idx

      return
    }

    list[idx].items = addItem(list[idx].items, row.item_id)
    list[idx].total = sum(row, list[idx].total)

    return
  }

  function getList() {
    return list;
  }

  function getIdList() {
    return idList;
  }

  return {
    push: push,
    getList: getList,
    getIdList: getIdList,
    _private: {
      addItem: addItem,
      sum: sum,
    }
  }
}

module.exports = orderList;
