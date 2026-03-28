import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTransferWaste } from '@/hooks/useTransferWaste'
import { useToast } from '@/hooks/useToast'

interface Props {
  open: boolean
  wasteId: bigint
  onClose: () => void
}

export function TransferWasteModal({ open, wasteId, onClose }: Props) {
  const [recipient, setRecipient] = useState('')
  const { mutateAsync, isPending } = useTransferWaste()
  const toast = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const to = await mutateAsync({ wasteId, to: recipient.trim() })
      toast.success(`Waste transferred to ${to}`)
      setRecipient('')
      onClose()
    } catch (err) {
      toast.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Waste #{wasteId.toString()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Recipient address</label>
            <Input
              placeholder="G…"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !recipient}>
              {isPending ? 'Transferring…' : 'Transfer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
