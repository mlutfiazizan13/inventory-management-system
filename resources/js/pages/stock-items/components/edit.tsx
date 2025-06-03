import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStockItemStore } from '@/stores/useStockItemStore';
import { EditStockItem as EditStockItemType, Product } from '@/types';

export default function EditStockItem({ products }: { products: Product[] }) {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<EditStockItemType>>();

    const stopEditing = useStockItemStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useStockItemStore();

    useEffect(() => {
        if (useStockItemStore.getState().isEditing && editingItem) {
            setData({
                ...editingItem,
            });
        }
    }, [useStockItemStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof EditStockItemType, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopEditing();
    };

    return (
        <FormDialog
            title="Edit Stock Item"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Edit"
            processing={processing}
            open={useStockItemStore().isEditing}
            onOpenChange={useStockItemStore((state) => state.stopEditing)}
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
