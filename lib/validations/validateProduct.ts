import {NewProduct, ValidationErrors} from "@/lib/types/Product";

export const validationProduct = (product: NewProduct): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Name validation
    if (!product.name.trim()) {
        errors.name = 'Le nom est requis';
    } else if (product.name.length < 2) {
        errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Type validation
    if (!product.type.trim()) {
        errors.type = 'Le type est requis';
    }

    // Price validation
    if (!product.price) {
        errors.price = 'Le prix est requis';
    } else if (product.price <= 0) {
        errors.price = 'Le prix doit être supérieur à 0';
    }

    // Supplier validation
    if (!product.supplier.trim()) {
        errors.supplier = 'Le fournisseur est requis';
    }

    // Quantity validation
    if (!product.stocks[0].quantity) {
        errors.quantity = 'La quantité est requise';
    } else if (product.stocks[0].quantity < 0) {
        errors.quantity = 'La quantité doit être positive';
    }

    // City validation
    if (!product.stocks[0].localisation.city.trim()) {
        errors.city = 'La ville est requise';
    }

    return errors;
}