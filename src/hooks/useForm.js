import { useState, useCallback } from 'react';

export function useForm(initialState, validationRules) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    if (validationRules[name]) {
      const error = validationRules[name](value, formData);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
      return !error;
    }
    return true;
  }, [formData, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      if (validationRules[key]) {
        const error = validationRules[key](formData[key], formData);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
    setErrors
  };
}