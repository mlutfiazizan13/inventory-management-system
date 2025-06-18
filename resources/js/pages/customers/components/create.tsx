import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { useCustomerStore } from '@/stores/useCustomerStore';
import { Customer } from '@/types';
import { Textarea } from '@/components/ui/textarea';


export default function CreateCustomer() {
    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<Required<Customer>>();

    const stopCreating = useCustomerStore((state) => state.stopCreating);
    const { createItem } = useCustomerStore();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof Customer, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    return (
        <FormDialog
            title="Create Customer"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={useCustomerStore().isCreating}
            onOpenChange={useCustomerStore((state) => state.stopCreating)}
        >
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
            </div>


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        name="email"
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
