import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';

interface DeleteDialogProps<T, ID> {
    resource: T ;
    id: ID | undefined;
    onDelete: (id: ID) => Promise<void>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemName?: string; // For custom item name in message
    renderName?: string; // To display resource name
}

export default function DeleteDialog<T, ID>({ resource, id, onDelete, open, onOpenChange, itemName = 'item', renderName }: DeleteDialogProps<T, ID>) {
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!id) return;

        setProcessing(true);
        try {
            await onDelete(id);
        } finally {
            setProcessing(false);
            onOpenChange(false);
        }
    };

    const closeModal = () => {
        onOpenChange(false)
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Delete</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this {itemName}?{renderName && ` "${renderName}"`}
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="destructive" disabled={processing} onClick={handleSubmit}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
