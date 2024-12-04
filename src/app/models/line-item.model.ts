export type ItemType = 'Retail' | 'Freelance' | 'Services';

export interface LineItem {
	id: number;
	type: ItemType;
	description: string;
	quantity: number;
	price: number;
	lineTotal: number;
}

