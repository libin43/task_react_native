export const validateTitle = (value: string): string => {
    const trimmedValue = value.trim();
  
    if (trimmedValue.length === 0) {
      return "Title is required";
    }
  
    if (trimmedValue.length > 30) {
      return "Title should be at most 30 characters";
    }
  
    return ""; // No error
  };
  
  export const validateDescription = (value: string): string => {
    const trimmedValue = value.trim();
  
    if (trimmedValue.length > 100) {
      return "Description should be at most 100 characters";
    }
  
    return ""; // No error
  };
  