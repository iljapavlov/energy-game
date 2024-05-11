export class TransactionHistory {
    constructor() {
        this.transactions = [];
    }

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

    getTransactions() {
        return this.transactions;
    }

    clearTransactions() {
        this.transactions = [];
    }

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
}