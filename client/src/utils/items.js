export function getItemRows(
    items,
    rowWidth,
    minRows
) {
    let numRows = Math.ceil(items.length / rowWidth)
    if (numRows < minRows) {
        numRows = minRows
    }
    const itemRows = []
    for (let i = 0; i < numRows; i++) {
        const itemRow = []
        itemRows[i] = itemRow
        for (let j = 0; j < rowWidth; j++) {
            let itemIndex = i * rowWidth + j;
            let item = null
            if (itemIndex < items.length) {
                item = items[itemIndex]
            }
            itemRow.push(item)
        }
    }

    return itemRows
}


export function renderItem(
    item
) {
    if (!item) {
        return ''
    }

    return item.name
}
