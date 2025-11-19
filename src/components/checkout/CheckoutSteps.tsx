'use client'

import { CheckoutStep } from '@/types/checkout'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  currentStep: CheckoutStep
  completedSteps: CheckoutStep[]
}

const steps = [
  { id: 'shipping' as CheckoutStep, label: 'Shipping', description: 'Delivery information' },
  { id: 'payment' as CheckoutStep, label: 'Payment', description: 'Payment method' },
  { id: 'review' as CheckoutStep, label: 'Review', description: 'Review your order' },
]

export function CheckoutSteps({ currentStep, completedSteps }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = step.id === currentStep
          const isPast = index < currentStepIndex

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300',
                  {
                    'bg-primary text-primary-foreground': isCurrent || isCompleted,
                    'bg-muted text-muted-foreground': !isCurrent && !isCompleted && !isPast,
                    'bg-primary/80': isPast && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center min-w-[100px]">
                <div
                  className={cn('font-medium text-sm', {
                    'text-foreground': isCurrent,
                    'text-muted-foreground': !isCurrent,
                  })}
                >
                  {step.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
