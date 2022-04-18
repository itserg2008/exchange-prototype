export interface ExchangeRequest {
    from_currency: string;
    sent_amount: number;
    to_currency: string;
    rate: number;   
    address: string;
    email: string;
}