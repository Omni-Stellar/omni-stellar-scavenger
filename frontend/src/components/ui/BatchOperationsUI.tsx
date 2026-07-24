import React, { useState, useRef } from 'react';
import { CheckSquare, Square, Trash2, Send, Check, Tag, Download } from 'lucide-react';
import { cn } from '@/lib/cn';
import { BATCH_OPERATIONS, BatchOperation } from '@/lib/batchOperations';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface BatchOperationsUIProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onExecuteOperation: (
    operation: string,
    params?: Record<string, any>
  ) => Promise<void>;
  isLoading?: boolean;
}

interface ConfirmDialogState {
  isOpen: boolean;
  operation?: BatchOperation;
  params?: Record<string, any>;
}

const getOperationIcon = (operationId: string) => {
  switch (operationId) {
    case 'transfer':
      return <Send className="w-4 h-4" aria-hidden="true" />;
    case 'verify':
      return <Check className="w-4 h-4" aria-hidden="true" />;
    case 'delete':
      return <Trash2 className="w-4 h-4" aria-hidden="true" />;
    case 'export':
      return <Download className="w-4 h-4" aria-hidden="true" />;
    case 'tag':
      return <Tag className="w-4 h-4" aria-hidden="true" />;
    default:
      return null;
  }
};

export const BatchOperationsUI: React.FC<BatchOperationsUIProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onExecuteOperation,
  isLoading = false,
}) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
  });
  const [tagInput, setTagInput] = useState('');

  // Ref to the button that opened the confirm modal — focus is returned on close
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOperationClick = (
    operation: BatchOperation,
    buttonEl: HTMLButtonElement
  ) => {
    lastTriggerRef.current = buttonEl;
    if (operation.requiresConfirmation) {
      setConfirmDialog({ isOpen: true, operation });
    } else if (operation.id === 'tag') {
      setConfirmDialog({ isOpen: true, operation, params: { tag: tagInput } });
    } else {
      executeOperation(operation);
    }
  };

  const executeOperation = async (operation: BatchOperation) => {
    try {
      await onExecuteOperation(operation.id, confirmDialog.params);
      closeConfirm();
      setTagInput('');
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false });
    // Restore focus to the triggering button
    setTimeout(() => lastTriggerRef.current?.focus(), 0);
  };

  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const hasSelection = selectedCount > 0;
  const operation = confirmDialog.operation;

  return (
    <div className="space-y-4">
      {/* Selection Header */}
      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            aria-label={isAllSelected ? 'Deselect all items' : 'Select all items'}
            aria-pressed={isAllSelected}
            className="p-1 hover:bg-blue-100 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isAllSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" aria-hidden="true" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" aria-hidden="true" />
            )}
          </button>
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} of {totalCount} selected
          </span>
        </div>
        {hasSelection && (
          <button
            onClick={onDeselectAll}
            aria-label="Clear selection"
            className="text-xs text-blue-600 hover:text-blue-700 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Batch Operations */}
      {hasSelection && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Batch Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {BATCH_OPERATIONS.map((op) => (
              <button
                key={op.id}
                onClick={(e) => handleOperationClick(op, e.currentTarget)}
                disabled={isLoading}
                aria-label={`${op.name} ${selectedCount} selected item${selectedCount !== 1 ? 's' : ''}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  op.id === 'delete'
                    ? 'bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-red-50 disabled:opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-100 disabled:opacity-50'
                )}
              >
                {getOperationIcon(op.id)}
                <span>{op.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tag Input (shown before opening the confirm modal for tag operations) */}
      {!confirmDialog.isOpen && (
        <div className="hidden" aria-hidden="true" />
      )}

      {/* Accessible confirm modal — replaces the raw inline div */}
      <Modal
        open={confirmDialog.isOpen && !!operation}
        onClose={closeConfirm}
        title={operation ? `Confirm ${operation.name}` : ''}
        description={
          operation
            ? `${operation.description} This will affect ${selectedCount} item${selectedCount !== 1 ? 's' : ''}.`
            : undefined
        }
        className="sm:max-w-sm"
      >
        {/* Tag input lives inside the modal when the tag operation is selected */}
        {operation?.id === 'tag' && (
          <div className="space-y-2">
            <label htmlFor="batch-tag-modal-input" className="text-sm font-medium">
              Tag name
            </label>
            <input
              id="batch-tag-modal-input"
              type="text"
              placeholder="Enter tag name"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button
            variant="outline"
            onClick={closeConfirm}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => operation && executeOperation(operation)}
            disabled={isLoading || (operation?.id === 'tag' && !tagInput.trim())}
            variant={operation?.id === 'delete' ? 'destructive' : 'primary'}
          >
            {isLoading ? 'Processing…' : 'Confirm'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BatchOperationsUI;
