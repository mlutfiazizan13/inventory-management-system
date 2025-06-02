import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductStore } from '@/stores/useProductStore';
import { Brand, Category, Product } from '@/types';

export default function EditStockItem({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<Product>>();

    const stopEditing = useProductStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useProductStore();

    useEffect(() => {
        if (useProductStore.getState().isEditing && editingItem) {
            setData({
                ...editingItem,
            });
        }
    }, [useProductStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof Product, string>);
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
            open={useProductStore().isEditing}
            onOpenChange={useProductStore((state) => state.stopEditing)}
        >
            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Name"
                        autoComplete="current-name"
                    />

                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>

                    <Input
                        id="unit"
                        type="text"
                        name="unit"
                        value={data.unit}
                        onChange={(e) => setData('unit', e.target.value)}
                        placeholder="Unit"
                        autoComplete="current-unit"
                    />

                    <InputError message={errors.unit} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="category_id">Category</Label>

                    <Select name="category_id" onValueChange={(value) => setData('category_id', value)} value={data.category_id}>
                        <SelectTrigger>
                            <SelectValue id="category_id" placeholder="Select Category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {categories.map((category) => {
                                    return (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <InputError message={errors.category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="brand_id">Brand</Label>

                    <Select name="brand_id" onValueChange={(value) => setData('brand_id', value)} value={data.brand_id}>
                        <SelectTrigger>
                            <SelectValue id="brand_id" placeholder="Select Brand..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {brands.map((brand) => {
                                    return (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <InputError message={errors.brand_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>

                    <Select name="currency" onValueChange={(value) => setData('currency', value)} value={data.currency}>
                        <SelectTrigger>
                            <SelectValue id="currency" placeholder="Select Currency..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="IDR">IDR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <InputError message={errors.currency} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>

                    <Input
                        id="price"
                        type="number"
                        name="price"
                        value={data.price}
                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        autoComplete="current-price"
                    />

                    <InputError message={errors.name} />
                </div>
            </div>
        </FormDialog>
    );
}
