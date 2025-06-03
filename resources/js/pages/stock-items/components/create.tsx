import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockItemStore } from '@/stores/useStockItemStore';
import { Product, StockItem } from '@/types';

export default function CreateStockItem({ products }: { products: Product[] }) {
    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<Required<StockItem>>();

    const stopCreating = useStockItemStore((state) => state.stopCreating);

    const { createItem } = useStockItemStore();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        console.log('create');
        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof StockItem, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    return (
        <FormDialog
            title="Create Stock Item"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={useStockItemStore().isCreating}
            onOpenChange={useStockItemStore((state) => state.stopCreating)}
        >
            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="product_id">Category</Label>

                    <Select name="product_id" onValueChange={(value) => setData('product_id', value)}>
                        <SelectTrigger>
                            <SelectValue id="product_id" placeholder="Select Product..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {products.map((product) => {
                                    return (
                                        <SelectItem key={product.id} value={String(product.id)}>
                                            {product.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <InputError message={errors.product_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>

                    <Input
                        id="quantity"
                        type="number"
                        name="quantity"
                        onChange={(e) => setData('quantity', Number.parseInt(e.target.value))}
                        placeholder="Quantity"
                        autoComplete="current-quantity"
                    />

                    <InputError message={errors.quantity} />
                </div>
            </div>
        </FormDialog>
    );
}
