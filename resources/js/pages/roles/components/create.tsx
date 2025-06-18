import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { useRoleStore } from '@/stores/useRoleStore';
import { CreateRole as CreateRoleType, Role, User } from '@/types';

export default function CreateRole() {
    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<Required<CreateRoleType>>();

    const stopCreating = useRoleStore((state) => state.stopCreating);
    const { createItem } = useRoleStore();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof CreateRoleType, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    return (
        <FormDialog
            title="Create Role"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={useRoleStore().isCreating}
            onOpenChange={useRoleStore((state) => state.stopCreating)}
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
        </FormDialog>
    );
}
