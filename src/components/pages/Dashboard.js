import React, {useEffect, useState} from 'react';
import Header from '../Header';
import Cards from "../cards";
import AddExpenseModal from '../Modal/addExpense';
import AddIncomeModal from '../Modal/addincome';
import { addDoc, collection,getDocs,query } from 'firebase/firestore';
import { toast} from 'react-toastify';
import { auth, db } from '../firebase';
import { useAuthState} from 'react-firebase-hooks/auth';
import TransactionsTable from '../TrasactionsTable'
// import ChartComponent from '../charts';
 //import NoTransactions from '../NoTransactions';


function Dashboard() {
  // const transaction= [
  //   {
  //     type: "income",
  //     amount: 1200,
  //     tag: "salary",
  //     name: "income1",
  //     date: "2025-01-05",
  //   },
  //   {
  //     type: "expense",
  //     amount: 800,
  //     tag: "food",
  //     name: "expense1",
  //     date: "2025-01-07",
  //   },
  // ];
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState([false]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income,setIncome] = useState(0);
  const [expense,setExpense] = useState(0);
  const [totalBalance,setTotalBalance] = useState(0);



  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
const handleExpenseCancel = () => {
  setIsExpenseModalVisible(false);
};
const handleIncomeCancel = () => {
  setIsIncomeModalVisible(false);
};

const onFinish=(values,type) => {
  const newTransaction = {
    type: type,
    date:values.date.format("YYYY-MM-DD"),
    amount: parseFloat(values.amount),
    tag: values.tag,
    name: values.name,
  };
  addTransaction(newTransaction);
};
async function addTransaction(transaction,many){
  //Add the doc
  try {
    const docRef = await addDoc(
      collection(db, `users/${user.uid}/transactions`),
      transaction
    );
    console.log("Document written with ID: ", docRef.id);
    if (!many) toast.success("Transaction Added!");
      let newArr = transaction;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
  } catch (e) {
    console.error("Error adding document: ", e);
     if(!many) toast.error("Couldn't add transaction");
    }

}
useEffect(() => {
  //Get all docs from a collection
  fetchTransactions();
}, [user]);
useEffect(()=>{
  calculateBalance();
}, [transactions]);

const calculateBalance = () => {
  let incomeTotal = 0;
  let expensesTotal = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      incomeTotal += transaction.amount;
    } else {
      expensesTotal += transaction.amount;
    }
  });
  setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };
async function fetchTransactions() {
  setLoading(true);
  if (user) {
    const q = query(collection(db, `users/${user.uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      transactionsArray.push(doc.data());
    });
    setTransactions(transactionsArray);
    console.log("Transaction Array", transactionsArray)
    toast.success("Transactions Fetched!");
  }
  setLoading(false);
}

let sortedTransactions= transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  })
  return (
    <div>
       <Header/>
       {loading?(
        <p>Loading...</p>
       ):(
<>
       
      <Cards
      income={income}
      expense={expense}
      totalBalance={totalBalance}
      showExpenseModal={showExpenseModal}
      showIncomeModal={showIncomeModal}
      />
       {/* transactions.length!==0 ? <ChartComponent sortedTransactions={sortedTransactions}/>: <NoTransactions/> */}
       <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable 
          transactions={transactions} 
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions}
          />
          </>
          )}
    </div>
  );
}

export default Dashboard