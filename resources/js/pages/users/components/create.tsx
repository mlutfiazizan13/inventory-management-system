import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FormDialog from '@/components/modals/FormDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/stores/useUserStore';
import { Brand, Category, CreateUser as CreateUserType, Role, User } from '@/types';

export default function CreateUser({ roles }: { roles: Role[] }) {
    const { data, setData, processing, reset, errors, setError, clearErrors } = useForm<Required<CreateUserType>>();

    const stopCreating = useUserStore((state) => state.stopCreating);
    const { createItem } = useUserStore();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await createItem(data);
            reset(); // optional: reset form
        } catch (errs) {
            setError(errs as Record<keyof CreateUserType, string>);
        }
    };

    const closeModal = () => {
        clearErrors();
        reset();
        stopCreating();
    };

    return (
        <FormDialog
            title="Create User"
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitText="Create"
            processing={processing}
            open={useUserStore().isCreating}
            onOpenChange={useUserStore((state) => state.stopCreating)}
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

            <div className="grid gap-2">
                <Label htmlFor="role_id">Role</Label>

                <Select name="role_id" onValueChange={(value) => setData('role_id', Number.parseInt(value))}>
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


            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Password"
                        autoComplete="current-password"
                    />

                    <InputError message={errors.password} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">Password Confirmation</Label>

                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Password Confirmation"
                        autoComplete="current-password_confirmation"
                    />

                    <InputError message={errors.password_confirmation} />
                </div>
            </div>
        </FormDialog>
    );
}
