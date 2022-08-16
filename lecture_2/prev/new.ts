// @ts-nocheck

const prepare = partition(isOrder);

const transform = ({ left, right }: { left: Partial<IOrder>[], right: IOrder[] }) => ({
  invalid: left,
  table: pipe(
    right,
    groupBy(({ date }) => date),
    recordMap(arrMap(formatOrder)),
  ),
})

const print = ({ invalid, table }: { invalid: Partial<IOrder>[], table: ReadonlyRecord<string, string[]> }) => {
  console.table(table);
  console.log(invalid);
}

const process = flow(
  prepare,
  transform,
  print
);

process(orders);
