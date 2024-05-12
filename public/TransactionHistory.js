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
     * Adds a transaction to the transactions array.
     * Calculates the balance after the transaction based on the type of the transaction.
     * If the transaction type is 'income', the amount is added to the current balance.
     * If the transaction type is 'expense', the amount is subtracted from the current balance.
     * @param {number} amount - The amount of the transaction.
     * @param {string} type - The type of the transaction. Can be 'income' or 'expense'.
     * @param {string} description - A description of the transaction.
     */
    addTransaction(amount, type, description) {
        let balanceAfterTransaction;
        if (type === 'income') {
            balanceAfterTransaction = this.getBalance() + amount;
        } else if (type === 'expense') {
            balanceAfterTransaction = this.getBalance() - amount;
        }
        const transaction = {
            amount,
            type,
            description,
            date: new Date(),
            balanceAfterTransaction: balanceAfterTransaction
        };
        this.transactions.push(transaction);
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

    /**
     * Calculates and returns the current balance.
     * The balance is calculated by iterating over the transactions array.
     * If the transaction type is 'income', the amount is added to the balance.
     * If the transaction type is 'expense', the amount is subtracted from the balance.
     * @returns {number} The current balance.
     */
    getBalance() {
        return this.transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                return acc + transaction.amount;
            } else if (transaction.type === 'expense') {
                return acc - transaction.amount;
            }
            return acc;
        }, 0);
    }

    resetTransactionHistory() {
        this.transactions = [];
        this.addTransaction(10000, 'income', 'Initial balance')
    }
}