import { Address } from './address.model';

export interface Seller{
	id: number;
	userEmail: string;
	businessName: string;
	businessEmail: string;
	businessPhone: string;
	businessAddress: Address;
}