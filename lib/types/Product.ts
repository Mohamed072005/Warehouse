export interface Product {
    id: number;
    name: string;
    type: string;
    barcode: string;
    price: number;
    solde: number;
    supplier: string;
    image: string;
    stocks: Stock[];
    editedBy: EditHistory[];
}

interface Stock  {
    id: number;
    name: string;
    quantity: number;
    localisation: Localisation;
}

interface Localisation  {
    city: string;
    latitude: number;
    longitude: number;
}

interface EditHistory  {
    warehousemanId: number;
    at: string;
}


export interface NewProduct {
    id: string;
    name: string;
    type: string;
    barcode: string;
    price: number;
    supplier: string;
    stocks: [{
        id: string,
        quantity: number,
        localisation: {
            city: string;
        }
    }],
}

export interface ValidationErrors {
    name?: string;
    type?: string;
    price?: string;
    supplier?: string;
    quantity?: string;
    city?: string;
}
