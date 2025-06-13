import { FormEventHandler, ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FormDialogProps {
    title: string;
    children: ReactNode;
    onSubmit: FormEventHandler;
    onCancel?: () => void;
    submitText?: string;
    cancelText?: string;
    processing?: boolean;
    submitVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

export default function FormDialog({
    title,
    children,
    onSubmit,
    onCancel,
    submitText = "Submit",
    cancelText = "Cancel",
    processing = false,
    submitVariant = "default",
    open,
    onOpenChange,
    className,
}: FormDialogProps) {
    const handleSubmit: FormEventHandler = (e) => {
        onSubmit(e);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogTitle>{title}</DialogTitle>
                <hr />

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {children}

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={onCancel}>
                                {cancelText}
                            </Button>
                        </DialogClose>

                        <Button variant={submitVariant} disabled={processing} asChild>
                            <button type="submit">{submitText}</button>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}