/**
 * TransactionHistory class is used to manage and record transactions.
 * Each transaction includes the amount, type, description, date, and the balance after the transaction.
 */
export class TransactionHistory {
    /**
     * Constructor for the TransactionHistory class.
     * Initializes an empty array to store transactions.
     */
    constructor() {
        this.transactions = [];
    }

    /**
     * Returns the transactions array.
     * @returns {Array} The transactions array.
     */
    getTransactions() {
        return this.transactions;
    }

    /**
     * Clears the transactions array.
     */
    clearTransactions() {
        this.transactions = [];
    }

    addTransaction(amount, type, description) {
        let balanceAfterTransaction;
        if (type === 'income') {
            balanceAfterTransaction = this.getBalance() + amount;
        } else if (type === 'expense') {
            balanceAfterTransaction = this.getBalance() - amount;
        }
        // Format the balance to 2 decimal places
        balanceAfterTransaction = parseFloat(balanceAfterTransaction.toFixed(2));
        const transaction = {
            amount,
            type,
            description,
            date: new Date(),
            balanceAfterTransaction: balanceAfterTransaction
        };
        this.transactions.push(transaction);
    }
    
    getBalance() {
        let balance = this.transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                return acc + transaction.amount;
            } else if (transaction.type === 'expense') {
                return acc - transaction.amount;
            }
            return acc;
        }, 0);
        // Format the balance to 2 decimal places
        return parseFloat(balance.toFixed(2));
    }

    resetTransactionHistory() {
        this.transactions = [];
        this.addTransaction(10000, 'income', 'Initial balance')
    }
}