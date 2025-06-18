import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomerStore } from '@/stores/useCustomerStore';
import { Customer } from '@/types';
import { Textarea } from '@/components/ui/textarea';


export default function EditCustomer() {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<Customer>>();

    const stopEditing = useCustomerStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useCustomerStore();

    useEffect(() => {
        if (useCustomerStore.getState().isEditing && editingItem) {
            setData(editingItem);            
        }
    }, [useCustomerStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof Customer, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopEditing();
    };

    return (
        <FormDialog
            title="Edit Customer"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Edit"
            processing={processing}
            open={useCustomerStore().isEditing}
            onOpenChange={useCustomerStore((state) => state.stopEditing)}
        >
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
            </div>


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        onChange={(e) => setData('email', e.target.value)}
                        value={data.email}
                        placeholder="Email"
                        autoComplete="current-email"
                    />

                    <InputError message={errors.email} />
                </div>
            </div>


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>

                    <Input
                        id="phone"
                        type="text"
                        name="phone"
                        onChange={(e) => setData('phone', e.target.value)}
                        value={data.phone}
                        placeholder="Phone"
                        autoComplete="current-phone"
                    />

                    <InputError message={errors.phone} />
                </div>
            </div>


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>

                    <Textarea
                        id='address'
                        name='address'
                        onChange={(e) => setData('address', e.target.value)}
                        value={data.address}
                        placeholder="Type address here." />

                    <InputError message={errors.address} />
                </div>
            </div>
        </FormDialog>
    );
}
