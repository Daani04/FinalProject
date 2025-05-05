//IMPORTANTE, PUEDEN HABER CAMPOS QUE NO SE LLAMEN IGUAL QUE EN LA BASE DE DATOS LO CUAL DA ERROR A LA HORA DE INSERAR DATOS 
export interface ProductAllData {
    id?: number | null;  
    warehouse: number;
    name: string;
    brand: string;
    price: number;
    purchase_price: number;
    stock: number;
    barcode: number | null;
    product_type: string;
    entry_date: string;  
    expiration_date: string | null;  
    product_photo: string | null;  
}

export interface ProductSold {
    id: number;
    productData: ProductAllData;  
    warehouse: Warehouse;
    quantity: number;
    sale_date: string;  
}
//COMPROBADO/CORRECTO
export interface User {
    id?: number | null;  
    username: string;
    company: string;
    email: string;
    password: string;
    role: string;
}

export interface Warehouse {
    id: number | null;  
    user_id: number;  
    name: string; 
    location: string;
    products?: ProductAllData[] | null;  
    sales?: ProductSold[] | null;  
}

// Interfaz general para la respuesta de la API
export interface Welcome {
    success: boolean;
    data: Data;
}

export interface Data {
    products: ProductAllData[];
    sales: ProductSold[];
    users: User[];
    warehouses: Warehouse[];
}
