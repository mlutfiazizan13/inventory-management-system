import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { useSalesOrderStore } from '@/stores/useSalesOrderStore';
import { Customers, Product, PurchaseOrder, SalesOrder, Supplier } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/currency-format';


type CreateSalesOrder = {
    customer_id: number
    order_date: string
    total_amount: number
    notes: string
    sales_order_items: {
        product_id: number | null,
        quantity: number,
        price: number,
    }[]
}

export default function CreateSalesOrder({ customers, products }: { customers: Customers[], products: Product[] }) {
    console.log(products);

    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<CreateSalesOrder>({
        customer_id: 0,
        order_date: '',
        total_amount: 0,
        notes: '',
        sales_order_items: [{
            product_id: null,
            quantity: 0,
            price: 0,
        }]
    })

    const stopCreating = useSalesOrderStore((state) => state.stopCreating);
    const { createItem } = useSalesOrderStore();

    const [editingIndex, setEditingIndex] = useState(null);


    const addItem = () => {
        setData('sales_order_items', [
            ...data.sales_order_items,
            { product_id: null, quantity: 1, price: 0 }
        ])
    }

    const updateItem = (index: number, field: string, value: number) => {
        setData((current) => {
            // create updated array
            const updatedItems = current.sales_order_items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )

            return {
                ...current,
                sales_order_items: updatedItems,
            }
        })
    }



    const removeItem = (index: number) => {
        setData('sales_order_items', data.sales_order_items.filter((_, i) => i !== index))
    }

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        let hasStockError = false;

        // Check stock sufficiency
        data.sales_order_items.forEach((item, index) => {
            const product = products.find(p => p.id === item.product_id);
            if (product && item.quantity > product.inventory?.quantity) {
                setError(`sales_order_items.${index}.quantity`, `Only ${product.inventory?.quantity} in stock`);
                hasStockError = true;
            }
        });

        console.log(errors);
        if (hasStockError) return;

        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof SalesOrder, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    useEffect(() => {
        const totalAmount = data.sales_order_items.reduce((total, item) => {
            return total + item.quantity * item.price;
        }, 0);
        setData((current) => ({
            ...current,
            total_amount: totalAmount,
        }));
    }, [data.sales_order_items]);

    return (
        <FormDialog
            title="Create Sales Order"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={useSalesOrderStore().isCreating}
            onOpenChange={useSalesOrderStore((state) => state.stopCreating)}
            className='min-w-2xl'
        >
            <div className="grid gap-2">
                <Label htmlFor="customer_id">Customer</Label>

                <Select name="customer_id" onValueChange={(value) => setData('customer_id', Number.parseInt(value))}>
                    <SelectTrigger>
                        <SelectValue id="customer_id" placeholder="Select Customer..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {customers.map((customer) => {
                                return (
                                    <SelectItem key={customer.id} value={String(customer.id)}>
                                        {customer.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <InputError message={errors.customer_id} />
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
                        {data.sales_order_items.map((item, index) => {
                            const product = products.find(p => p.id === item.product_id);
                            const maxStock = product?.stock ?? Infinity;

                            return <div key={`product-${index}`} className='flex justify-between gap-3'>
                                <div className='grid grid-cols-3 w-full gap-3'>
                                    <div className="grid gap-2">
                                        <Select
                                            name="product_id"
                                            value={data.sales_order_items[index].product_id ? String(data.sales_order_items[index].product_id) : undefined}
                                            onValueChange={(value) => {
                                                const product = products.find(p => p.id === parseInt(value));
                                                updateItem(index, 'product_id', product!.id)
                                                updateItem(index, 'price', product?.price ?? 0)
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

                                        <InputError message={errors['sales_order_items.' + index + '.product_id']} />
                                    </div>


                                    <div className="grid gap-2">
                                        <Input
                                            type="number"
                                            name='quantity'
                                            placeholder="Quantity"
                                            max={maxStock}
                                            value={data.sales_order_items[index].quantity}
                                            onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                                        />
                                        <InputError message={errors['sales_order_items.' + index + '.quantity']} />
                                    </div>


                                    <div className="grid gap-2">

                                        <Input
                                            name='price'
                                            type="text"
                                            placeholder="Unit Price"
                                            value={
                                                editingIndex === index
                                                    ? item.price
                                                    : formatRupiah(item.price)
                                            }
                                            onFocus={() => setEditingIndex(index)}
                                            onBlur={() => setEditingIndex(null)}
                                            onChange={(e) => {
                                                const parsed = parseFloat(e.target.value.replace(/[^\d.-]/g, ''));
                                                updateItem(index, "price", isNaN(parsed) ? 0 : parsed);
                                            }}
                                        />
                                        <InputError message={errors['sales_order_items.' + index + '.price']} />
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
                        })}
                    </CollapsibleContent>
                </Collapsible>
            </div>
            <hr />
            <Collapsible
                className="flex flex-col gap-2"
            >
                <div className="flex items-center justify-between gap-4">
                    <p className='text-xl align-middle font-bold'>Sales Order Summary</p>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="flex flex-col gap-2">
                    {data.sales_order_items.map((item, index) => {
                        const product = products.find(p => p.id === item.product_id);

                        return <div key={`product-summary-${index}`} className='flex justify-between'>
                            <p className='font-bold'>{product?.name}</p>
                            <div className='text-end'>
                                <p className='font-bold'>{formatRupiah(item.quantity * item.price)}</p>
                                <p className='text-sm'>Qty: {item.quantity}</p>
                            </div>
                        </div>
                    })}
                    <hr />
                    <div className='flex justify-between font-bold'>
                        <p>Total Amount</p>
                        <p>{formatRupiah(data.total_amount)}</p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </FormDialog>
    );
}
