import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormDialog from '@/components/modals/FormDialog';
import { useSupplierStore } from '@/stores/useSupplierStore';
import { Supplier } from '@/types';
import { Textarea } from '@/components/ui/textarea';

export default function EditSupplier() {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<Supplier>>();

    const stopEditing = useSupplierStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useSupplierStore();

    useEffect(() => {
        if (useSupplierStore.getState().isEditing && editingItem) {
            setData({
                ...editingItem
            });
        }
    }, [useSupplierStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof Supplier, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopEditing();
    };

    return (
        <FormDialog
            title="Edit Supplier"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Edit"
            processing={processing}
            open={useSupplierStore().isEditing}
            onOpenChange={useSupplierStore((state) => state.stopEditing)}
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
            </div>

            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="contact_name">Contact Name</Label>

                    <Input
                        id="contact_name"
                        type="text"
                        name="contact_name"
                        value={data.contact_name}
                        onChange={(e) => setData('contact_name', e.target.value)}
                        placeholder="Contact Name"
                        autoComplete="current-contact_name"
                    />

                    <InputError message={errors.contact_name} />
                </div>
            </div>


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
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
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
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
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Type address here." />

                    <InputError message={errors.address} />
                </div>
            </div>
        </FormDialog>
    );
}
