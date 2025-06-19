import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';

interface DialogProps<ID> {
    title: string;
    message: string;
    id: ID | undefined;
    onSubmit: (id: ID) => Promise<void>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateStatus<ID>({ title, message, id, onSubmit, open, onOpenChange }: DialogProps<ID>) {
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!id) return;

        setProcessing(true);
        try {
            await onSubmit(id);
        } finally {
            setProcessing(false);

            onOpenChange(false);
        }
        setProcessing(false);
    };

    const closeModal = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{message}</DialogDescription>

                <DialogFooter className="gap-2">
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="default" disabled={processing} onClick={handleSubmit}>
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
