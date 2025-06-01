import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateProduct() {
    const passwordInput = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const { data, setData, post ,processing, reset, errors, clearErrors } = useForm<Required<Product>>();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('products.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Create</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogTitle>Create Product</DialogTitle>
                <hr></hr>
                <form className="space-y-6" onSubmit={submit}>
                    <div className="grid grid-cols-1 gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                type="text"
                                name="name"
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Name"
                                autoComplete="current-name"
                            />

                            <InputError message={errors.name} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="sku">SKU</Label>

                            <Input
                                id="sku"
                                type="text"
                                name="sku"
                                onChange={(e) => setData('sku', e.target.value)}
                                placeholder="SKU"
                                autoComplete="current-sku"
                            />

                            <InputError message={errors.sku} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="unit">Unit</Label>

                            <Input
                                id="unit"
                                type="text"
                                name="unit"
                                onChange={(e) => setData('unit', e.target.value)}
                                placeholder="Unit"
                                autoComplete="current-unit"
                            />

                            <InputError message={errors.unit} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="currency">Currency</Label>

                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='select...'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value='IDR'>IDR</SelectItem>
                                        <SelectItem value='USD'>USD</SelectItem>
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
                                onChange={(e) => setData('price',  parseFloat(e.target.value) || 0)}
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
                            <button type="submit">Create</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
