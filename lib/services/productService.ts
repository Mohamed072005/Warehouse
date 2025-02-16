export const createTheUpdatedStock = (existingStockIndex :  number, warehouseman_id: string, currentProduct: any, newProduct: any) => {
    let updatedStock;
    if (existingStockIndex !== -1) {
        updatedStock = currentProduct.stocks.map((stock: any, index: number) => {
            if (existingStockIndex === index) {
                return {
                    ...stock,
                    quantity: stock.quantity + newProduct.stock[0].quantity,
                }
            }
            return stock;
        });
    } else {
        // If the warehouseman_id doesn't exist, add a new stock entry
        updatedStock = [
            ...currentProduct.stock,
            { id: warehouseman_id, quantity: newProduct.stock[0].quantity },
        ];
    }
}