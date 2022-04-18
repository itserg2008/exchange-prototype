export interface Transaction {
    id: number;
    txid: string;
    from_currency: string;
    to_currency: string;
    email: string;
    sent_amount: number;
    received_amount: number;
    exchange_rate: number;
    exchange_fee: number;
    address: string,
    status: string;
    created_at: string;
};