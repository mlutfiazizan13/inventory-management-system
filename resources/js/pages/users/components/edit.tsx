import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/stores/useUserStore';
import { Role } from '@/types';


export interface EditUserType {
    id: number,
    name: string;
    email: string;
    role_id: number;
}

export default function EditUser({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, reset, errors, setError, clearErrors } = useForm<Required<EditUserType>>();

    const stopEditing = useUserStore((state) => state.stopEditing);

    const { editingItem, updateItem } = useUserStore();

    useEffect(() => {
        if (useUserStore.getState().isEditing && editingItem) {
            setData({
                id: editingItem.id,
                name: editingItem.name,
                email: editingItem.email,
                role_id: editingItem.roles!.at(0)!.id ?? ''
            });            
        }
    }, [useUserStore.getState().isEditing, editingItem]);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateItem(data.id, data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof EditUserType, string>);
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
            open={useUserStore().isEditing}
            onOpenChange={useUserStore((state) => state.stopEditing)}
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

            <div className="grid gap-2">
                <Label htmlFor="role_id">Role</Label>

                <Select name="role_id" onValueChange={(value) => setData('role_id', Number.parseInt(value))} value={String(data.role_id ?? "")}>
                    <SelectTrigger>
                        <SelectValue id="role_id" placeholder="Select Role..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {roles.map((role) => {
                                return (
                                    <SelectItem key={role.id} value={`${role.id}`}>
                                        {role.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <InputError message={errors.role_id} />
            </div>
        </FormDialog>
    );
}
