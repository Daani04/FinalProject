//IMPORTANTE, PUEDEN HABER CAMPOS QUE NO SE LLAMEN IGUAL QUE EN LA BASE DE DATOS LO CUAL DA ERROR A LA HORA DE INSERAR DATOS 
//!!!!LOS CAMPOS SE TIENEN QUE LLAMAR IGUAL QUE EN LA BASE DE DATOS QUE ES LO MISMO QUE LOS DATOS QUE SACAMOS POR EL POSTMAN!!!!
export interface ProductAllData {
    id: number;
    warehouse: Warehouse;
    name: string;
    brand: string;
    price: number;
    stock: number;
    product_type: string;
    entry_date: string;  
    expiration_date: string | null;  
    warranty_period: string | null;  
    weight: number;
    dimensions: number;
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
