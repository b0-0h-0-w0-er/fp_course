const { upperFirst, groupBy, partition, flow, map, join, each, reduce } = _;

const validator = x => x.name && x.price && x.date;

const mapper = x => ({
  name: upperFirst(x.name),
  price: `\$${x.price}`,
  date: x.date
});

const fmap = value => Object.keys(value).map(key => ({
  header: key,
  value: value[key]
}));

const getRow = flow(
  map(item => `${item.name} - ${item.price}\n`),
  join(' | ')
);

const createDataColumn = flow(
  fmap,
  map(({ header, value }) => ({
    header,
    row: getRow(value)
  }))
);

const printTable = ({ columnHeader, columnRow }) => each(({ header, row }, index) => {
  columnHeader.insertCell(index).innerHTML = header;
  columnRow.insertCell(index).innerHTML = row
})

const printList = (textNodeCreator, printNodes) => flow(
  createTextNodes(textNodeCreator),
  printNodes
);

const format = order => `${order.name ? `Name: ${order.name}` : ''}` +
  `${order.price ? ` | Price: ${order.price}` : ''}` +
  `${order.date ? ` | Date: ${order.date}` : ''} `;

const createTextNodes = textNodeCreator => map(flow(
  format,
  textNodeCreator
))

const reportBuilder = (tableColumnCreator, textNodeCreator, invalidPrinter) => orders => {
  const [validOrders, invalidOrders] = partition(validator, orders);

  flow([
    map(mapper),
    groupBy('date'),
    createDataColumn,
    printTable(tableColumnCreator())
  ])(validOrders);

  printList(textNodeCreator, invalidPrinter)(invalidOrders);
}
