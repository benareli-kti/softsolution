export class Purchase {
	purchase_id?: string;
	date?: Date;
	disc_type?: string;
	discount?: number;
	amount_untaxed?: number;
	amount_tax?: number;
	supplier?: any;
	user?: any;
	purchase_detail?: string[];
	payment?: string[];
	paid?: boolean;
	open?: boolean;
}
