import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleStore } from '@/stores/useRoleStore';
import { Role } from '@/types';


export interface EditRoleType {
    id: number,
    name: string;
}

export default function EditRole() {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<EditRoleType>>();

    const stopEditing = useRoleStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useRoleStore();

    useEffect(() => {
        if (useRoleStore.getState().isEditing && editingItem) {
            setData({
                id: editingItem.id,
                name: editingItem.name,
            });            
        }
    }, [useRoleStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof EditRoleType, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopEditing();
    };

    return (
        <FormDialog
            title="Edit Role"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Edit"
            processing={processing}
            open={useRoleStore().isEditing}
            onOpenChange={useRoleStore((state) => state.stopEditing)}
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
        </FormDialog>
    );
}
