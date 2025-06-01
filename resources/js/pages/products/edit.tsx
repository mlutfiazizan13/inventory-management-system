import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brand, Category, Product } from '@/types';

export default function EditProduct({
    product,
    categories,
    brands,
    open,
    setOpen,
}: {
    product: Product;
    categories: Category[];
    brands: Brand[];
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { data, setData, patch, processing, reset, errors, clearErrors } = useForm<Required<Product>>(product);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('products.update', product.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            // onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="">
                <DialogTitle>Edit Product</DialogTitle>
                <hr></hr>

                <form className="space-y-6" onSubmit={submit}>
                    <Input type='hidden' name='id' value={data.id}/>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                type="text"
                                name="name"
                                onChange={(e) => setData('name', e.target.value)}
                                value={data.name}
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
                                onChange={(e) => setData('unit', e.target.value)}
                                value={data.unit}
                                placeholder="Unit"
                                autoComplete="current-unit"
                            />

                            <InputError message={errors.unit} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Category</Label>

                            <Select name="category_id" value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
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

                            <Select name="brand_id" value={data.brand_id} onValueChange={(value) => setData('brand_id', value)}>
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

                            <Select name="currency" value={data.currency}  onValueChange={(value) => setData('currency', value)}>
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
                                onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                value={data.price}
                                placeholder="Price"
                                autoComplete="current-price"
                            />

                            <InputError message={errors.name} />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="default" disabled={processing} asChild>
                            <button type="submit">Edit</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
