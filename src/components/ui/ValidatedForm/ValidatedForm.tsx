import { FormEvent, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AlertMessage } from "../../../components";

import { ValidatedFormProps } from "../../../types/uiTypes";

export const ValidatedForm: React.FC<ValidatedFormProps> = ({
  onSubmit,
  error,
  setError,
  localError,
  setLocalError,
  clearLocalErrors,
  onFieldChange,
  fields,
  children,
  className,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const location = useLocation();

  const handleClearLocalErrors = useCallback(() => {
    setLocalError?.(undefined);
    clearLocalErrors?.();
  }, [setLocalError, clearLocalErrors]);

  useEffect(() => {
    handleClearLocalErrors();
  }, [location.pathname, handleClearLocalErrors]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (localError) setLocalError?.(undefined);
    if (error) setError?.(undefined);

    onFieldChange?.();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    for (const field of fields) {
      if (!field.validator(formData[field.name] || "", formData)) {
        setLocalError?.(field.errorMessage);
        return;
      }
    }

    await onSubmit(formData);
  };

  return (
    <div>
      {(localError || error) && (
        <AlertMessage
          message={localError || error}
          type="danger"
          onClose={() => {
            setLocalError?.(undefined);
            setError?.(undefined);
          }}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className={`form-small ${className}`}
        noValidate
      >
        {fields.map((field) => (
          <div className="form-floating mb-3" key={field.name}>
            {field.type === "select" ? (
              <select
                name={field.name}
                className="form-select"
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Bitte auswählen</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                className="form-control"
                placeholder={field.label}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
            <label htmlFor={field.name}>{field.label}</label>
          </div>
        ))}
        {children}
      </form>
    </div>
  );
};
