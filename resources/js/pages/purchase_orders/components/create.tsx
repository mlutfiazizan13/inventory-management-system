import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { usePurchaseOrderStore } from '@/stores/usePurchaseOrderStore';
import { Product, PurchaseOrder, PurchaseOrderItem, Supplier } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/currency-format';


type CreatePurchaseOrder = {
    supplier_id: number
    order_date: string
    expected_date: string
    total_cost: number
    notes: string
    purchase_order_items: {
        product_id: number | null,
        quantity: number,
        unit_price: number,
    }[]
}

export default function CreatePurchaseOrder({ suppliers, products }: { suppliers: Supplier[], products: Product[] }) {
    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<CreatePurchaseOrder>({
        supplier_id: 0,
        order_date: '',
        expected_date: '',
        total_cost: 0,
        notes: '',
        purchase_order_items: [{
            product_id: null,
            quantity: 0,
            unit_price: 0,
        }]
    })

    const stopCreating = usePurchaseOrderStore((state) => state.stopCreating);
    const { createItem } = usePurchaseOrderStore();

    const [editingIndex, setEditingIndex] = useState(null);


    const addItem = () => {
        setData('purchase_order_items', [
            ...data.purchase_order_items,
            { product_id: 0, quantity: 1, unit_price: 0 }
        ])
    }

    const updateItem = (index: number, field: string, value: number) => {
        setData((current) => {
            // create updated array
            const updatedItems = current.purchase_order_items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )

            return {
                ...current,
                purchase_order_items: updatedItems,
            }
        })
    }



    const removeItem = (index: number) => {
        setData('purchase_order_items', data.purchase_order_items.filter((_, i) => i !== index))
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof PurchaseOrder, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    useEffect(() => {
        const totalCost = data.purchase_order_items.reduce((total, item) => {
            return total + item.quantity * item.unit_price;
        }, 0);
        setData((current) => ({
            ...current,
            total_cost: totalCost,
        }));
    }, [data.purchase_order_items]);

    return (
        <FormDialog
            title="Create Purchase Order"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={usePurchaseOrderStore().isCreating}
            onOpenChange={usePurchaseOrderStore((state) => state.stopCreating)}
            className='min-w-2xl'
        >
            <div className="grid gap-2">
                <Label htmlFor="supplier_id">Supplier</Label>

                <Select name="supplier_id" onValueChange={(value) => setData('supplier_id', Number.parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue id="supplier_id" placeholder="Select Supplier..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {suppliers.map((supplier) => {
                                return (
                                    <SelectItem key={supplier.id} value={String(supplier.id)}>
                                        {supplier.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <InputError message={errors.supplier_id} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="order_date">Order Date</Label>

                <Input
                    id="order_date"
                    type="date"
                    name="order_date"
                    onChange={(e) => setData('order_date', e.target.value)}
                    placeholder="Order Date"
                    autoComplete="current-order_date"
                />
                <InputError message={errors.order_date} />

            </div>

            <div className="grid gap-2">
                <Label htmlFor="expected_date">Expected Date</Label>

                <Input
                    id="expected_date"
                    type="date"
                    name="expected_date"
                    onChange={(e) => setData('expected_date', e.target.value)}
                    placeholder="Order Date"
                    autoComplete="current-expected_date"
                />

                <InputError message={errors.expected_date} />
            </div>

            <div>
                <Collapsible
                    defaultOpen
                    className="flex flex-col gap-2"
                >
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="order_date">Add Products</Label>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <ChevronsUpDown />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="flex flex-col gap-2">
                        {data.purchase_order_items.map((item, index) => (
                            <div key={`product-${index}`} className='flex justify-between gap-3'>
                                <div className='grid grid-cols-3 w-full gap-3'>
                                    <div className="grid gap-2">
                                        <Select
                                            name="product_id"
                                            value={data.purchase_order_items[index].product_id ? String(data.purchase_order_items[index].product_id) : undefined}
                                            onValueChange={(value) => {
                                                const product = products.find(p => p.id === parseInt(value));
                                                updateItem(index, 'product_id', product!.id)
                                                updateItem(index, 'unit_price', product?.price ?? 0)
                                            }}>
                                            <SelectTrigger>
                                                <SelectValue id="product_id" placeholder="Select Product..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {products.map((product) => (
                                                        <SelectItem key={product.id} value={String(product.id)}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        <InputError message={errors.purchase_order_items} />
                                    </div>


                                    <div className="grid gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Quantity"
                                            value={data.purchase_order_items[index].quantity}
                                            onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors.purchase_order_items} />
                                    </div>


                                    <div className="grid gap-2">

                                        <Input
                                            name='unit_price'
                                            type="text"
                                            placeholder="Unit Price"
                                            value={
                                                editingIndex === index
                                                    ? item.unit_price
                                                    : formatRupiah(item.unit_price)
                                            }
                                            onFocus={() => setEditingIndex(index)}
                                            onBlur={() => setEditingIndex(null)}
                                            onChange={(e) => {
                                                const parsed = parseFloat(e.target.value.replace(/[^\d.-]/g, ''));
                                                updateItem(index, "unit_price", isNaN(parsed) ? 0 : parsed);
                                            }}
                                        />
                                        <InputError message={errors.purchase_order_items} />
                                    </div>
                                </div>
                                {index > 0 ?
                                    <Button type='button' variant={'destructive'}
                                        onClick={() => removeItem(index)}>
                                        <Trash />
                                    </Button>
                                    :
                                    <Button type='button'
                                        onClick={() => addItem()}>
                                        <Plus />
                                    </Button>
                                }
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>
            </div>
            <hr />
            <Collapsible
                className="flex flex-col gap-2"
            >
                <div className="flex items-center justify-between gap-4">
                    <p className='text-xl align-middle font-bold'>Purchase Order Summary</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="flex flex-col gap-2">
                    {data.purchase_order_items.map((item, index) => {
                        const product = products.find(p => p.id === item.product_id);

                        return <div key={`product-summary-${index}`} className='flex justify-between'>
                            <p className='font-bold'>{product?.name}</p>
                            <div className='text-end'>
                                <p className='font-bold'>{formatRupiah(item.quantity * item.unit_price)}</p>
                                <p className='text-sm'>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    })}
                    <hr />
                    <div className='flex justify-between font-bold'>
                        <p>Total Cost</p>
                        <p>{formatRupiah(data.total_cost)}</p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </FormDialog>
    );
}
