"use client"

import { FC } from "react"
import { Button } from "@/components/ui/button"

interface Field {
  label: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface AuthModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  fields: Field[]
  error?: string | null
  loading?: boolean
  buttonText: string
}

const AuthModal: FC<AuthModalProps> = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  fields,
  error,
  loading,
  buttonText,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 dark:text-gray-50 text-gray-900">{title}</h2>

        {/* Fields */}
        {fields.map((field, idx) => (
          <div key={idx} className="mb-4">
            <label className="block text-sm font-medium mb-1 dark:text-gray-50 text-gray-900">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={field.onChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:text-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        ))}

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary/90"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Please wait..." : buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
