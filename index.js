const { 
  fetchHashUsingBlockHeight,
  fetchTransactionListUsingHash,
  sortAndPrintTop10
} = require('./utils')

function enqueue(queue, element) {
  queue.push(element);
  return queue;
}

function dequeue(queue) {
  return queue.slice(1);
}

function front(queue) {
  return queue[0];
}

async function main() {
  const initialBlockNumber = 680000;
  const blockHash = await fetchHashUsingBlockHeight(initialBlockNumber);
  let globalTransactionList = [];
  let index = 0;
  const indexMap = {};

  while (index<=25) {
    const [transactionList, err] = await fetchTransactionListUsingHash(blockHash, index);
    index += 1;
    
    for (const transaction of transactionList) {
      indexMap[transaction.txid] = true;
    }

    globalTransactionList = globalTransactionList.concat(transactionList);

    if (err) {
      break;
    }
  }

  let directParentCount = {};
  let directParentMap = {};
  

  for (let index = 0; index < globalTransactionList.length; index++) {
    let inputs = globalTransactionList[index].vin;
    
    for (let j = 0; j < inputs.length; j++) {
      let inputTransaction = inputs[j];
      
      if (indexMap[inputTransaction.txid] && globalTransactionList[index].txid !== inputTransaction.txid) {
        if (!directParentCount[globalTransactionList[index].txid]) {
          directParentCount[globalTransactionList[index].txid] = 1;
        } else {
          directParentCount[globalTransactionList[index].txid] += 1;
        }

        if (!directParentMap[globalTransactionList[index].txid]) {
          directParentMap[globalTransactionList[index].txid] = [];
        }
        else{
          directParentMap[globalTransactionList[index].txid].push(inputTransaction.txid);
        }
        
      }
    }
  }

  console.log("Task 1 complete");
  console.log("Size of Transaction List: ", globalTransactionList.length);
  console.log("Task 2 complete");
  console.log("Length of all transactions", Object.keys(directParentMap).length);

  const dipMapCount = {};

  for (let child in directParentMap) {

    let searchQueue = [];
    searchQueue = enqueue(searchQueue, child);
  
    while (searchQueue.length != 0) {
      dipMapCount[child] = (dipMapCount[child] || 0) + directParentCount[front(searchQueue)];
  
      for (let index in directParentMap[front(searchQueue)]) {
        searchQueue = enqueue(searchQueue, directParentMap[front(searchQueue)][index]);
      }
      searchQueue = dequeue(searchQueue);
    }
  }

  sortAndPrintTop10(dipMapCount);
}

main();
