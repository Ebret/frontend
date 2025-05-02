import React, { useState, ReactNode } from 'react';

type Step = {
  title: string;
  content: ReactNode;
  validation?: () => boolean;
};

type MultiStepFormProps = {
  steps: Step[];
  onComplete: () => void;
  initialStep?: number;
};

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onComplete,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [error, setError] = useState<string | null>(null);

  const goToNextStep = () => {
    const currentStepData = steps[currentStep];
    
    // Validate current step if validation function exists
    if (currentStepData.validation && !currentStepData.validation()) {
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      onComplete();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      setError(null);
    }
  };

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  index <= currentStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <div className="mt-2 text-sm text-center">{step.title}</div>
            </div>
          ))}
        </div>
        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-1 bg-gray-200"></div>
          </div>
          <div
            className="absolute inset-0 flex items-center"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          >
            <div className="w-full h-1 bg-indigo-600"></div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Current step content */}
      <div className="mb-6">{steps[currentStep].content}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-md ${
            currentStep === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goToNextStep}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
